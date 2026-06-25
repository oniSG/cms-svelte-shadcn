<script lang="ts" generics="TData">
	import { FlexRender } from '$lib/components/ui/data-table/index.js';
	import * as TableUI from '$lib/components/ui/table/index.js';
	import type { Table } from '@tanstack/table-core';
	import ColumnResizer from './column-resizer.svelte';

	let { table, class: className }: { table: Table<TData>; class?: string } = $props();
</script>

<TableUI.Header class={className}>
	{#each table.getHeaderGroups() as headerGroup (headerGroup.id)}
		<TableUI.Row>
			{#each headerGroup.headers as header, i (header.id)}
				{@const isLast = i === headerGroup.headers.length - 1}
				<!-- Last column has no explicit width and no resize handle: it
				     absorbs whatever space the fixed columns leave (the table
				     uses `table-layout: fixed`, so an unsized column gets the
				     remainder). -->
				<TableUI.Head
					colspan={header.colSpan}
					class="relative"
					style={isLast ? '' : `width: ${header.getSize()}px`}
				>
					{#if !header.isPlaceholder}
						<FlexRender content={header.column.columnDef.header} context={header.getContext()} />
					{/if}
					{#if !isLast}
						<ColumnResizer {header} />
					{/if}
				</TableUI.Head>
			{/each}
		</TableUI.Row>
	{/each}
</TableUI.Header>
