/*
 * query.ts — connects the fake backend (`fetchLogs`) to TanStack Query.
 *
 * TanStack Query is the layer that makes data fetching feel smooth:
 *   • Caches responses, so revisiting a page is instant
 *   • Dedupes simultaneous requests for the same data
 *   • Tracks loading / error states for the UI
 *   • Refetches when you tell it to (or in the background)
 *
 * Each query is identified by a "queryKey" — an array that uniquely
 * describes WHAT data is being fetched. If the key changes, TanStack
 * Query knows to fetch fresh data (or use cached data if it has it).
 */

import { createQuery, keepPreviousData } from '@tanstack/svelte-query';
import { fetchLogs, type LogsQuery } from './api';

/**
 * logsKeys — central place to build query keys for log-related data.
 *
 * Putting the entire `LogsQuery` object inside the key means: every
 * unique combination of filters / sort / cursor is cached separately.
 * Hit the back button after changing a filter → instant, served from cache.
 *
 * The `all` array is the "root" — useful later if we want to invalidate
 * ALL log-related caches at once (e.g. after creating a new log).
 */
export const logsKeys = {
	all: ['logs'] as const,
	list: (q: LogsQuery) => [...logsKeys.all, 'list', q] as const
};

/**
 * createLogsQuery — wraps `fetchLogs` in TanStack Query.
 *
 * Used by: `+page.svelte`. Returns a reactive object whose `.data`,
 * `.isFetching`, `.error` etc. update automatically as the request
 * progresses.
 *
 * The `getQuery` parameter is a FUNCTION (not a value) so TanStack
 * Query can call it again whenever the URL state changes — that's how
 * it knows to refetch when the user changes a filter.
 *
 * Key options:
 *   • placeholderData: keepPreviousData — while fetching the new page,
 *     keep showing the OLD rows instead of going blank. Makes pagination
 *     and filter changes feel instant.
 *   • staleTime: 30s — within 30 seconds, the cached data is considered
 *     fresh enough; we don't refetch even if the component re-mounts.
 */
export function createLogsQuery(getQuery: () => LogsQuery) {
	return createQuery(() => ({
		queryKey: logsKeys.list(getQuery()),
		queryFn: () => fetchLogs(getQuery()),
		placeholderData: keepPreviousData,
		staleTime: 30_000
	}));
}
