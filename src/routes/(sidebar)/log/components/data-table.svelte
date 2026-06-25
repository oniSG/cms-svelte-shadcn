<!--
  data-table.svelte — the logs table UI.

  FULLY CONTROLLED: stores no filter, sort, or pagination state. The
  page passes those in as props, and the table calls back through
  `onPatch` / `onGotoPage` / `onNext` / `onPrev` / `onRefresh` / `onReset`.

  The URL is the source of truth (via `+page.svelte`); keeping the table
  dumb makes the data flow one-way and easy to follow.

  Pagination model: SNAPSHOT + OFFSET. See api.ts / url-state.svelte.ts.
-->
<script lang="ts">
	import {
		type ColumnDef,
		getCoreRowModel,
		type RowSelectionState,
		type SortingState,
		type VisibilityState
	} from '@tanstack/table-core';
	import { createSvelteTable, FlexRender } from '$lib/components/ui/data-table/index.js';
	import * as Table from '$lib/components/ui/table/index.js';
	import { Button } from '$lib/components/ui/button';
	import { cn } from '$lib/utils.js';
	import XIcon from '@lucide/svelte/icons/x';
	import * as ButtonGroup from '$lib/components/ui/button-group/index.js';
	import ShapesIcon from '@lucide/svelte/icons/shapes';
	import UserIcon from '@lucide/svelte/icons/user';
	import { emails, types, getTypeLabel, getColumnLabel, type Log } from '../columns';
	import * as m from '$lib/paraglide/messages.js';
	import DataTableColFilter from './data-table-col-filter.svelte';
	import DataTableColVisibility from './data-table-col-visibility.svelte';
	import DataTableDateFilter from './data-table-date-filter.svelte';
	import DataTableRowDrawer from './data-table-row-drawer.svelte';
	import DataTablePagination from './data-table-pagination.svelte';
	import { Skeleton } from '$lib/components/ui/skeleton/index.js';
	import type { LogsPatch, LogsQuery, LogsSort } from '../temp/api';

	let {
		data, // current page of rows (already filtered/sorted by the backend)
		columns, // column definitions from columns.ts
		query, // current snapshot/filter/sort/page (read-only here)
		total, // total rows matching snapshot+filters (drives counters)
		totalPages, // ceil(total / limit) — at least 1
		loading, // true while fetching — drives dim + disabled state
		onPatch, // user changed a filter / sort / page size
		onGotoPage, // user clicked a specific page number
		onNext, // user clicked the right arrow
		onPrev, // user clicked the left arrow
		onRefresh, // user clicked "Refresh" (take a new snapshot)
		onReset // user clicked "Reset filters"
	}: {
		data: Log[];
		columns: ColumnDef<Log>[];
		query: LogsQuery;
		total: number;
		totalPages: number;
		loading: boolean;
		onPatch: (patch: LogsPatch) => void;
		onGotoPage: (page: number) => void;
		onNext: () => void;
		onPrev: () => void;
		onRefresh: () => void;
		onReset: () => void;
	} = $props();

	// Purely local UI state — these don't affect the backend query.
	let columnVisibility = $state<VisibilityState>({});
	let rowSelection = $state<RowSelectionState>({});

	// Translate our `query.sort` + `query.dir` into the shape TanStack
	// Table expects for its built-in sort header UI (the up/down arrow).
	const sorting = $derived<SortingState>([{ id: query.sort, desc: query.dir === 'desc' }]);

	const table = createSvelteTable({
		// Getters (not plain props) so the table re-reads them when they change.
		get data() {
			return data;
		},
		get columns() {
			return columns;
		},
		getCoreRowModel: getCoreRowModel(),
		// "Manual" = don't filter / sort / paginate on the client.
		// The backend already did it; the table just renders the page.
		manualPagination: true,
		manualSorting: true,
		manualFiltering: true,
		// User clicked a column's sort dropdown → notify the page.
		// The page updates the URL → query refetches → new rows arrive.
		onSortingChange: (updater) => {
			const next = typeof updater === 'function' ? updater(sorting) : updater;
			if (next.length === 0) {
				onPatch({ sort: 'time', dir: 'desc' });
				return;
			}
			const { id, desc } = next[0];
			onPatch({ sort: id as LogsSort, dir: desc ? 'desc' : 'asc' });
		},
		// Show/hide columns — purely visual, no backend involvement.
		onColumnVisibilityChange: (updater) => {
			columnVisibility = typeof updater === 'function' ? updater(columnVisibility) : updater;
		},
		onRowSelectionChange: (updater) => {
			rowSelection = typeof updater === 'function' ? updater(rowSelection) : updater;
		},
		state: {
			get sorting() {
				return sorting;
			},
			get columnVisibility() {
				return columnVisibility;
			},
			get rowSelection() {
				return rowSelection;
			}
		}
	});

	// Should the "Reset" button show? Only when at least one filter is active.
	const isFiltered = $derived(
		query.types.length > 0 || query.emails.length > 0 || query.from != null || query.to != null
	);

	// Initial load: still fetching AND no rows yet → show skeleton rows
	// instead of a one-line "Loading…" so layout doesn't jump in.
	const showSkeletons = $derived(loading && data.length === 0);

	// Localized option list for the Type filter. Rebuilt on every locale
	// change because m.*() (inside getTypeLabel) reads localeState.current.
	const typeOptions = $derived(types.map((value) => ({ value, label: getTypeLabel(value) })));
