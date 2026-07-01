import { createQuery, createInfiniteQuery, keepPreviousData } from '@tanstack/svelte-query';
import type { TableFetchArgs, TableFetcher, TablePageResponse } from './types';

export function createTableQuery<Row>(
	key: string,
	fetcher: TableFetcher<Row>,
	getQuery: () => TableFetchArgs,
	getEnabled: () => boolean = () => true
) {
	return createQuery<TablePageResponse<Row>>(() => ({
		queryKey: [key, 'list', getQuery()],
		queryFn: () => fetcher(getQuery()),
		placeholderData: keepPreviousData,
		staleTime: 30_000,
		enabled: getEnabled()
	}));
}

export function createTableInfiniteQuery<Row>(
	key: string,
	fetcher: TableFetcher<Row>,
	getBaseArgs: () => Omit<TableFetchArgs, 'page' | 'limit'>,
	getLimit: () => number,
	getEnabled: () => boolean
) {
	return createInfiniteQuery<TablePageResponse<Row>>(() => ({
		queryKey: [key, 'list-infinite', getBaseArgs(), getLimit()],
		queryFn: ({ pageParam }) =>
			fetcher({ ...getBaseArgs(), page: pageParam as number, limit: getLimit() }),
		initialPageParam: 1,
		getNextPageParam: (lastPage, allPages, lastPageParam) => {
			const loaded = allPages.reduce((s, p) => s + p.items.length, 0);
			if (loaded >= lastPage.total) return undefined;
			if ((lastPageParam as number) >= lastPage.totalPages) return undefined;
			return (lastPageParam as number) + 1;
		},
		placeholderData: keepPreviousData,
		enabled: getEnabled(),
		staleTime: 30_000
	}));
}
