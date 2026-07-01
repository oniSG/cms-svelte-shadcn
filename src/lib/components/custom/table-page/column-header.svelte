<script lang="ts">
	import type { Column } from '@tanstack/table-core';
	import ArrowUpIcon from '@lucide/svelte/icons/arrow-up';
	import ArrowDownIcon from '@lucide/svelte/icons/arrow-down';
	import ChevronsUpDownIcon from '@lucide/svelte/icons/chevrons-up-down';
	import { Button } from '$lib/components/ui/button';
	import { cn } from '$lib/utils.js';
	import type { Align } from './types';

	let {
		column,
		title,
		align = 'left'
	}: {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		column: Column<any, unknown>;
		title: string;
		align?: Align;
	} = $props();

	const alignClass = $derived(
		align === 'right' ? 'justify-end' : align === 'center' ? 'justify-center' : 'justify-start'
	);

	function onClick(e: MouseEvent) {
		e.stopPropagation();
		column.toggleSorting();
	}
</script>

{#if !column?.getCanSort()}
	<div class={cn('flex items-center', alignClass)}>
		{title}
	</div>
{:else}
	<Button
		variant="ghost"
		class={cn(
			'h-full w-full gap-2 rounded-none border-0 active:not-aria-[haspopup]:translate-none',
			alignClass
		)}
		onclick={onClick}
	>
		{title}
		{#if column.getIsSorted() === 'desc'}
			<ArrowDownIcon />
		{:else if column.getIsSorted() === 'asc'}
			<ArrowUpIcon />
		{:else}
			<ChevronsUpDownIcon class="text-muted-foreground/70" />
		{/if}
	</Button>
{/if}
