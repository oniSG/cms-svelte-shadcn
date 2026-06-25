/*
 * url-state.svelte.ts — keeps the table's settings in the URL.
 *
 * Pagination model: SNAPSHOT + OFFSET (see api.ts header).
 *
 * URL contract:
 *   ?as_of=2026-03-05T14:23:11Z   ← snapshot anchor (frozen ceiling on time)
 *   &page=3                       ← 1-indexed page within the snapshot
 *   &limit=10                     ← page size
 *   &sort=time&dir=desc           ← which column / direction
 *   &types=login,action_run       ← filter by action type
 *   &emails=...                   ← filter by user email
 *   &from=...&to=...              ← user-controlled date range
 *
 * Why URL-state for this:
 *   • Refresh the page → exact same snapshot + page
 *   • Copy/paste the URL → shareable frozen view
 *   • Browser back/forward → works as you'd expect
 *
 * Snapshot lifecycle:
 *   • First visit: `+page.svelte` writes `as_of=now()` to the URL.
 *   • Filter / sort / limit changes: `as_of` is preserved, `page` resets to 1.
 *   • Page navigation: `as_of` is preserved.
 *   • "Refresh" button: `as_of := now()`, `page := 1`. New rows become visible.
 */

import { queryParameters, ssp } from 'sveltekit-search-params';
import type { ActionType } from './columns';
import type { LogsDir, LogsPatch, LogsQuery, LogsSort } from './temp/api';

const DEFAULT_LIMIT = 10;
const DEFAULT_SORT: LogsSort = 'time';
const DEFAULT_DIR: LogsDir = 'desc';
const DEFAULT_PAGE = 1;

// Date <-> ISO string round-trip for URL storage.
const dateParam = {
	encode: (v: Date) => v.toISOString(),
	decode: (v: string | null): Date | null => {
		if (!v) return null;
		const d = new Date(v);
		return isNaN(d.getTime()) ? null : d;
	}
};

// Typed string param (e.g. only allows 'asc' | 'desc').
function stringEnum<T extends string>(defaultValue: T) {
	return {
		encode: (v: T) => v,
		decode: (v: string | null) => (v ?? defaultValue) as T,
		defaultValue
	};
}

export function createLogsParams() {
	return queryParameters(
		{
			as_of: dateParam,
			page: ssp.number(DEFAULT_PAGE),
			limit: ssp.number(DEFAULT_LIMIT),
			sort: stringEnum<LogsSort>(DEFAULT_SORT),
			dir: stringEnum<LogsDir>(DEFAULT_DIR),
			types: ssp.array<ActionType>([]),
			emails: ssp.array<string>([]),
			from: dateParam,
			to: dateParam
		},
		{ pushHistory: false, showDefaults: false }
	);
}

export type LogsParamsStore = ReturnType<typeof createLogsParams>;

/**
 * toLogsQuery — converts the raw URL-state object into the shape
 * `fetchLogs` expects. Fills in defaults for any missing field.
 *
 * `fallbackAsOf` is used when the URL doesn't yet have `as_of` (the
 * narrow window between mount and the $effect that writes it). After
 * the URL is hydrated, raw.as_of always wins.
 */
type RawParams = Record<string, unknown>;
export function toLogsQuery(raw: RawParams | null | undefined, fallbackAsOf: Date): LogsQuery {
	const s = raw ?? {};
	return {
		asOf: (s.as_of as Date | null) ?? fallbackAsOf,
		page: (s.page as number) ?? DEFAULT_PAGE,
		limit: (s.limit as number) ?? DEFAULT_LIMIT,
		sort: (s.sort as LogsSort) ?? DEFAULT_SORT,
		dir: (s.dir as LogsDir) ?? DEFAULT_DIR,
		types: (s.types as ActionType[]) ?? [],
		emails: (s.emails as string[]) ?? [],
		from: (s.from as Date | null) ?? null,
		to: (s.to as Date | null) ?? null
	};
}

/**
 * patchAndResetPage — update one or more filter/sort/limit values AND
 * reset `page` to 1 in the SAME write. `as_of` is preserved.
 *
 * Why reset the page? After a filter or sort change, the row at page 3
 * in the OLD result set has nothing to do with page 3 in the NEW result
 * set. Sending the user back to page 1 is the only correct behaviour.
 */
export function patchAndResetPage(store: LogsParamsStore, patch: LogsPatch) {
	store.update((curr) => ({ ...curr, ...patch, page: 1 }));
}

/** Jump directly to a specific page (used by the page-number bar). */
export function goToPage(store: LogsParamsStore, page: number) {
	store.update((curr) => ({ ...curr, page }));
}

/** Move forward / backward one page (used by the Prev/Next arrows). */
export function goNext(store: LogsParamsStore, totalPages: number) {
	store.update((curr) => ({ ...curr, page: Math.min(totalPages, (curr.page ?? 1) + 1) }));
}
export function goPrev(store: LogsParamsStore) {
	store.update((curr) => ({ ...curr, page: Math.max(1, (curr.page ?? 1) - 1) }));
}

/**
 * refreshSnapshot — take a new snapshot and start over from page 1.
 * Filters/sort/limit are preserved. This is the ONLY user action that
 * lets new rows become visible.
 */
export function refreshSnapshot(store: LogsParamsStore) {
	// Plain Date — handed straight to the URL store, serialized to ISO. Not reactive state.
	// eslint-disable-next-line svelte/prefer-svelte-reactivity
	store.update((curr) => ({ ...curr, as_of: new Date(), page: 1 }));
}

/** Clears every filter and resets the page. Snapshot is preserved. */
export function resetAll(store: LogsParamsStore) {
	store.update((curr) => ({
		...curr,
		types: [],
		emails: [],
		from: null,
		to: null,
		page: 1
	}));
}

/**
 * ensureAsOf — if the URL has no `as_of`, write `now()` to it.
 * Called once from `+page.svelte` so the URL is shareable / refresh-safe.
 */
export function ensureAsOf(store: LogsParamsStore, params: RawParams | null | undefined) {
	if (!params?.as_of) {
		// Plain Date — serialized to ISO by the URL store, not held as reactive state.
		// eslint-disable-next-line svelte/prefer-svelte-reactivity
		store.update((curr) => ({ ...curr, as_of: new Date() }));
	}
}

/**
 * clampPage — if the current page is past the last page (e.g. user
 * narrowed filters and now only 5 pages exist but URL has page=99),
 * snap back to the last valid page.
 */
export function clampPage(
	store: LogsParamsStore,
	currentPage: number,
	totalPages: number | undefined
) {
	if (totalPages == null) return;
	if (currentPage > totalPages) {
		store.update((curr) => ({ ...curr, page: totalPages }));
	}
}
