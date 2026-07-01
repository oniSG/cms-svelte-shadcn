import type { ColumnDef } from '@tanstack/table-core';
import { renderComponent } from '$lib/components/ui/data-table/index.js';
import DataTableColumnHeader from './components/data-table-column-header.svelte';
import { data } from './data';
import { SvelteSet } from 'svelte/reactivity';
import DataTableBadge from './components/data-table-badge.svelte';
import Check from '@lucide/svelte/icons/check';
import X from '@lucide/svelte/icons/x';
import * as m from '$lib/paraglide/messages.js';
import { allTags, type FanAction } from './fan-action';

export type { FanAction };
export const tags: string[] = [...allTags];

export const users = new SvelteSet(data.map((action) => action.created_by));

// Per-column resize bounds. `size` is the initial width; min/max cap how
// far the user can drag. The last visible column ignores `size` and fills
// remaining space (see `resizable-table-header.svelte`).
const DEFAULT_MIN_SIZE = 80;
const DEFAULT_MAX_SIZE = 600;

export const columns: ColumnDef<FanAction>[] = [
	{
		accessorKey: 'event',
		size: 260,
		minSize: DEFAULT_MIN_SIZE,
		maxSize: DEFAULT_MAX_SIZE,
		header: ({ column }) => {
			return renderComponent(DataTableColumnHeader, {
				column,
				title: m.col_event()
			});
		}
	},
	{
		accessorKey: 'tags',
		size: 200,
		minSize: 100,
		maxSize: DEFAULT_MAX_SIZE,
		header: ({ column }) => {
			return renderComponent(DataTableColumnHeader, {
				column,
				title: m.event_tags_label()
			});
		},
		cell: ({ getValue }) => {
			return renderComponent(DataTableBadge, { value: getValue<string[]>() });
		},
		filterFn: (row, id, value: string[]) => {
			if (!value?.length) return true;

			const rowValue = row.getValue(id);
			const rowTags = Array.isArray(rowValue)
				? rowValue
				: typeof rowValue === 'string'
					? rowValue.split(',').map((t) => t.trim())
					: [];

			return value.some((tag) => rowTags.includes(tag));
		}
	},
	{
		accessorKey: 'description',
		size: 220,
		minSize: DEFAULT_MIN_SIZE,
		maxSize: DEFAULT_MAX_SIZE,
		header: ({ column }) => {
			return renderComponent(DataTableColumnHeader, {
				column,
				title: m.col_description()
			});
		},
		filterFn: (row, id, value: string[]) => {
			if (!value?.length) return true; // Pokud není nic vybráno, zobraz vše
			return value.includes(row.getValue(id) as string);
		}
	},
	{
		accessorKey: 'created_at',
		size: 200,
		minSize: DEFAULT_MIN_SIZE,
		maxSize: DEFAULT_MAX_SIZE,
		header: ({ column }) => {
			return renderComponent(DataTableColumnHeader, {
				column,
				title: m.col_created_at()
			});
		},
		filterFn: (row, id, value: [Date, Date | undefined]) => {
			const time = row.getValue(id) as Date;
			const [from, to] = value;
			if (time < from) return false;
			if (to && time > to) return false;
			return true;
		}
	},
	{
		accessorKey: 'created_by',
		size: 200,
		minSize: DEFAULT_MIN_SIZE,
		maxSize: DEFAULT_MAX_SIZE,
		header: ({ column }) => {
			return renderComponent(DataTableColumnHeader, {
				column,
				title: m.col_created_by()
			});
		},
		filterFn: (row, id, value: string[]) => {
			if (!value?.length) return true;
			return value.includes(row.getValue(id) as string);
		}
	},
	{
		accessorKey: 'active',
		size: 120,
		minSize: DEFAULT_MIN_SIZE,
		maxSize: DEFAULT_MAX_SIZE,
		header: ({ column }) => {
			return renderComponent(DataTableColumnHeader, {
				column,
				title: m.col_active()
			});
		},
		cell: ({ getValue }) => {
			const isActive = getValue() as boolean;

			return renderComponent(isActive ? Check : X, {
				class: isActive ? 'size-4 text-primary' : 'size-4 text-destructive'
			});
		}
	}
];
