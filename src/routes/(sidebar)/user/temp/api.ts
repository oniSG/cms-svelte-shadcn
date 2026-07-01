import { data as seed } from './data';
import type { User } from '../user';
import { matchGroup, type Group } from '$lib/components/custom/table-page/query-builder/fields';
import type { TableFetchArgs, TablePageResponse } from '$lib/components/custom/table-page';

function sortValue(u: User, sort: string): string | number {
	if (sort === 'last_activity') return u.last_activity.getTime();
	const v = (u as unknown as Record<string, unknown>)[sort];
	if (typeof v === 'number') return v;
	if (typeof v === 'boolean') return v ? 1 : 0;
	return String(v ?? '');
}

function compare(a: User, b: User, sort: string, dir: 'asc' | 'desc'): number {
	const va = sortValue(a, sort);
	const vb = sortValue(b, sort);
	let cmp = va < vb ? -1 : va > vb ? 1 : 0;
	if (cmp === 0) cmp = a.id < b.id ? -1 : a.id > b.id ? 1 : 0;
	return dir === 'desc' ? -cmp : cmp;
}

function rowForMatch(u: User): Record<string, unknown> {
	return { ...u, tags: u.tags.join(' ') };
}

function applyFilters(rows: User[], asOf: Date, q: Group): User[] {
	return rows.filter((r) => {
		if (r.last_activity > asOf) return false;
		return matchGroup(q, rowForMatch(r));
	});
}

export async function fetchUsers(args: TableFetchArgs): Promise<TablePageResponse<User>> {
	const filtered = applyFilters(seed, args.asOf, args.q as Group);
	const sorted = [...filtered].sort((a, b) => compare(a, b, args.sort, args.dir));

	const total = sorted.length;
	const totalPages = Math.max(1, Math.ceil(total / args.limit));
	const page = Math.min(Math.max(1, args.page), totalPages);

	const start = (page - 1) * args.limit;
	const items = sorted.slice(start, start + args.limit);

	return { items, total, totalPages };
}
