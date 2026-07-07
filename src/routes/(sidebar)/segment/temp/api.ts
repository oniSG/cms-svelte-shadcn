import { data as seed } from './data';
import type { Segment } from '../segment';
import { matchGroup, type Group } from '$lib/components/custom/table-page/query-builder/fields';
import type { TableFetchArgs, TablePageResponse } from '$lib/components/custom/table-page';

function sortValue(s: Segment, sort: string): string | number {
	if (sort === 'updated_at') return s.updated_at.getTime();
	if (sort === 'id') return Number(s.id);
	const v = (s as unknown as Record<string, unknown>)[sort];
	if (typeof v === 'number') return v;
	if (typeof v === 'boolean') return v ? 1 : 0;
	return String(v ?? '').toLowerCase();
}

function compare(a: Segment, b: Segment, sort: string, dir: 'asc' | 'desc'): number {
	const va = sortValue(a, sort);
	const vb = sortValue(b, sort);
	let cmp = va < vb ? -1 : va > vb ? 1 : 0;
	if (cmp === 0) cmp = a.id < b.id ? -1 : a.id > b.id ? 1 : 0;
	return dir === 'desc' ? -cmp : cmp;
}

function rowForMatch(s: Segment): Record<string, unknown> {
	return { ...s, tags: s.tags.join(' ') };
}

function applyFilters(rows: Segment[], q: Group): Segment[] {
	return rows.filter((r) => matchGroup(q, rowForMatch(r)));
}

export async function fetchSegments(args: TableFetchArgs): Promise<TablePageResponse<Segment>> {
	const filtered = applyFilters(seed, args.q as Group);
	const sorted = [...filtered].sort((a, b) => compare(a, b, args.sort, args.dir));

	const total = sorted.length;
	const totalPages = Math.max(1, Math.ceil(total / args.limit));
	const page = Math.min(Math.max(1, args.page), totalPages);

	const start = (page - 1) * args.limit;
	const items = sorted.slice(start, start + args.limit);

	return { items, total, totalPages };
}
