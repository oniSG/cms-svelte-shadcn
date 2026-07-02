<script lang="ts" generics="Row">
	import type { Table as TanStackTable } from '@tanstack/table-core';
	import { FlexRender } from '$lib/components/ui/data-table/index.js';
	import * as Table from '$lib/components/ui/table/index.js';
	import { cn } from '$lib/utils.js';
	import ColumnResizer from '$lib/components/custom/data-table/column-resizer.svelte';
	import {
		Empty,
		EmptyDescription,
		EmptyHeader,
		EmptyMedia,
		EmptyTitle
	} from '$lib/components/ui/empty/index.js';
	import { Skeleton } from '$lib/components/ui/skeleton/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import SearchXIcon from '@lucide/svelte/icons/search-x';
	import InboxIcon from '@lucide/svelte/icons/inbox';
	import RowWrapper from './row-wrapper.svelte';
	import * as m from '$lib/paraglide/messages.js';
	import type { ClickConfig } from './types';

	let {
		table,
		rows,
		limit,
		page,
		totalPages,
		loading,
		click,
		isInfinite = false,
		hasNextPage = false,
		onLoadMore = () => {},
		scrollKey = '',
		isFiltered = false,
		onResetFilters,
		noResultsTitle = '',
		noResultsDescription = '',
		noResultsEmptyTitle = '',
		noResultsEmptyDescription = ''
	}: {
		table: TanStackTable<Row>;
		rows: Row[];
		limit: number;
		page: number;
		totalPages: number;
		loading: boolean;
		click?: ClickConfig<Row>;
		isInfinite?: boolean;
		hasNextPage?: boolean;
		onLoadMore?: () => void;
		scrollKey?: string;
		isFiltered?: boolean;
		onResetFilters?: () => void;
		noResultsTitle?: string;
		noResultsDescription?: string;
		noResultsEmptyTitle?: string;
		noResultsEmptyDescription?: string;
	} = $props();

	const showSkeletons = $derived(loading && rows.length === 0);
	const showNoResults = $derived(!loading && rows.length === 0);
	const skeletonCount = $derived(Number.isFinite(limit) ? limit : 30);

	let scrollContainer: HTMLDivElement | undefined = $state();
	let sentinel: HTMLDivElement | undefined = $state();

	$effect(() => {
		scrollKey;
		scrollContainer?.scrollTo({ top: 0 });
	});

	$effect(() => {
		if (!isInfinite || !sentinel || !scrollContainer) return;
		const obs = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting) onLoadMore();
			},
			{ root: scrollContainer, rootMargin: '1200px 0px' }
		);
		obs.observe(sentinel);
		return () => obs.disconnect();
	});
</script>

{#snippet skeletonRows()}
	{#each Array.from({ length: skeletonCount }, (_, i) => i) as i (i)}
		<Table.Row aria-hidden="true">
			{#each table.getVisibleLeafColumns() as col (col.id)}
				<Table.Cell class="overflow-hidden border-b whitespace-nowrap">
					<Skeleton class="h-4 w-full max-w-40 rounded" />
				</Table.Cell>
			{/each}
		</Table.Row>
	{/each}
{/snippet}

{#snippet noResults()}
	<Empty class="flex-1">
		<EmptyHeader>
			<EmptyMedia variant="icon">
				{#if isFiltered}
					<SearchXIcon />
				{:else}
					<InboxIcon />
				{/if}
			</EmptyMedia>
			<EmptyTitle>
				{isFiltered
					? noResultsTitle || m.tp_no_results_title()
					: noResultsEmptyTitle || m.tp_no_data_title()}
			</EmptyTitle>
			<EmptyDescription>
				{isFiltered
					? noResultsDescription || m.tp_no_results_description()
					: noResultsEmptyDescription || m.tp_no_data_description()}
			</EmptyDescription>
		</EmptyHeader>
		{#if isFiltered && onResetFilters}
			<Button variant="outline" size="sm" onclick={onResetFilters}>{m.tp_clear_filters()}</Button>
		{/if}
	</Empty>
{/snippet}

<div
	bind:this={scrollContainer}
	class={cn(
		'relative flex min-h-0 min-w-0 flex-1 flex-col overflow-auto overscroll-none transition-opacity',
		loading && rows.length > 0 && 'opacity-60'
	)}
>
	<table class="w-full caption-bottom border-separate border-spacing-0 text-sm">
		<Table.Header>
			{#each table.getHeaderGroups() as headerGroup (headerGroup.id)}
				<Table.Row>
					{#each headerGroup.headers as header, i (header.id)}
						{@const isLast = i === headerGroup.headers.length - 1}
						{@const isSelectCol = header.column.id === '__select'}
						{@const sized = table.getState().columnSizing[header.column.id]}
						<Table.Head
							colspan={header.colSpan}
							class={cn(
								'sticky top-0 z-10 border-b bg-background whitespace-nowrap',
								isSelectCol && 'w-10 min-w-10 px-0',
								!isSelectCol && !isLast && sized === undefined && 'w-px'
							)}
							style={!isSelectCol && !isLast && sized !== undefined ? `width: ${sized}px` : ''}
						>
							{#if !header.isPlaceholder}
								<FlexRender
									content={header.column.columnDef.header}
									context={header.getContext()}
								/>
							{/if}
							{#if !isLast && header.column.getCanResize()}
								<ColumnResizer {header} />
							{/if}
						</Table.Head>
					{/each}
				</Table.Row>
			{/each}
		</Table.Header>
		<Table.Body>
			{#each table.getRowModel().rows as row (row.id)}
				<RowWrapper
					row={row.original as Row}
					sheet={click?.sheet}
					href={click?.href}
					onClick={click?.onClick}
					menu={click?.menu}
				>
					{#snippet children(props)}
						<Table.Row {...props} data-state={row.getIsSelected() && 'selected'}>
							{#each row.getVisibleCells() as cell (cell.id)}
								<Table.Cell
									class={cn(
										'overflow-hidden border-b whitespace-nowrap',
										cell.column.id === '__select' && 'relative w-10 min-w-10 p-0'
									)}
								>
									<FlexRender content={cell.column.columnDef.cell} context={cell.getContext()} />
								</Table.Cell>
							{/each}
						</Table.Row>
					{/snippet}
				</RowWrapper>
			{:else}
				{#if showSkeletons}{@render skeletonRows()}{/if}
			{/each}
		</Table.Body>
	</table>

	{#if showNoResults}{@render noResults()}{/if}

	{#if isInfinite && hasNextPage}
		<div bind:this={sentinel} class="h-px w-full shrink-0"></div>
	{/if}
</div>
