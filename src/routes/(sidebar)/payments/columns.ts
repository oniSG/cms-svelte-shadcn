import type { ColumnDef } from '@tanstack/table-core';
import { createRawSnippet } from 'svelte';
import { renderComponent, renderSnippet } from '$lib/components/ui/data-table/index.js';
import DataTableEmailButton from './data-table-email-button.svelte';
import { Checkbox } from '$lib/components/ui/checkbox/index.js';

export type Payment = {
	id: string;
	amount: number;
	status: 'pending' | 'processing' | 'success' | 'failed';
	email: string;
};

// Per-column resize bounds. `size` is the initial width; min/max cap how
// far the user can drag. The last visible column ignores `size` and fills
// remaining space (see `resizable-table-header.svelte`).
const DEFAULT_MIN_SIZE = 80;
const DEFAULT_MAX_SIZE = 600;

export const columns: ColumnDef<Payment>[] = [
	{
		id: 'select',
		size: 50,
		minSize: 40,
		maxSize: 60,
		enableResizing: false,
		header: ({ table }) =>
			renderComponent(Checkbox, {
				checked: table.getIsAllPageRowsSelected(),
				indeterminate: table.getIsSomePageRowsSelected() && !table.getIsAllPageRowsSelected(),
				onCheckedChange: (value) => table.toggleAllPageRowsSelected(!!value),
				'aria-label': 'Select all'
			}),
		cell: ({ row }) =>
			renderComponent(Checkbox, {
				checked: row.getIsSelected(),
				onCheckedChange: (value) => row.toggleSelected(!!value),
				'aria-label': 'Select row'
			}),
		enableSorting: false,
		enableHiding: false
	},
	{
		accessorKey: 'status',
		size: 160,
		minSize: DEFAULT_MIN_SIZE,
		maxSize: DEFAULT_MAX_SIZE,
		header: 'Status'
	},
	{
		accessorKey: 'email',
		size: 280,
		minSize: DEFAULT_MIN_SIZE,
		maxSize: DEFAULT_MAX_SIZE,
		header: ({ column }) =>
			renderComponent(DataTableEmailButton, {
				onclick: column.getToggleSortingHandler(),
				sort: column.getIsSorted()
			})
	},
	{
		accessorKey: 'amount',
		size: 160,
		minSize: DEFAULT_MIN_SIZE,
		maxSize: DEFAULT_MAX_SIZE,
		header: () => {
			const amountHeaderSnippet = createRawSnippet(() => ({
				render: () => `<div class="text-end">Amount</div>`
			}));
			return renderSnippet(amountHeaderSnippet);
		},
		cell: ({ row }) => {
			const formatter = new Intl.NumberFormat('en-US', {
				style: 'currency',
				currency: 'USD'
			});

			const amountCellSnippet = createRawSnippet<[{ amount: number }]>((getAmount) => {
				const { amount } = getAmount();
				const formatted = formatter.format(amount);
				return {
					render: () => `<div class="text-end font-medium">${formatted}</div>`
				};
			});

			return renderSnippet(amountCellSnippet, {
				amount: row.original.amount
			});
		}
	}
];
