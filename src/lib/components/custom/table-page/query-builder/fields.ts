import type { QueryFieldDef, QueryFieldType } from '../types';
import * as m from '$lib/paraglide/messages.js';

export type Operator = { value: string; label: () => string };

export const operators: Record<QueryFieldType, Operator[]> = {
	text: [
		{ value: 'equals', label: () => m.qb_op_equals() },
		{ value: 'contains', label: () => m.qb_op_contains() },
		{ value: 'starts_with', label: () => m.qb_op_starts_with() },
		{ value: 'ends_with', label: () => m.qb_op_ends_with() }
	],
	number: [
		{ value: 'equals', label: () => m.qb_op_equals() },
		{ value: 'greater_than', label: () => m.qb_op_greater_than() },
		{ value: 'less_than', label: () => m.qb_op_less_than() }
	],
	select: [
		{ value: 'is', label: () => m.qb_op_is() },
		{ value: 'is_not', label: () => m.qb_op_is_not() }
	],
	date: [
		{ value: 'equals', label: () => m.qb_op_on() },
		{ value: 'before', label: () => m.qb_op_before() },
		{ value: 'after', label: () => m.qb_op_after() }
	],
	bool: [
		{ value: 'is', label: () => m.qb_op_is() },
		{ value: 'is_not', label: () => m.qb_op_is_not() }
	]
};

export type Combinator = 'and' | 'or';

type Base = { id: string; field: string; operator: string; source?: string };
export type TextFilter = Base & { type: 'text'; value: string };
export type NumberFilter = Base & { type: 'number'; value: number | null };
export type DateFilter = Base & { type: 'date'; value: Date | null };
export type SelectFilter = Base & { type: 'select'; value: string };
export type BoolFilter = Base & { type: 'bool'; value: boolean };
export type Filter = TextFilter | NumberFilter | DateFilter | SelectFilter | BoolFilter;

export type Group = {
	id: string;
	type: 'group';
	combinator: Combinator;
	source?: string;
	children: Node[];
};

export type Node = Filter | Group;

export function getField(fields: QueryFieldDef[], value: string): QueryFieldDef | undefined {
	return fields.find((f) => f.value === value);
}

export function createFilter(field: QueryFieldDef, id: string = crypto.randomUUID()): Filter {
	const operator = operators[field.type][0].value;
	const base = { id, field: field.value, operator };
	switch (field.type) {
		case 'text':
			return { ...base, type: 'text', value: '' };
		case 'number':
			return { ...base, type: 'number', value: null };
		case 'date':
			return { ...base, type: 'date', value: null };
		case 'select':
			return { ...base, type: 'select', value: '' };
		case 'bool':
			return { ...base, type: 'bool', value: false };
	}
}

export function createGroup(combinator: Combinator = 'and'): Group {
	return {
		id: crypto.randomUUID(),
		type: 'group',
		combinator,
		children: []
	};
}

export function countFilters(node: Node): number {
	if (node.type === 'group') {
		return node.children.reduce((sum, c) => sum + countFilters(c), 0);
	}
	return 1;
}

export function emptyQuery(): Group {
	return { id: crypto.randomUUID(), type: 'group', combinator: 'and', children: [] };
}

type Serialized = Record<string, unknown>;

function serializeNode(n: Node): Serialized {
	if (n.type === 'group') {
		return {
			type: 'group',
			combinator: n.combinator,
			source: n.source,
			children: n.children.map(serializeNode)
		};
	}
	if (n.type === 'date') {
		return {
			type: 'date',
			field: n.field,
			operator: n.operator,
			source: n.source,
			value: n.value ? n.value.toISOString() : null
		};
	}
	return {
		type: n.type,
		field: n.field,
		operator: n.operator,
		source: n.source,
		value: n.value
	};
}

function deserializeNode(d: Serialized): Node {
	if (d.type === 'group') {
		return {
			id: crypto.randomUUID(),
			type: 'group',
			combinator: d.combinator as Combinator,
			source: d.source as string | undefined,
			children: (d.children as Serialized[]).map(deserializeNode)
		};
	}
	if (d.type === 'date') {
		return {
			id: crypto.randomUUID(),
			type: 'date',
			field: d.field as string,
			operator: d.operator as string,
			source: d.source as string | undefined,
			value: d.value ? new Date(d.value as string) : null
		};
	}
	return {
		id: crypto.randomUUID(),
		type: d.type as 'text' | 'number' | 'select' | 'bool',
		field: d.field as string,
		operator: d.operator as string,
		source: d.source as string | undefined,
		value: d.value as never
	} as Filter;
}

export function serializeQuery(g: Group): string {
	return JSON.stringify(serializeNode(g));
}

export function deserializeQuery(s: string | null | undefined): Group | null {
	if (!s) return null;
	try {
		const data = JSON.parse(s) as Serialized;
		const node = deserializeNode(data);
		return node.type === 'group' ? node : null;
	} catch {
		return null;
	}
}

function sameDay(a: Date, b: Date): boolean {
	return (
		a.getFullYear() === b.getFullYear() &&
		a.getMonth() === b.getMonth() &&
		a.getDate() === b.getDate()
	);
}

