<script lang="ts" generics="Row">
	import { setContext, untrack } from 'svelte';
	import {
		type ColumnOrderState,
		type ColumnSizingState,
		getCoreRowModel,
		type RowSelectionState,
		type SortingState,
		type Table as TanStackTable,
		type VisibilityState
	} from '@tanstack/table-core';
	import { createSvelteTable, renderComponent } from '$lib/components/ui/data-table/index.js';
	import Toolbar from './toolbar.svelte';
	import Body from './body.svelte';
	import BottomBar from './bottom-bar.svelte';
	import {
		clampPage,
		createTableParams,
		goNext,
		goPrev,
		goToPage,
		patchAndResetPage,
		resolveTableQuery
	} from './url-state.svelte.js';
	import { createTableInfiniteQuery, createTableQuery } from './query.js';
	import { decodeStoredLimit, loadPreferences, patchPreferences } from './preferences.js';
	import { emptyQuery, serializeQuery, type Group } from './query-builder/fields.js';
	import { deriveQueryFields, toTanstackColumns } from './columns.js';
	import CellActions from './cells/cell-actions.svelte';
	import SelectCell from './cells/select-cell.svelte';
	import SelectHeader from './cells/select-header.svelte';
	import { ROW_ACTIONS_KEY, type RowActions, type RowActionsContext } from './context';
	import type {
		ClickConfig,
		DefaultSort,
		QueryFieldDef,
		SearchConfig,
		SelectionAction,
		Shortcut,
		TableColumn,
		TableFetcher
	} from './types';
	import type { ColumnDef } from '@tanstack/table-core';

	let {
		queryKey,
		columns,
		fetcher,
		search,
		shortcuts = [],
		queryFields,
		click,
		pageSizes = [30, 50, 100, 200, Infinity],
		defaultLimit = 30,
		defaultSort,
		rowActions,
		rowActionsTitle,
		selectable = false,
		getRowId,
		onDeleteSelected,
		selectionActions = [],
		noResultsTitle,
		noResultsDescription,
		noResultsEmptyTitle,
		noResultsEmptyDescription
	}: {
		queryKey: string;
		columns: TableColumn<Row>[];
		fetcher: TableFetcher<Row>;
		search?: SearchConfig;
		shortcuts?: Shortcut[];
		queryFields?: QueryFieldDef[];
		click?: ClickConfig<Row>;
		pageSizes?: number[];
		defaultLimit?: number;
		defaultSort?: DefaultSort;
		rowActions?: RowActions<Row>;
		rowActionsTitle?: (row: Row) => string;
		selectable?: boolean;
		getRowId?: (row: Row, index: number) => string;
		onDeleteSelected?: (ids: string[]) => void;
		selectionActions?: SelectionAction[];
		noResultsTitle?: string;
		noResultsDescription?: string;
		noResultsEmptyTitle?: string;
		noResultsEmptyDescription?: string;
	} = $props();

	setContext<RowActionsContext>(ROW_ACTIONS_KEY, {
		get: () => rowActions,
		title: (row: Row) => rowActionsTitle?.(row)
	});

	// svelte-ignore state_referenced_locally
	const initialSort: DefaultSort = defaultSort ?? { id: columns[0]?.id ?? 'id', desc: true };
	// svelte-ignore state_referenced_locally
	const storedPrefs = loadPreferences(queryKey);
	// svelte-ignore state_referenced_locally
	const initialLimit = decodeStoredLimit(storedPrefs.limit) ?? defaultLimit;

	const resolvedQueryFields = $derived(queryFields ?? deriveQueryFields(columns, shortcuts));

	const allColumns = $derived<TableColumn<Row>[]>(
		rowActions
			? [
					...columns,
					{
						id: '__actions',
						label: '',
						type: 'text',
						sortable: false,
						hideable: false,
						resizable: false,
						cell: CellActions as TableColumn<Row>['cell']
					}
				]
			: columns
	);

	const tanstackColumns = $derived.by<ColumnDef<Row>[]>(() => {
		const base = toTanstackColumns(allColumns);
		if (!selectable) return base;
		const selectColumn: ColumnDef<Row> = {
			id: '__select',
			size: 40,
			minSize: 40,
			maxSize: 40,
			enableSorting: false,
			enableHiding: false,
			enableResizing: false,
			header: ({ table }) => renderComponent(SelectHeader, { table }),
			cell: ({ row }) => renderComponent(SelectCell, { row })
		};
		return [selectColumn, ...base];
	});

	function defaultGetRowId(row: Row, index: number): string {
		const id = (row as Record<string, unknown>)['id'];
		return id != null ? String(id) : String(index);
	}
	const resolvedGetRowId = $derived(getRowId ?? defaultGetRowId);

	const params = createTableParams({ defaultLimit: initialLimit, defaultSort: initialSort });
	const fallbackAsOf = new Date();

	const fromUrl = $derived(
		resolveTableQuery(
			$params,
			{ defaultLimit: initialLimit, defaultSort: initialSort },
			fallbackAsOf
		)
	);

	let q = $state<Group>(emptyQuery());
	let hydrated = false;

	$effect(() => {
		if (hydrated) return;
		hydrated = true;
		q = fromUrl.q;
		params.update((c) => ({ ...c, as_of: new Date() }));
	});

	$effect(() => {
		const snap = $state.snapshot(q);
		if (!hydrated) return;
		const urlSer = serializeQuery(untrack(() => fromUrl.q));
		if (serializeQuery(snap) !== urlSer) {
			params.update((c) => ({ ...c, q: snap, as_of: new Date(), page: 1 }));
		}
	});

	const currentQuery = $derived({ ...fromUrl, q });
	// svelte-ignore state_referenced_locally
	const initialKey = queryKey;
	// svelte-ignore state_referenced_locally
	const initialFetcher = fetcher;

	const isInfinite = $derived(!Number.isFinite(currentQuery.limit));
	const infiniteFetchLimit = $derived(isInfinite ? defaultLimit : currentQuery.limit);

	const data = createTableQuery<Row>(
		initialKey,
		initialFetcher,
		() => currentQuery,
		() => !isInfinite
	);

	const infData = createTableInfiniteQuery<Row>(
		initialKey,
		initialFetcher,
		() => ({
			asOf: currentQuery.asOf,
			sort: currentQuery.sort,
			dir: currentQuery.dir,
			q: currentQuery.q
		}),
		() => infiniteFetchLimit,
		() => isInfinite
	);

	const rows = $derived<Row[]>(
		isInfinite ? (infData.data?.pages.flatMap((p) => p.items) ?? []) : (data.data?.items ?? [])
	);

	const totalRecords = $derived(
		isInfinite ? (infData.data?.pages[0]?.total ?? 0) : (data.data?.total ?? 0)
	);

	const totalPagesValue = $derived(
		isInfinite ? (infData.data?.pages[0]?.totalPages ?? 1) : (data.data?.totalPages ?? 1)
	);

	const fetching = $derived(
		isInfinite ? infData.isFetching && !infData.isFetchingNextPage : data.isFetching
	);

	const scrollResetKey = $derived(
		`${currentQuery.page}|${currentQuery.sort}|${currentQuery.dir}|${currentQuery.limit}|${serializeQuery(currentQuery.q)}`
	);

	$effect(() => {
		if (isInfinite) return;
		if (!data.isFetching && data.data) {
			clampPage(params, currentQuery.page, data.data.totalPages);
		}
	});

	let columnVisibility = $state<VisibilityState>(storedPrefs.columnVisibility ?? {});
	let rowSelection = $state<RowSelectionState>({});
	let columnSizing = $state<ColumnSizingState>(storedPrefs.columnSizing ?? {});
	let columnOrder = $state<ColumnOrderState>(storedPrefs.columnOrder ?? []);

	$effect(() => {
		patchPreferences(queryKey, { columnVisibility: $state.snapshot(columnVisibility) });
	});

	$effect(() => {
		patchPreferences(queryKey, { columnOrder: $state.snapshot(columnOrder) });
	});

	$effect(() => {
		patchPreferences(queryKey, { columnSizing: $state.snapshot(columnSizing) });
	});

	$effect(() => {
		patchPreferences(queryKey, { limit: currentQuery.limit });
	});

	const sorting = $derived<SortingState>([
		{ id: currentQuery.sort, desc: currentQuery.dir === 'desc' }
	]);

	const table: TanStackTable<Row> = createSvelteTable({
		get data() {
			return rows;
		},
		get columns() {
			return tanstackColumns;
		},
		getRowId: (row, index) => resolvedGetRowId(row, index),
		get enableRowSelection() {
			return selectable;
		},
		getCoreRowModel: getCoreRowModel(),
		manualPagination: true,
		manualSorting: true,
		manualFiltering: true,
		enableColumnResizing: true,
		columnResizeMode: 'onChange',
		onSortingChange: (updater) => {
			const next = typeof updater === 'function' ? updater(sorting) : updater;
			if (next.length === 0) {
				patchAndResetPage(params, {
					sort: initialSort.id,
					dir: initialSort.desc === false ? 'asc' : 'desc'
				});
				return;
			}
			const { id, desc } = next[0];
			patchAndResetPage(params, { sort: id, dir: desc ? 'desc' : 'asc' });
		},
		onColumnVisibilityChange: (updater) => {
			columnVisibility = typeof updater === 'function' ? updater(columnVisibility) : updater;
		},
		onRowSelectionChange: (updater) => {
			rowSelection = typeof updater === 'function' ? updater(rowSelection) : updater;
		},
		onColumnSizingChange: (updater) => {
			columnSizing = typeof updater === 'function' ? updater(columnSizing) : updater;
		},
		onColumnOrderChange: (updater) => {
			columnOrder = typeof updater === 'function' ? updater(columnOrder) : updater;
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
			},
			get columnOrder() {
				if (!selectable || columnOrder.length === 0) return columnOrder;
				return ['__select', ...columnOrder.filter((id) => id !== '__select')];
			}
		}
	});

	function handlePatchQuery(next: Group) {
		q = next;
	}

	function handleReset() {
		q = emptyQuery();
	}

	function handleResetView() {
		q = emptyQuery();
		columnVisibility = {};
		columnOrder = [];
		columnSizing = {};
		params.update((c) => ({
			...c,
			sort: initialSort.id,
			dir: initialSort.desc === false ? 'asc' : 'desc',
			limit: initialLimit,
			page: 1,
			as_of: new Date()
		}));
	}

	const selectionIds = $derived(Object.keys(rowSelection).filter((id) => rowSelection[id]));
	const selectionCount = $derived(selectionIds.length);

	function clearSelection() {
		rowSelection = {};
	}
