<script lang="ts">
	import type { Component } from 'svelte';
	import { SvelteSet } from 'svelte/reactivity';
	import * as Command from '$lib/components/ui/command/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import { Button } from '$lib/components/ui/button/index.js';

	let {
		title,
		icon: Icon,
		options,
		value,
		searchable = true,
		onChange
	}: {
		title: string;
		icon?: Component;
		options: { label: string; value: string }[];
		value: string[];
		searchable?: boolean;
		onChange: (next: string[]) => void;
	} = $props();

	const selected = $derived(new SvelteSet(value));

	function toggle(v: string) {
		const next = new SvelteSet(selected);
		if (next.has(v)) next.delete(v);
		else next.add(v);
		onChange(Array.from(next));
	}
</script>

<Popover.Root>
	<Popover.Trigger>
		{#snippet child({ props })}
			<Button {...props} size="sm" variant={selected.size > 0 ? 'default' : 'outline'}>
				{#if Icon}
					<Icon />
				{/if}
				{title}
			</Button>
		{/snippet}
	</Popover.Trigger>
	<Popover.Content class="w-56 p-0" align="start">
		<Command.Root>
			{#if searchable}
				<Command.Input placeholder={title} />
			{/if}
			<Command.List>
				{#if searchable}
					<Command.Empty>No results.</Command.Empty>
				{/if}
				<Command.Group heading={title}>
					{#each options as option (option.value)}
						{@const isSelected = selected.has(option.value)}
						<Command.Item data-checked={isSelected} onSelect={() => toggle(option.value)}>
							{option.label}
						</Command.Item>
					{/each}
				</Command.Group>
				{#if selected.size > 0}
					<Command.Separator />
					<Command.Group>
						<Command.Item onSelect={() => onChange([])} class="justify-center text-center">
							Clear filters
						</Command.Item>
					</Command.Group>
				{/if}
			</Command.List>
		</Command.Root>
	</Popover.Content>
</Popover.Root>
