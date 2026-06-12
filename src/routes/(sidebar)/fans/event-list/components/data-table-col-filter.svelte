<script generics="TData, TValue" lang="ts">
	import type { Column } from '@tanstack/table-core';
	import type { Component } from 'svelte';
	import * as Command from '$lib/components/ui/command/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import { Button } from '$lib/components/ui/button/index.js';

	let {
		column,
		title,
		icon,
		options
	}: {
		column: Column<TData, TValue>;
		title: string;
		icon: Component;
		options: string[];
	} = $props();

	const selected = $derived((column?.getFilterValue() as string[] | undefined) ?? []);

	function toggle(option: string) {
		const next = selected.includes(option)
			? selected.filter((v) => v !== option)
			: [...selected, option];
		column?.setFilterValue(next.length ? next : undefined);
	}
</script>

<Popover.Root>
	<Popover.Trigger>
		{#snippet child({ props })}
			<Button {...props} variant={selected.length > 0 ? 'default' : 'outline'} size="sm">
				{#if icon}
					{@const Icon = icon}
					<Icon />
				{/if}
				{title}
			</Button>
		{/snippet}
	</Popover.Trigger>
	<Popover.Content align="start" class="w-56 p-0">
		<Command.Root>
			<Command.Input placeholder={title} />
			<Command.List>
				<Command.Empty>No results found.</Command.Empty>
				<Command.Group>
					{#each options as option (option)}
						{@const isSelected = selected.includes(option)}
						<Command.Item data-checked={isSelected} onSelect={() => toggle(option)}>
							{option}
						</Command.Item>
					{/each}
				</Command.Group>
				{#if selected.length > 0}
					<Command.Separator />
					<Command.Group>
						<Command.Item
							onSelect={() => column?.setFilterValue(undefined)}
							class="justify-center text-center"
						>
							Clear filters
						</Command.Item>
					</Command.Group>
				{/if}
			</Command.List>
		</Command.Root>
	</Popover.Content>
</Popover.Root>
