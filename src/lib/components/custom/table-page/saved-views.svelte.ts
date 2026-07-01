import { deserializeQuery, emptyQuery, serializeQuery, type Group } from './query-builder/fields';
import type { SortDir } from './types';

export type SavedView = {
	id: string;
	name: string;
	q: Group;
	columnVisibility: Record<string, boolean>;
	columnOrder: string[];
	columnSizing: Record<string, number>;
	sort: string;
	dir: SortDir;
	limit: number;
};

type StoredView = {
	id: string;
	name: string;
	q: string;
	columnVisibility: Record<string, boolean>;
	columnOrder: string[];
	columnSizing: Record<string, number>;
	sort: string;
	dir: SortDir;
	limit: number | 'all';
};

const PREFIX = 'tablepage:';
const SUFFIX = ':saved-views';

function isBrowser(): boolean {
	return typeof window !== 'undefined';
}

function storageKey(queryKey: string): string {
	return PREFIX + queryKey + SUFFIX;
}

function loadStored(queryKey: string): StoredView[] {
	if (!isBrowser()) return [];
	try {
		const raw = window.localStorage.getItem(storageKey(queryKey));
		if (!raw) return [];
		const parsed = JSON.parse(raw);
		return Array.isArray(parsed) ? (parsed as StoredView[]) : [];
	} catch {
		return [];
	}
}

function writeStored(queryKey: string, items: StoredView[]): void {
	if (!isBrowser()) return;
	try {
		window.localStorage.setItem(storageKey(queryKey), JSON.stringify(items));
	} catch {
		// ignore quota / private-mode errors
	}
}

function toLive(s: StoredView): SavedView {
	return {
		id: s.id,
		name: s.name,
		q: deserializeQuery(s.q) ?? emptyQuery(),
		columnVisibility: s.columnVisibility ?? {},
		columnOrder: s.columnOrder ?? [],
		columnSizing: s.columnSizing ?? {},
		sort: s.sort,
		dir: s.dir,
		limit: s.limit === 'all' ? Infinity : s.limit
	};
}

function toStored(v: SavedView): StoredView {
	return {
		id: v.id,
		name: v.name,
		q: serializeQuery(v.q),
		columnVisibility: v.columnVisibility,
		columnOrder: v.columnOrder,
		columnSizing: v.columnSizing,
		sort: v.sort,
		dir: v.dir,
		limit: Number.isFinite(v.limit) ? v.limit : 'all'
	};
}

function newId(): string {
	if (isBrowser() && typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
		return crypto.randomUUID();
	}
	return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export type ViewSnapshot = Omit<SavedView, 'id' | 'name'>;

export function createSavedViewsStore(queryKey: string) {
	// svelte-ignore state_referenced_locally
	let items = $state<SavedView[]>(loadStored(queryKey).map(toLive));

	function persist() {
		writeStored(queryKey, items.map(toStored));
	}

	return {
		get items(): SavedView[] {
			return items;
		},
		save(name: string, snapshot: ViewSnapshot): SavedView {
			const created: SavedView = { id: newId(), name, ...snapshot };
			items = [...items, created];
			persist();
			return created;
		},
		remove(id: string): void {
			items = items.filter((f) => f.id !== id);
			persist();
		}
	};
}

export type SavedViewsStore = ReturnType<typeof createSavedViewsStore>;
