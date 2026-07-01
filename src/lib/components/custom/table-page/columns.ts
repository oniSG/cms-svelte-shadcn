import type { ColumnDef } from '@tanstack/table-core';
import { renderComponent } from '$lib/components/ui/data-table/index.js';
import type { QueryFieldDef, Shortcut, TableColumn } from './types';
import CellText from './cells/cell-text.svelte';
import CellNumber from './cells/cell-number.svelte';
import CellDate from './cells/cell-date.svelte';
import CellBool from './cells/cell-bool.svelte';
import CellSelect from './cells/cell-select.svelte';
import ColumnHeader from './column-header.svelte';

const DEFAULT_MIN_SIZE = 150;
const DEFAULT_MAX_SIZE = 400;

export function toTanstackColumns<Row>(columns: TableColumn<Row>[]): ColumnDef<Row>[] {
	return columns.map((col) => {
		const accessor = col.accessor ?? ((row: Row) => (row as Record<string, unknown>)[col.id]);
		const type = col.type ?? 'text';
		const align = col.align ?? (type === 'number' ? 'right' : 'left');

		const def = {
			id: col.id,
			accessorFn: (row: Row) => accessor(row),
			size: col.width,
			minSize: col.minWidth ?? DEFAULT_MIN_SIZE,
			maxSize: col.maxWidth ?? DEFAULT_MAX_SIZE,
			enableSorting: col.sortable !== false,
			enableHiding: col.hideable !== false,
			enableResizing: col.resizable !== false,
			header: ({ column }) => renderComponent(ColumnHeader, { column, title: col.label, align }),
			cell: ({ row, getValue }) => {
				const value = getValue();
				const rowData = row.original as Row;
				if (col.cell) {
					return renderComponent(col.cell, { value, row: rowData });
				}
				switch (type) {
					case 'number':
						return renderComponent(CellNumber, { value });
					case 'date':
						return renderComponent(CellDate, { value });
					case 'bool':
						return renderComponent(CellBool, { value });
					case 'select':
						return renderComponent(CellSelect, {
							value,
							options: 'options' in col ? col.options : []
						});
					default:
						return renderComponent(CellText, { value, align });
				}
			}
		} satisfies ColumnDef<Row>;
		return def;
	});
}

export function deriveQueryFields<Row>(
	columns: TableColumn<Row>[],
	shortcuts: Shortcut[] = []
): QueryFieldDef[] {
	const shortcutByField = new Map<
		string,
		{ options: Array<{ value: string; label: string }>; searchable?: boolean }
	>();
	for (const s of shortcuts) {
		if (s.kind === 'multi-select') {
			shortcutByField.set(s.field, { options: s.options, searchable: s.searchable });
		}
	}

	return columns.map((col) => {
		const type = col.type ?? 'text';
		const base = { value: col.id, label: col.label };
		const fromShortcut = shortcutByField.get(col.id);

		if (type === 'select') {
			const searchable = 'searchable' in col ? col.searchable : fromShortcut?.searchable;
			return {
				...base,
				type: 'select',
				options: 'options' in col ? col.options : (fromShortcut?.options ?? []),
				...(searchable === undefined ? {} : { searchable })
			};
		}
		if (fromShortcut) {
			return {
				...base,
				type: 'select',
				options: fromShortcut.options,
				...(fromShortcut.searchable === undefined ? {} : { searchable: fromShortcut.searchable })
			};
		}
		return { ...base, type };
	});
}

export function getColumnLabel<Row>(columns: TableColumn<Row>[], id: string): string {
	return columns.find((c) => c.id === id)?.label ?? id;
}
