import { data as seed } from './data';
import type { FanAction } from '../fan-action';
import { matchGroup, type Group } from '$lib/components/custom/table-page/query-builder/fields';
import type { TableFetchArgs, TablePageResponse } from '$lib/components/custom/table-page';

function sortValue(a: FanAction, sort: string): string | number {
	if (sort === 'created_at') return a.created_at.getTime();
	if (sort === 'id') return a.id;
	const v = (a as unknown as Record<string, unknown>)[sort];
	if (typeof v === 'number') return v;
	if (typeof v === 'boolean') return v ? 1 : 0;
	return String(v ?? '');
}

function compare(a: FanAction, b: FanAction, sort: string, dir: 'asc' | 'desc'): number {
	const va = sortValue(a, sort);
	const vb = sortValue(b, sort);
	let cmp = va < vb ? -1 : va > vb ? 1 : 0;
	if (cmp === 0) cmp = a.id < b.id ? -1 : a.id > b.id ? 1 : 0;
	return dir === 'desc' ? -cmp : cmp;
}

function rowForMatch(a: FanAction): Record<string, unknown> {
	return { ...a, tags: a.tags.join(' ') };
}

function applyFilters(rows: FanAction[], asOf: Date, q: Group): FanAction[] {
	return rows.filter((r) => {
		if (r.created_at > asOf) return false;
		return matchGroup(q, rowForMatch(r));
	});
}

export async function fetchFanActions(
	args: TableFetchArgs
): Promise<TablePageResponse<FanAction>> {
	const filtered = applyFilters(seed, args.asOf, args.q as Group);
	const sorted = [...filtered].sort((a, b) => compare(a, b, args.sort, args.dir));

	const total = sorted.length;
	const totalPages = Math.max(1, Math.ceil(total / args.limit));
	const page = Math.min(Math.max(1, args.page), totalPages);

	const start = (page - 1) * args.limit;
	const items = sorted.slice(start, start + args.limit);

	return { items, total, totalPages };
}
