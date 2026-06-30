<script generics="TData, TValue" lang="ts">
	import {
		type ColumnDef,
		type ColumnFiltersState,
		type ColumnSizingState,
		getCoreRowModel,
		getFilteredRowModel,
		getPaginationRowModel,
		getSortedRowModel,
		type PaginationState,
		type RowSelectionState,
		type SortingState,
		type VisibilityState
	} from '@tanstack/table-core';
	import ResizableTableHeader from '$lib/components/custom/data-table/resizable-table-header.svelte';
	import {
		LAST_COLUMN_BUFFER,
		nonLastColumnTotal
	} from '$lib/components/custom/data-table/resizable-table';
	import { createSvelteTable, FlexRender } from '$lib/components/ui/data-table/index.js';
	import * as Table from '$lib/components/ui/table/index.js';
	import { Button } from '$lib/components/ui/button';
	import * as ButtonGroup from '$lib/components/ui/button-group/index.js';
	import { type FanAction, tags, users } from '../columns';
	import DataTableColVisibility from './data-table-col-visibility.svelte';
	import DataTableDateFilter from './data-table-date-filter.svelte';
	import DataTablePagination from './data-table-pagination.svelte';
	import DataTableColFilter from './data-table-col-filter.svelte';
	import TagIcon from '@lucide/svelte/icons/tag';
	import UserIcon from '@lucide/svelte/icons/user';
	import * as ContextMenu from '$lib/components/ui/context-menu/index.js';
	import DataTableDeleteDialog from './data-table-delete-dialog.svelte';
	import DataTableCopyDialog from './data-table-copy-dialog.svelte';
	import DataTableDetailDialog from './data-table-detail-dialog.svelte';
	import DataTableEditDialog from './data-table-edit-dialog.svelte';
	import DataTableCreateDialog from './data-table-create-dialog.svelte';
	import { X } from '@lucide/svelte';
	import * as m from '$lib/paraglide/messages.js';
	import { goto } from '$app/navigation';
	import { fanActionEditTabHref } from '../edit-tabs.js';

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
	let columnSizing = $state<ColumnSizingState>({});

	const table = createSvelteTable({
		get data() {
			return data;
		},
		columns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		enableColumnResizing: true,
		columnResizeMode: 'onChange',
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
		onColumnSizingChange: (updater) => {
			columnSizing = typeof updater === 'function' ? updater(columnSizing) : updater;
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
			},
			get columnSizing() {
				return columnSizing;
			}
		}
	});

	const isFiltered = $derived(table.getState().columnFilters.length > 0);
	const createdByCol = $derived(table.getColumn('created_by'));
	const tagsCol = $derived(table.getColumn('tags'));
	const createdAtCol = $derived(table.getColumn('created_at'));
	const userOptions = $derived(Array.from(users));

	let deleteRow = $state<FanAction | null>(null);
	let copyRow = $state<FanAction | null>(null);
	let detailRow = $state<FanAction | null>(null);
	let editRow = $state<FanAction | null>(null);
	let createDialog = $state(false);

	function navigateToEdit(action: FanAction) {
		goto(fanActionEditTabHref(action.id, 'settings'));
	}
</script>

<div>
	<div class="flex items-center py-2">
		{#if createdByCol && tagsCol && createdAtCol}
			<ButtonGroup.Root>
				<DataTableColFilter
					icon={UserIcon}
					column={createdByCol}
					title={m.col_created_by()}
					options={userOptions}
				/>
				<DataTableColFilter icon={TagIcon} column={tagsCol} title={m.col_label()} options={tags} />
				<DataTableDateFilter column={createdAtCol} />

				{#if isFiltered}
					<Button variant="outline" size="sm" onclick={() => table.resetColumnFilters()}>
						<X />
						Reset
					</Button>
				{/if}
			</ButtonGroup.Root>
		{/if}

		<DataTableColVisibility {table} />

		<Button class="ml-2" onclick={() => (createDialog = true)} size="sm">
			+ {m.add_record()}
		</Button>
	</div>
	<div class="overflow-hidden rounded-md border">
		<Table.Root
			class="w-full table-fixed"
			style="min-width: {nonLastColumnTotal(table) + LAST_COLUMN_BUFFER}px"
		>
			<ResizableTableHeader {table} class="bg-accent" />
			<Table.Body>
				{#each table.getRowModel().rows as row (row.id)}
					<ContextMenu.Root>
						<ContextMenu.Trigger>
							{#snippet child({ props: ctxProps })}
								<Table.Row
									{...ctxProps}
									data-state={row.getIsSelected() && 'selected'}
									class="hover:cursor-pointer"
									onclick={() => navigateToEdit(row.original as FanAction)}
								>
									{#each row.getVisibleCells() as cell (cell.id)}
										<Table.Cell class="overflow-hidden">
											<FlexRender
												content={cell.column.columnDef.cell}
												context={cell.getContext()}
											/>
										</Table.Cell>
									{/each}
								</Table.Row>
							{/snippet}
						</ContextMenu.Trigger>
						<ContextMenu.Content>
							<ContextMenu.Item onclick={() => (editRow = row.original as FanAction)}>
								{m.reply_email_edit()}
							</ContextMenu.Item>
							<ContextMenu.Item onclick={() => (copyRow = row.original as FanAction)}>
								{m.event_dialog_copy_submit()}
							</ContextMenu.Item>
							<ContextMenu.Item onclick={() => (detailRow = row.original as FanAction)}>
								{m.event_detail()}
							</ContextMenu.Item>
							<ContextMenu.Separator />
							<ContextMenu.Item
								class="text-destructive"
								onclick={() => (deleteRow = row.original as FanAction)}
							>
								{m.event_dialog_delete_submit()}
							</ContextMenu.Item>
						</ContextMenu.Content>
					</ContextMenu.Root>
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

{#if deleteRow !== null}
	<DataTableDeleteDialog bind:eventToDelete={deleteRow} />
{/if}

{#if copyRow !== null}
	<DataTableCopyDialog bind:eventToCopy={copyRow} />
{/if}

{#if detailRow !== null}
	<DataTableDetailDialog bind:eventToShow={detailRow} />
{/if}

{#if editRow !== null}
	<DataTableEditDialog bind:eventToEdit={editRow} />
{/if}

{#if createDialog}
	<DataTableCreateDialog bind:open={createDialog} />
{/if}
