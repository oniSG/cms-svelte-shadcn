import type { Table } from '@tanstack/table-core';

// Pixel buffer reserved for the auto-sized last column when deriving table
// `min-width`. Keeps the last column from collapsing to zero when the user
// drags the others wider than the viewport.
export const LAST_COLUMN_BUFFER = 100;

// Sum of sizes for every visible header except the last one — used as the
// table's `min-width` so the parent's `overflow-x-auto` kicks in when the
// user drags the fixed columns wider than the container.
export function nonLastColumnTotal<TData>(table: Table<TData>): number {
	const headers = table.getHeaderGroups()[0]?.headers ?? [];
	return headers.slice(0, -1).reduce((sum, h) => sum + h.getSize(), 0);
}