function matchFilter(f: Filter, row: Record<string, unknown>): boolean {
	const value = row[f.field];
	switch (f.type) {
		case 'text': {
			const text = String(value ?? '');
			const needle = f.value;
			if (!needle) return true;
			const tL = text.toLowerCase();
			const nL = needle.toLowerCase();
			switch (f.operator) {
				case 'equals':
					return text === needle;
				case 'contains':
					return tL.includes(nL);
				case 'starts_with':
					return tL.startsWith(nL);
				case 'ends_with':
					return tL.endsWith(nL);
				default:
					return false;
			}
		}
		case 'select': {
			const v = String(value ?? '');
			switch (f.operator) {
				case 'is':
					return v === f.value;
				case 'is_not':
					return v !== f.value;
				default:
					return false;
			}
		}
		case 'number': {
			if (f.value == null) return true;
			const n = Number(value);
			switch (f.operator) {
				case 'equals':
					return n === f.value;
				case 'greater_than':
					return n > f.value;
				case 'less_than':
					return n < f.value;
				default:
					return false;
			}
		}
		case 'date': {
			if (!f.value) return true;
			const d = value instanceof Date ? value : new Date(value as string);
			switch (f.operator) {
				case 'equals':
					return sameDay(d, f.value);
				case 'before':
					return d <= f.value;
				case 'after':
					return d >= f.value;
				default:
					return false;
			}
		}
		case 'bool': {
			const v = Boolean(value);
			switch (f.operator) {
				case 'is':
					return v === f.value;
				case 'is_not':
					return v !== f.value;
				default:
					return false;
			}
		}
	}
}

function matchNode(n: Node, row: Record<string, unknown>): boolean {
	return n.type === 'group' ? matchGroup(n, row) : matchFilter(n, row);
}

export function matchGroup(g: Group, row: Record<string, unknown>): boolean {
	if (g.children.length === 0) return true;
	return g.combinator === 'and'
		? g.children.every((c) => matchNode(c, row))
		: g.children.some((c) => matchNode(c, row));
}

export function shortcutSource(id: string): string {
	return `shortcut:${id}`;
}

function removeShortcut(root: Group, source: string): Group {
	return { ...root, children: root.children.filter((c) => c.source !== source) };
}

function getShortcutChildren(root: Group, source: string): Node[] {
	return root.children.filter((c) => c.source === source);
}

export function getShortcutSearch(root: Group, id: string): string {
	const source = shortcutSource(id);
	for (const c of getShortcutChildren(root, source)) {
		if (c.type === 'group') {
			const first = c.children.find((cc): cc is TextFilter => cc.type === 'text');
			if (first) return first.value;
		}
	}
	return '';
}

export function getShortcutSearchFields(root: Group, id: string): string[] {
	const source = shortcutSource(id);
	for (const c of getShortcutChildren(root, source)) {
		if (c.type === 'group') {
			return c.children.filter((cc): cc is TextFilter => cc.type === 'text').map((cc) => cc.field);
		}
	}
	return [];
}

export function setShortcutSearch(root: Group, id: string, value: string, fields: string[]): Group {
	const source = shortcutSource(id);
	const cleaned = removeShortcut(root, source);
	if (!value || fields.length === 0) return cleaned;
	const mk = (field: string): TextFilter => ({
		id: crypto.randomUUID(),
		type: 'text',
		field,
		operator: 'contains',
		value
	});
	return {
		...cleaned,
		children: [
			...cleaned.children,
			{
				id: crypto.randomUUID(),
				type: 'group',
				combinator: 'or',
				source,
				children: fields.map(mk)
			}
		]
	};
}

export function getShortcutMulti(root: Group, id: string): string[] {
	const source = shortcutSource(id);
	const out: string[] = [];
	for (const c of getShortcutChildren(root, source)) {
		if (c.type === 'group') {
			for (const cc of c.children) if (cc.type === 'select') out.push(cc.value);
		} else if (c.type === 'select') {
			out.push(c.value);
		}
	}
	return out;
}

export function setShortcutMulti(root: Group, id: string, field: string, values: string[]): Group {
	const source = shortcutSource(id);
	const cleaned = removeShortcut(root, source);
	if (values.length === 0) return cleaned;
	const filters: SelectFilter[] = values.map((v) => ({
		id: crypto.randomUUID(),
		type: 'select',
		field,
		operator: 'is',
		value: v,
		source
	}));
	if (filters.length === 1) {
		return { ...cleaned, children: [...cleaned.children, filters[0]] };
	}
	return {
		...cleaned,
		children: [
			...cleaned.children,
			{
				id: crypto.randomUUID(),
				type: 'group',
				combinator: 'or',
				source,
				children: filters
			}
		]
	};
}

export function getShortcutDateRange(
	root: Group,
	id: string
): { from: Date | null; to: Date | null } {
	const source = shortcutSource(id);
	let from: Date | null = null;
	let to: Date | null = null;
	for (const c of getShortcutChildren(root, source)) {
		if (c.type !== 'date') continue;
		if (c.operator === 'after' && c.value) from = c.value;
		if (c.operator === 'before' && c.value) to = c.value;
	}
	return { from, to };
}

export function setShortcutDateRange(
	root: Group,
	id: string,
	field: string,
	from: Date | null,
	to: Date | null
): Group {
	const source = shortcutSource(id);
	const cleaned = removeShortcut(root, source);
	if (!from && !to) return cleaned;
	const extras: DateFilter[] = [];
	if (from)
		extras.push({
			id: crypto.randomUUID(),
			type: 'date',
			field,
			operator: 'after',
			value: from,
			source
		});
	if (to)
		extras.push({
			id: crypto.randomUUID(),
			type: 'date',
			field,
			operator: 'before',
			value: to,
			source
		});
	return { ...cleaned, children: [...cleaned.children, ...extras] };
}
