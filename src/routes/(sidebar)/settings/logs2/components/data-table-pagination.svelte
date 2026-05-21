<script lang="ts" generics="TData">
	import type { Table } from '@tanstack/table-core';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { Button } from '$lib/components/ui/button';
	import * as ButtonGroup from '$lib/components/ui/button-group/index.js';
	import ChevronLeftIcon from '@lucide/svelte/icons/chevron-left';
	import ChevronRightIcon from '@lucide/svelte/icons/chevron-right';

	const PAGE_SIZE_OPTIONS = [10, 20, 30, 50];

	let { table }: { table: Table<TData> } = $props();

	const pageSize = $derived(table.getState().pagination.pageSize);
	const pageIndex = $derived(table.getState().pagination.pageIndex);
	const totalRows = $derived(table.getFilteredRowModel().rows.length);
	const currentPage = $derived(pageIndex + 1);
</script>

<div class="flex w-full items-center justify-between py-2">
	<div class="flex w-full items-center gap-2">
		<DropdownMenu.Root>
			<DropdownMenu.Trigger>
				{#snippet child({ props })}
					<Button {...props} variant="outline" size="sm">
						{pageSize} items per page
					</Button>
				{/snippet}
			</DropdownMenu.Trigger>
			<DropdownMenu.Content align="end">
				{#each PAGE_SIZE_OPTIONS as size (size)}
					<DropdownMenu.CheckboxItem
						onSelect={() => table.setPageSize(size)}
						checked={pageSize === size}
					>
						{size}
					</DropdownMenu.CheckboxItem>
				{/each}
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	</div>

	<ButtonGroup.Root>
		<Button
			variant="outline"
			size="sm"
			onclick={() => table.previousPage()}
			disabled={!table.getCanPreviousPage()}
		>
			<ChevronLeftIcon />
		</Button>
		<Button variant="outline" size="sm">
			{currentPage} / {Math.ceil(totalRows / pageSize)}
		</Button>
		<Button
			variant="outline"
			size="sm"
			onclick={() => table.nextPage()}
			disabled={!table.getCanNextPage()}
		>
			<ChevronRightIcon />
		</Button>
	</ButtonGroup.Root>
</div>
