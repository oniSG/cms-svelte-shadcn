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
		type ColumnSizingState,
		getCoreRowModel,
		type RowSelectionState,
		type SortingState,
		type VisibilityState
	} from '@tanstack/table-core';
	import ColumnResizer from '$lib/components/custom/data-table/column-resizer.svelte';
	import {
		LAST_COLUMN_BUFFER,
		nonLastColumnTotal
	} from '$lib/components/custom/data-table/resizable-table';
	import { createSvelteTable, FlexRender } from '$lib/components/ui/data-table/index.js';
	import * as Table from '$lib/components/ui/table/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { Button } from '$lib/components/ui/button';
	import { RangeCalendar } from '$lib/components/ui/range-calendar/index.js';
	import { cn } from '$lib/utils.js';
	import XIcon from '@lucide/svelte/icons/x';
	import FilterIcon from '@lucide/svelte/icons/filter';
	import CalendarIcon from '@lucide/svelte/icons/calendar';
	import { fromDate, getLocalTimeZone, toCalendarDate } from '@internationalized/date';
	import type { DateRange } from 'bits-ui';
	import { emails, types, getTypeLabel, getColumnLabel, type Log } from '../columns';
	import * as m from '$lib/paraglide/messages.js';
	import DataTableColumnHeader from './data-table-column-header.svelte';
	import DataTableColVisibility from './data-table-col-visibility.svelte';
	import DataTableRowDrawer from './data-table-row-drawer.svelte';
	import DataTablePagination from './data-table-pagination.svelte';
	import FilterSubMenu from './filter-sub-menu.svelte';
	import { Skeleton } from '$lib/components/ui/skeleton/index.js';
	import type { ActionType } from '../columns';
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
	let columnSizing = $state<ColumnSizingState>({});

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
		// Drag the right edge of any header cell to resize that column.
		// `onChange` updates width live during the drag (vs. `onEnd`).
		// Per-column min/max sizes come from `columns.ts` via `defaultColumn`.
		enableColumnResizing: true,
		columnResizeMode: 'onChange',
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
		onColumnSizingChange: (updater) => {
			columnSizing = typeof updater === 'function' ? updater(columnSizing) : updater;
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
			},
			get columnSizing() {
				return columnSizing;
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

	// Date filter helpers — the column-header sub-menu hosts a RangeCalendar,
	// which speaks `@internationalized/date` while the rest of the app uses
	// plain Date. Convert at the boundary in both directions.
	const tz = getLocalTimeZone();
	const dateRange: DateRange | undefined = $derived(
		query.from
			? {
					start: toCalendarDate(fromDate(query.from, tz)),
					end: query.to ? toCalendarDate(fromDate(query.to, tz)) : undefined
				}
			: undefined
	);

	function applyDate(v: DateRange | undefined) {
		if (!v?.start) {
			onPatch({ from: null, to: null });
			return;
		}
		const start = v.start.toDate(tz);
		// Push the end to the very end of the day so filtering is inclusive.
		const end = v.end ? new Date(v.end.toDate(tz).setHours(23, 59, 59, 999)) : null;
		onPatch({ from: start, to: end });
	}

	function toggleType(t: ActionType, on: boolean) {
		onPatch({ types: on ? [...query.types, t] : query.types.filter((v) => v !== t) });
	}

	function toggleEmail(e: string, on: boolean) {
		onPatch({ emails: on ? [...query.emails, e] : query.emails.filter((v) => v !== e) });
	}
</script>

<!--
  Per-column filter sub-menus. Each renders as a <DropdownMenu.Sub> so it
  appears as a nested sub-menu inside the column-title dropdown. We keep
  them at the top level here so the same snippet instance is reused across
  every header that needs it (the loop picks one by column id).
-->
{#snippet typeFilter()}
	<DropdownMenu.Sub>
		<DropdownMenu.SubTrigger>
			<FilterIcon class="me-2 size-3.5 text-muted-foreground/70" />
			{m.log_action_filter()}
		</DropdownMenu.SubTrigger>
		<!--
		  bits-ui's FloatingLayerContent defaults align="center" — without an
		  explicit `align="start"` the sub-menu is vertically centered on the
		  trigger, which puts its top ~half-its-height above "Filtrovat".
		  alignOffset={-6}: negate SubContent's `p-1.5` so the search input
		  row lands at the same Y as the SubTrigger row.
		  avoidCollisions={false}: stop bits-ui from auto-shifting the
		  sub-menu when the list is long — the inner list scrolls instead.
		-->
		<DropdownMenu.SubContent class="w-56" align="start" alignOffset={-6} avoidCollisions={false}>
			<FilterSubMenu
				options={typeOptions}
				selected={query.types}
				onToggle={toggleType}
				onClear={() => onPatch({ types: [] })}
				placeholder={m.log_filter_type()}
			/>
		</DropdownMenu.SubContent>
	</DropdownMenu.Sub>
{/snippet}

{#snippet emailFilter()}
	<DropdownMenu.Sub>
		<DropdownMenu.SubTrigger>
			<FilterIcon class="me-2 size-3.5 text-muted-foreground/70" />
			{m.log_action_filter()}
		</DropdownMenu.SubTrigger>
		<DropdownMenu.SubContent class="w-64" align="start" alignOffset={-6} avoidCollisions={false}>
			<FilterSubMenu
				options={emails}
				selected={query.emails}
				onToggle={toggleEmail}
				onClear={() => onPatch({ emails: [] })}
				placeholder={m.log_filter_user()}
			/>
		</DropdownMenu.SubContent>
	</DropdownMenu.Sub>
{/snippet}

{#snippet dateFilter()}
	<DropdownMenu.Sub>
		<DropdownMenu.SubTrigger>
			<CalendarIcon class="me-2 size-3.5 text-muted-foreground/70" />
			{m.log_action_filter()}
		</DropdownMenu.SubTrigger>
		<!-- align="start" mirrors the type/email sub-menus so the calendar's
		     top edge lines up with the SubTrigger row. No alignOffset compensation
		     here because the SubContent uses p-0. -->
		<DropdownMenu.SubContent class="p-0" align="start" avoidCollisions={false}>
			<RangeCalendar value={dateRange} onValueChange={applyDate} />
			{#if query.from}
				<div class="border-t p-2">
					<Button
						variant="ghost"
						size="sm"
						class="w-full"
						onclick={() => onPatch({ from: null, to: null })}
					>
						{m.log_filter_clear_dates()}
					</Button>
				</div>
			{/if}
		</DropdownMenu.SubContent>
	</DropdownMenu.Sub>
{/snippet}

<div>
	<!-- Toolbar: filters now live INSIDE each filterable column header
	     (see the inline header render below). This bar only holds the
	     Reset shortcut (when something is filtered) + column visibility. -->
	<div class="flex items-center justify-end gap-2 py-2">
		{#if isFiltered}
			<Button variant="outline" size="sm" onclick={onReset}>
				<XIcon />
				{m.log_action_reset()}
			</Button>
		{/if}
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
		<!-- `table-fixed` + `w-full` lets the LAST column absorb leftover
		     space (it has no explicit width and no resize handle). The
		     `min-width` keeps the table from compressing the fixed columns
		     when the user drags them wider than the viewport — the parent's
		     `overflow-x-auto` then scrolls. -->
		<Table.Root
			class="w-full table-fixed"
			style="min-width: {nonLastColumnTotal(table) + LAST_COLUMN_BUFFER}px"
		>
			<!-- Inline header render (instead of <ResizableTableHeader />) so we
			     can render <DataTableColumnHeader /> ourselves and hand it a
			     per-column `filter` snippet. The snippets below render as a
			     <DropdownMenu.Sub> inside the column-title dropdown — i.e. the
			     filter UI lives as a sub-menu of the sort/hide menu. -->
			<Table.Header>
				{#each table.getHeaderGroups() as headerGroup (headerGroup.id)}
					<Table.Row>
						{#each headerGroup.headers as header, i (header.id)}
							{@const isLast = i === headerGroup.headers.length - 1}
							{@const filterSnippet =
								header.column.id === 'type'
									? typeFilter
									: header.column.id === 'email'
										? emailFilter
										: header.column.id === 'time'
											? dateFilter
											: undefined}
							<Table.Head
								colspan={header.colSpan}
								class="relative"
								style={isLast ? '' : `width: ${header.getSize()}px`}
							>
								{#if !header.isPlaceholder}
									<DataTableColumnHeader
										column={header.column}
										title={getColumnLabel(header.column.id)}
										filter={filterSnippet}
									/>
								{/if}
								{#if !isLast}
									<ColumnResizer {header} />
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
									<Table.Cell class="overflow-hidden">
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
									<Table.Cell class="overflow-hidden">
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
