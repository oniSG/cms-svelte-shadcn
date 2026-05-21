<script lang="ts" generics="TData, TValue">
	import {
		type ColumnDef,
		type ColumnFiltersState,
		getCoreRowModel,
		getFilteredRowModel,
		getPaginationRowModel,
		getSortedRowModel,
		type PaginationState,
		type RowSelectionState,
		type SortingState,
		type VisibilityState
	} from '@tanstack/table-core';
	import { createSvelteTable, FlexRender } from '$lib/components/ui/data-table/index.js';
	import * as Table from '$lib/components/ui/table/index.js';
	import { Button } from '$lib/components/ui/button';
	import XIcon from '@lucide/svelte/icons/x';
	import * as ButtonGroup from '$lib/components/ui/button-group/index.js';
	import ShapesIcon from '@lucide/svelte/icons/shapes';
	import UserIcon from '@lucide/svelte/icons/user';
	import { emails, types, type Log } from '../columns';
	import DataTableColFilter from './data-table-col-filter.svelte';
	import DataTableColVisibility from './data-table-col-visibility.svelte';
	import DataTableDateFilter from './data-table-date-filter.svelte';
	import DataTableDialog from './data-table-dialog.svelte';
	import DataTablePagination from './data-table-pagination.svelte';

	type DataTableProps<TData, TValue> = {
		columns: ColumnDef<TData, TValue>[];
		data: TData[];
	};

	let { data, columns }: DataTableProps<TData, TValue> = $props();

	let pagination = $state<PaginationState>({ pageIndex: 0, pageSize: 10 });
	let sorting = $state<SortingState>([]);
	let columnFilters = $state<ColumnFiltersState>([]);
	let columnVisibility = $state<VisibilityState>({});
	let rowSelection = $state<RowSelectionState>({});

	const table = createSvelteTable({
		get data() {
			return data;
		},
		columns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		onPaginationChange: (updater) => {
			if (typeof updater === 'function') {
				pagination = updater(pagination);
			} else {
				pagination = updater;
			}
		},
		onSortingChange: (updater) => {
			if (typeof updater === 'function') {
				sorting = updater(sorting);
			} else {
				sorting = updater;
			}
		},
		onColumnFiltersChange: (updater) => {
			if (typeof updater === 'function') {
				columnFilters = updater(columnFilters);
			} else {
				columnFilters = updater;
			}
		},
		onColumnVisibilityChange: (updater) => {
			if (typeof updater === 'function') {
				columnVisibility = updater(columnVisibility);
			} else {
				columnVisibility = updater;
			}
		},
		onRowSelectionChange: (updater) => {
			if (typeof updater === 'function') {
				rowSelection = updater(rowSelection);
			} else {
				rowSelection = updater;
			}
		},
		state: {
			get pagination() {
				return pagination;
			},
			get sorting() {
				return sorting;
			},
			get columnFilters() {
				return columnFilters;
			},
			get columnVisibility() {
				return columnVisibility;
			},
			get rowSelection() {
				return rowSelection;
			}
		}
	});

	const isFiltered = $derived(table.getState().columnFilters.length > 0);
	const typeCol = $derived(table.getColumn('type'));
	const emailCol = $derived(table.getColumn('email'));
	const timeCol = $derived(table.getColumn('time'));
</script>

<div>
	<div class="flex items-center py-2">
		{#if typeCol && emailCol && timeCol}
			<ButtonGroup.Root>
				<!-- <Button variant="outline" size="sm">
					<FunnelIcon />
				</Button> -->
				<DataTableColFilter icon={ShapesIcon} column={typeCol} title="Type" options={types} />
				<DataTableColFilter icon={UserIcon} column={emailCol} title="User" options={emails} />
				<DataTableDateFilter column={timeCol} />
				{#if isFiltered}
					<Button variant="outline" size="sm" onclick={() => table.resetColumnFilters()}>
						<XIcon />
						Reset
					</Button>
				{/if}
			</ButtonGroup.Root>
		{/if}
		<DataTableColVisibility {table} />
	</div>
	<div class="overflow-hidden rounded-md border">
		<Table.Root>
			<Table.Header class="bg-accent">
				{#each table.getHeaderGroups() as headerGroup (headerGroup.id)}
					<Table.Row>
						{#each headerGroup.headers as header (header.id)}
							<Table.Head colspan={header.colSpan}>
								{#if !header.isPlaceholder}
									<FlexRender
										content={header.column.columnDef.header}
										context={header.getContext()}
									/>
								{/if}
							</Table.Head>
						{/each}
					</Table.Row>
				{/each}
			</Table.Header>
			<Table.Body>
				{#each table.getRowModel().rows as row (row.id)}
					<DataTableDialog log={row.original as Log}>
						{#snippet children(props)}
							<Table.Row
								{...props}
								data-state={row.getIsSelected() && 'selected'}
								class="hover:cursor-pointer"
							>
								{#each row.getVisibleCells() as cell (cell.id)}
									<Table.Cell>
										<FlexRender content={cell.column.columnDef.cell} context={cell.getContext()} />
									</Table.Cell>
								{/each}
							</Table.Row>
						{/snippet}
					</DataTableDialog>
				{:else}
					<Table.Row>
						<Table.Cell colspan={columns.length} class="h-24 text-center">No results.</Table.Cell>
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
	</div>
	<DataTablePagination {table} />
</div>
