import { data as seed } from './data';
import type { Tag } from '../tag';
import { matchGroup, type Group } from '$lib/components/custom/table-page/query-builder/fields';
import type { TableFetchArgs, TablePageResponse } from '$lib/components/custom/table-page';

function sortValue(t: Tag, sort: string): string | number {
	if (sort === 'created_at') return t.created_at.getTime();
	if (sort === 'id') return Number(t.id);
	const v = (t as unknown as Record<string, unknown>)[sort];
	if (typeof v === 'number') return v;
	if (typeof v === 'boolean') return v ? 1 : 0;
	return String(v ?? '').toLowerCase();
}

function compare(a: Tag, b: Tag, sort: string, dir: 'asc' | 'desc'): number {
	const va = sortValue(a, sort);
	const vb = sortValue(b, sort);
	let cmp = va < vb ? -1 : va > vb ? 1 : 0;
	if (cmp === 0) cmp = a.id < b.id ? -1 : a.id > b.id ? 1 : 0;
	return dir === 'desc' ? -cmp : cmp;
}

function applyFilters(rows: Tag[], q: Group): Tag[] {
	return rows.filter((r) => matchGroup(q, r as unknown as Record<string, unknown>));
}

export async function fetchTags(args: TableFetchArgs): Promise<TablePageResponse<Tag>> {
	const filtered = applyFilters(seed, args.q as Group);
	const sorted = [...filtered].sort((a, b) => compare(a, b, args.sort, args.dir));

	const total = sorted.length;
	const totalPages = Math.max(1, Math.ceil(total / args.limit));
	const page = Math.min(Math.max(1, args.page), totalPages);

	const start = (page - 1) * args.limit;
	const items = sorted.slice(start, start + args.limit);

	return { items, total, totalPages };
}
