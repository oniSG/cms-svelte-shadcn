import { queryParameters, ssp } from 'sveltekit-search-params';
import { deserializeQuery, emptyQuery, serializeQuery, type Group } from './query-builder/fields';
import type { DefaultSort, SortDir } from './types';

const dateParam = {
	encode: (v: Date) => v.toISOString(),
	decode: (v: string | null): Date | null => {
		if (!v) return null;
		const d = new Date(v);
		return isNaN(d.getTime()) ? null : d;
	}
};

function stringEnum<T extends string>(defaultValue: T) {
	return {
		encode: (v: T) => v,
		decode: (v: string | null) => (v ?? defaultValue) as T,
		defaultValue
	};
}

function limitParam(defaultValue: number) {
	return {
		encode: (v: number) => (Number.isFinite(v) ? String(v) : 'all'),
		decode: (v: string | null): number => {
			if (v == null) return defaultValue;
			if (v === 'all' || v === 'infinity') return Infinity;
			const n = Number(v);
			return Number.isFinite(n) && n > 0 ? n : defaultValue;
		}
	};
}

const queryParam = {
	encode: (v: Group) => serializeQuery(v),
	decode: (v: string | null): Group | null => deserializeQuery(v)
};

export type TableParamsConfig = {
	defaultLimit: number;
	defaultSort: DefaultSort;
};

export function createTableParams(config: TableParamsConfig) {
	const defaultDir: SortDir = config.defaultSort.desc === false ? 'asc' : 'desc';
	return queryParameters(
		{
			as_of: dateParam,
			page: ssp.number(1),
			limit: limitParam(config.defaultLimit),
			sort: stringEnum<string>(config.defaultSort.id),
			dir: stringEnum<SortDir>(defaultDir),
			q: queryParam
		},
		{ pushHistory: false, showDefaults: false }
	);
}

export type TableParamsStore = ReturnType<typeof createTableParams>;

export type ResolvedTableQuery = {
	asOf: Date;
	page: number;
	limit: number;
	sort: string;
	dir: SortDir;
	q: Group;
};

export function resolveTableQuery(
	raw: Record<string, unknown> | null | undefined,
	config: TableParamsConfig,
	fallbackAsOf: Date
): ResolvedTableQuery {
	const s = raw ?? {};
	const defaultDir: SortDir = config.defaultSort.desc === false ? 'asc' : 'desc';
	return {
		asOf: (s.as_of as Date | null) ?? fallbackAsOf,
		page: (s.page as number) ?? 1,
		limit: (s.limit as number) ?? config.defaultLimit,
		sort: (s.sort as string) ?? config.defaultSort.id,
		dir: (s.dir as SortDir) ?? defaultDir,
		q: (s.q as Group | null) ?? emptyQuery()
	};
}

export type TableParamsPatch = {
	q?: Group;
	sort?: string;
	dir?: SortDir;
	limit?: number;
};

export function patchAndResetPage(store: TableParamsStore, patch: TableParamsPatch) {
	store.update((curr) => ({
		...curr,
		page: 1,
		...('q' in patch ? { q: patch.q } : {}),
		...('sort' in patch ? { sort: patch.sort } : {}),
		...('dir' in patch ? { dir: patch.dir } : {}),
		...('limit' in patch ? { limit: patch.limit } : {})
	}));
}

export function goToPage(store: TableParamsStore, page: number) {
	store.update((curr) => ({ ...curr, page }));
}

export function goNext(store: TableParamsStore, totalPages: number) {
	store.update((curr) => ({ ...curr, page: Math.min(totalPages, (curr.page ?? 1) + 1) }));
}

export function goPrev(store: TableParamsStore) {
	store.update((curr) => ({ ...curr, page: Math.max(1, (curr.page ?? 1) - 1) }));
}

export function resetQuery(store: TableParamsStore) {
	store.update((curr) => ({ ...curr, q: emptyQuery(), page: 1 }));
}

export function clampPage(
	store: TableParamsStore,
	currentPage: number,
	totalPages: number | undefined
) {
	if (totalPages == null) return;
	if (currentPage > totalPages) {
		store.update((curr) => ({ ...curr, page: totalPages }));
	}
}
