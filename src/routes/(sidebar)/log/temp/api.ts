/*
 * api.ts — the FAKE BACKEND for the logs page.
 *
 * The real backend doesn't exist yet, so this file pretends to be one.
 * It takes a query object (filters, sort, snapshot, page, limit) and
 * returns a page of log rows after a fake 1-1.5s delay — exactly like a
 * real API call would feel in the UI.
 *
 * When the real backend is ready, the only change needed is to replace
 * `fetchLogs` with a real `fetch(...)` call. The rest of the app
 * (URL state, TanStack Query, the table) won't need to change at all,
 * because they all talk to this function through its typed shape.
 *
 * Pagination model: SNAPSHOT + OFFSET.
 *   - `asOf` is a frozen-in-time ceiling. Rows with `time > asOf` are
 *     invisible. Captured on first visit and persisted in the URL so the
 *     view doesn't shift while the user pages through it.
 *   - `page` (1-indexed) + `limit` slice the snapshot.
 *   - The response includes `total` and `totalPages` so the UI can
 *     render "Page 3 of 47" and a real page-number bar.
 *   - To see new rows, the user clicks "Refresh" → `asOf := now()`.
 */

import { data as seed } from './data';
import type { ActionType, Log } from '../columns';

// ---- Public types: the contract between the "backend" and the rest of the app ----

export type LogsSort = 'time' | 'type' | 'email' | 'user_id' | 'id';
export type LogsDir = 'asc' | 'desc';

// LogsQuery is what the frontend SENDS to the backend.
export type LogsQuery = {
	asOf: Date; // snapshot anchor — ceiling on `time`
	page: number; // 1-indexed page number within the snapshot
	limit: number; // page size
	sort: LogsSort; // which column to sort by
	dir: LogsDir; // ascending or descending
	types: ActionType[]; // filter: only show these action types (empty = all)
	emails: string[]; // filter: only show these user emails (empty = all)
	from: Date | null; // filter: only show logs at or after this date
	to: Date | null; // filter: only show logs at or before this date
};

// LogsResponse is what the backend RETURNS for a query.
export type LogsResponse = {
	items: Log[]; // the rows on this page
	total: number; // total rows matching asOf + filters across all pages
	page: number; // echo of the page that was served (clamped if out of bounds)
	totalPages: number; // ceil(total / limit) — at least 1
};

// LogsPatch is a "partial update" to the query — used when the user
// changes ONE thing (filter, sort, page size). The page merges the
// patch into the current query and resets `page` to 1.
//
// `asOf` and `page` are excluded because they have dedicated handlers:
//   - `asOf` is changed only by "Refresh" (`refreshSnapshot`).
//   - `page` is changed only by pagination (`goToPage`/`goNext`/`goPrev`).
export type LogsPatch = Partial<
	Pick<LogsQuery, 'types' | 'emails' | 'from' | 'to' | 'sort' | 'dir' | 'limit'>
>;

// ---- Sort comparator ----

function sortValue(log: Log, sort: LogsSort): string | number {
	return sort === 'time' ? log.time.getTime() : log[sort];
}

// Sorts by the chosen column first, then by `id` as a deterministic tiebreaker.
function compare(a: Log, b: Log, sort: LogsSort, dir: LogsDir): number {
	const va = sortValue(a, sort);
	const vb = sortValue(b, sort);
	let cmp = va < vb ? -1 : va > vb ? 1 : 0;
	if (cmp === 0) cmp = a.id < b.id ? -1 : a.id > b.id ? 1 : 0;
	return dir === 'desc' ? -cmp : cmp;
}

// Applies snapshot ceiling + user filters. The snapshot is the hard
// upper bound — `to` further narrows it if the user picked an earlier date.
function applyFilters(rows: Log[], q: LogsQuery): Log[] {
	const ceiling = q.to ? new Date(Math.min(q.to.getTime(), q.asOf.getTime())) : q.asOf;
	return rows.filter((r) => {
		if (r.time > ceiling) return false;
		if (q.from && r.time < q.from) return false;
		if (q.types.length && !q.types.includes(r.type)) return false;
		if (q.emails.length && !q.emails.includes(r.email)) return false;
		return true;
	});
}

// Fakes network latency so loading states behave realistically before
// the real API exists.
function delay(): Promise<void> {
	const ms = 1000 + Math.random() * 500;
	return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * fetchLogs — the only function the rest of the app calls.
 *
 * Used by: `query.ts` → `createLogsQuery`, which wraps it in TanStack
 * Query for caching, deduping, and loading states.
 *
 * Flow:
 *   1. Wait 1-1.5s (fake latency).
 *   2. Apply snapshot ceiling (asOf) + user filters.
 *   3. Sort by the chosen column + direction.
 *   4. Compute total, clamp page if out of bounds.
 *   5. Slice out one page worth of rows by (page-1) * limit.
 */
export async function fetchLogs(q: LogsQuery): Promise<LogsResponse> {
	console.log('fetchLogs', q);
	await delay();

	const filtered = applyFilters(seed, q);
	const sorted = [...filtered].sort((a, b) => compare(a, b, q.sort, q.dir));

	const total = sorted.length;
	const totalPages = Math.max(1, Math.ceil(total / q.limit));
	const page = Math.min(Math.max(1, q.page), totalPages);

	const start = (page - 1) * q.limit;
	const items = sorted.slice(start, start + q.limit);

	return { items, total, page, totalPages };
}
