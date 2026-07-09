import { data as seed } from './data';
import type { Event } from '../event-list';
import {
	getShortcutMulti,
	matchGroup,
	shortcutSource,
	type Group
} from '$lib/components/custom/table-page/query-builder/fields';
import type { TableFetchArgs, TablePageResponse } from '$lib/components/custom/table-page';

const LABEL_SHORTCUT_ID = 'labels';
const CREATOR_SHORTCUT_ID = 'creators';

function withoutShortcutIds(q: Group, ids: string[]): Group {
	const sources = new Set(ids.map(shortcutSource));
	return {
		...q,
		children: q.children.filter((c) => !c.source || !sources.has(c.source))
	};
}

function sortValue(event: Event, sort: string): string | number {
	if (sort === 'time') return event.time.getTime();
	if (sort === 'id') return event.id;
	if (sort === 'label') return event.label.join(', ').toLowerCase();
	const value = (event as unknown as Record<string, unknown>)[sort];
	if (typeof value === 'number') return value;
	if (typeof value === 'boolean') return value ? 1 : 0;
	return String(value ?? '').toLowerCase();
}

function compare(a: Event, b: Event, sort: string, dir: 'asc' | 'desc'): number {
	const va = sortValue(a, sort);
	const vb = sortValue(b, sort);
	let cmp = va < vb ? -1 : va > vb ? 1 : 0;
	if (cmp === 0) cmp = a.id < b.id ? -1 : a.id > b.id ? 1 : 0;
	return dir === 'desc' ? -cmp : cmp;
}

function applyFilters(rows: Event[], q: Group): Event[] {
	const selectedLabels = getShortcutMulti(q, LABEL_SHORTCUT_ID);
	const selectedCreators = getShortcutMulti(q, CREATOR_SHORTCUT_ID);
	const qRest = withoutShortcutIds(q, [LABEL_SHORTCUT_ID, CREATOR_SHORTCUT_ID]);

	return rows.filter((row) => {
		if (selectedLabels.length > 0 && !selectedLabels.some((tag) => row.label.includes(tag))) {
			return false;
		}
		if (selectedCreators.length > 0 && !selectedCreators.includes(row.name)) {
			return false;
		}
		return matchGroup(qRest, row as unknown as Record<string, unknown>);
	});
}

export async function fetchEvents(args: TableFetchArgs): Promise<TablePageResponse<Event>> {
	const filtered = applyFilters(seed, args.q as Group);
	const sorted = [...filtered].sort((a, b) => compare(a, b, args.sort, args.dir));

	const total = sorted.length;
	const totalPages = Math.max(1, Math.ceil(total / args.limit));
	const page = Math.min(Math.max(1, args.page), totalPages);

	const start = (page - 1) * args.limit;
	const items = sorted.slice(start, start + args.limit);

	return { items, total, totalPages };
}

export function eventCreatorOptions(): Array<{ value: string; label: string }> {
	return seed
		.map((event) => ({ value: event.name, label: event.name }))
		.filter((option, index, all) => all.findIndex((item) => item.value === option.value) === index);
}