</script>

<div>
	<!-- Toolbar: filters live here. Each filter takes a value + onChange
	     and converts user actions into onPatch calls. -->
	<div class="flex items-center py-2">
		<ButtonGroup.Root>
			<DataTableColFilter
				icon={ShapesIcon}
				title={m.log_filter_type()}
				options={typeOptions}
				value={query.types}
				onChange={(v) => onPatch({ types: v })}
			/>
			<DataTableColFilter
				icon={UserIcon}
				title={m.log_filter_user()}
				options={emails}
				value={query.emails}
				onChange={(v) => onPatch({ emails: v })}
			/>
			<DataTableDateFilter
				from={query.from}
				to={query.to}
				onChange={(from, to) => onPatch({ from, to })}
			/>
			{#if isFiltered}
				<Button variant="outline" size="sm" onclick={onReset}>
					<XIcon />
					{m.log_action_reset()}
				</Button>
			{/if}
		</ButtonGroup.Root>
		<DataTableColVisibility {table} labelFor={getColumnLabel} />
	</div>

	<!-- The table itself. While refetching with rows already on screen,
	     dim slightly so the user gets a visual hint without rows disappearing
	     (`keepPreviousData` keeps them visible during the refetch). On the
	     very first load there's nothing to dim — we render skeleton rows
	     in the body instead. -->
	<div
		class={cn(
			'overflow-hidden rounded-xl border transition-opacity',
			loading && data.length > 0 && 'opacity-60'
		)}
	>
		<Table.Root>
			<Table.Header>
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
					<!-- Each row is clickable and opens a details dialog. -->
					<DataTableRowDrawer log={row.original as Log}>
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
					</DataTableRowDrawer>
				{:else}
					{#if showSkeletons}
						<!-- Initial load: one skeleton row per requested page item,
						     one skeleton cell per visible column. -->
						{#each Array.from({ length: query.limit }, (_, i) => i) as i (i)}
							<Table.Row>
								{#each table.getVisibleLeafColumns() as col (col.id)}
									<Table.Cell>
										<Skeleton class="h-4 w-full max-w-40 rounded" />
									</Table.Cell>
								{/each}
							</Table.Row>
						{/each}
					{:else}
						<Table.Row>
							<Table.Cell colspan={columns.length} class="h-24 text-center">
								{m.log_table_no_results()}
							</Table.Cell>
						</Table.Row>
					{/if}
				{/each}
			</Table.Body>
		</Table.Root>
	</div>

	<!-- Snapshot+offset pagination: page-number bar with prev/next,
	     page-size dropdown, and a Refresh button to advance the snapshot. -->
	<DataTablePagination
		limit={query.limit}
		page={query.page}
		asOf={query.asOf}
		{total}
		{totalPages}
		{loading}
		onLimitChange={(limit) => onPatch({ limit })}
		{onGotoPage}
		{onNext}
		{onPrev}
		{onRefresh}
	/>
</div>
