import { data as seed } from './data';
import type { Log } from '../log';
import { matchGroup, type Group } from '$lib/components/custom/table-page/query-builder/fields';
import type { TableFetchArgs, TablePageResponse } from '$lib/components/custom/table-page';

function sortValue(log: Log, sort: string): string | number {
	if (sort === 'time') return log.time.getTime();
	const v = (log as unknown as Record<string, unknown>)[sort];
	return typeof v === 'number' ? v : String(v ?? '');
}

function compare(a: Log, b: Log, sort: string, dir: 'asc' | 'desc'): number {
	const va = sortValue(a, sort);
	const vb = sortValue(b, sort);
	let cmp = va < vb ? -1 : va > vb ? 1 : 0;
	if (cmp === 0) cmp = a.id < b.id ? -1 : a.id > b.id ? 1 : 0;
	return dir === 'desc' ? -cmp : cmp;
}

function applyFilters(rows: Log[], asOf: Date, q: Group): Log[] {
	return rows.filter((r) => {
		if (r.time > asOf) return false;
		return matchGroup(q, r as unknown as Record<string, unknown>);
	});
}

export async function fetchLogs(args: TableFetchArgs): Promise<TablePageResponse<Log>> {
	const filtered = applyFilters(seed, args.asOf, args.q as Group);
	const sorted = [...filtered].sort((a, b) => compare(a, b, args.sort, args.dir));

	const total = sorted.length;
	const totalPages = Math.max(1, Math.ceil(total / args.limit));
	const page = Math.min(Math.max(1, args.page), totalPages);

	const start = (page - 1) * args.limit;
	const items = sorted.slice(start, start + args.limit);

	return { items, total, totalPages };
}