</script>

<div class="relative flex min-h-0 flex-1 flex-col">
	<Toolbar
		{queryKey}
		query={currentQuery.q}
		{table}
		{columns}
		queryFields={resolvedQueryFields}
		{search}
		{shortcuts}
		limit={currentQuery.limit}
		onPatchQuery={handlePatchQuery}
		onReset={handleReset}
		onResetView={handleResetView}
		onLimitChange={(limit) => patchAndResetPage(params, { limit })}
	/>

	<Body
		{table}
		{rows}
		limit={isInfinite ? infiniteFetchLimit : currentQuery.limit}
		page={currentQuery.page}
		totalPages={totalPagesValue}
		loading={fetching}
		{isInfinite}
		hasNextPage={infData.hasNextPage ?? false}
		onLoadMore={() => infData.fetchNextPage()}
		scrollKey={scrollResetKey}
		{click}
		isFiltered={currentQuery.q.children.length > 0}
		onResetFilters={handleReset}
		{noResultsTitle}
		{noResultsDescription}
		{noResultsEmptyTitle}
		{noResultsEmptyDescription}
	/>

	<BottomBar
		page={currentQuery.page}
		total={totalRecords}
		totalPages={totalPagesValue}
		limit={currentQuery.limit}
		{pageSizes}
		loading={fetching}
		{isInfinite}
		onGotoPage={(page) => goToPage(params, page)}
		onNext={() => goNext(params, totalPagesValue)}
		onPrev={() => goPrev(params)}
		onLimitChange={(limit) => patchAndResetPage(params, { limit })}
		selectionCount={selectable ? selectionCount : 0}
		selectionIds={selectable ? selectionIds : []}
		{selectionActions}
		{onDeleteSelected}
		onClearSelection={selectable ? clearSelection : undefined}
	/>
</div>
