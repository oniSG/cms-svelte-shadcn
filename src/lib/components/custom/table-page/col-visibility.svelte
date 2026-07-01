<script lang="ts" generics="TData">
	import type { Table } from '@tanstack/table-core';
	import { flip } from 'svelte/animate';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { Button } from '$lib/components/ui/button';
	import Columns3Icon from '@lucide/svelte/icons/columns-3';
	import GripVerticalIcon from '@lucide/svelte/icons/grip-vertical';
	import CheckIcon from '@lucide/svelte/icons/check';
	import { dragHandle, dragHandleZone } from 'svelte-dnd-action';
	import { cn } from '$lib/utils.js';

	let {
		table,
		labelFor = (id: string) => id
	}: {
		table: Table<TData>;
		labelFor?: (id: string) => string;
	} = $props();

	type Item = { id: string; isDndShadowItem?: boolean };
	const FLIP_MS = 180;

	let items = $state<Item[]>([]);
	let dragging = $state(false);

	const orderableIds = $derived(
		table
			.getAllLeafColumns()
			.filter((c) => c.id !== '__actions' && c.id !== '__select')
			.map((c) => c.id)
	);

	$effect(() => {
		if (dragging) return;
		const externalIds = orderableIds.join('|');
		const currentIds = items.map((i) => i.id).join('|');
		if (externalIds !== currentIds) {
			items = orderableIds.map((id) => ({ id }));
		}
	});

	function handleConsider(e: CustomEvent<{ items: Item[] }>) {
		dragging = true;
		items = e.detail.items;
	}

	function handleFinalize(e: CustomEvent<{ items: Item[] }>) {
		items = e.detail.items;
		const newOrder = items.map((i) => i.id);
		const all = table.getAllLeafColumns().map((c) => c.id);
		const head: string[] = [];
		const tail: string[] = [];
		for (const id of all) {
			if (newOrder.includes(id)) continue;
			if (id === '__select') head.push(id);
			else tail.push(id);
		}
		table.setColumnOrder([...head, ...newOrder, ...tail]);
		dragging = false;
	}

	function stopGrip(e: Event) {
		e.stopPropagation();
		e.preventDefault();
	}
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger>
		{#snippet child({ props })}
			<Button {...props} variant="outline" size="sm" class="ml-auto">
				<Columns3Icon />
				Columns
			</Button>
		{/snippet}
	</DropdownMenu.Trigger>
	<DropdownMenu.Content align="end" class="w-64 p-3">
		<DropdownMenu.Label>Columns</DropdownMenu.Label>
		<div
			use:dragHandleZone={{
				items,
				flipDurationMs: FLIP_MS,
				dropTargetStyle: {}
			}}
			onconsider={handleConsider}
			onfinalize={handleFinalize}
			class="flex flex-col"
		>
			{#each items as item (item.id)}
				<div animate:flip={{ duration: FLIP_MS }}>
					{#if item.isDndShadowItem}
						<div
							class="h-9 rounded-2xl border-2 border-dashed border-primary/60 bg-primary/10"
						></div>
					{:else}
						{@const column = table.getColumn(item.id)}
						{#if column}
							{@const visible = column.getIsVisible()}
							{@const canHide = column.getCanHide()}
							<button
								type="button"
								onclick={() => {
									if (canHide) column.toggleVisibility(!visible);
								}}
								class={cn(
									'group/col-vis relative flex w-full items-center gap-2 rounded-2xl px-3 py-2 text-sm font-medium outline-hidden select-none hover:bg-accent hover:text-accent-foreground focus-visible:bg-accent focus-visible:text-accent-foreground',
									canHide ? 'hover:cursor-pointer' : 'cursor-default'
								)}
							>
								<span
									use:dragHandle
									class="-ml-1.5 flex cursor-grab items-center text-muted-foreground transition-opacity active:cursor-grabbing"
									role="presentation"
									onclick={stopGrip}
									onmousedown={(e) => e.stopPropagation()}
									aria-label="Reorder column"
								>
									<GripVerticalIcon class="size-4" />
								</span>
								<span class="flex-1 text-left">{labelFor(item.id)}</span>
								<CheckIcon class={cn('size-4 shrink-0', !visible && 'opacity-0')} />
							</button>
						{/if}
					{/if}
				</div>
			{/each}
		</div>
	</DropdownMenu.Content>
</DropdownMenu.Root>
