<!--
  data-table-col-filter.svelte — a multi-select dropdown filter.

  Used by the DataTable toolbar for the "Type" and "User" filters.
  Renders a button that opens a searchable popover with checkable options.

  CONTROLLED component: it doesn't store the selection itself.
  - The parent passes the current selection in via `value`.
  - When the user clicks an option, the component calls `onChange`
    with the new list of selected values, and the parent decides
    what to do (in our case: update the URL).

  This pattern keeps the filter dumb and reusable — it doesn't know
  or care that the values eventually end up in the URL.
-->
<script lang="ts" generics="TValue extends string">
	import type { Component } from 'svelte';
	import { SvelteSet } from 'svelte/reactivity';
	import * as Command from '$lib/components/ui/command/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as m from '$lib/paraglide/messages.js';

	let {
		title, // shown on the trigger button (e.g. "Type")
		icon: Icon, // optional icon next to the title
		options, // all options the user can pick from
		value, // currently selected values (controlled by parent)
		onChange // called when selection changes; parent applies it
	}: {
		title: string;
		icon: Component;
		options: { label: string; value: TValue }[];
		value: TValue[];
		onChange: (next: TValue[]) => void;
	} = $props();

	// A reactive Set built from the current `value` — gives us O(1) `has()`
	// checks for marking which options are currently selected.
	const selected = $derived(new SvelteSet(value));

	// Flip one option on or off and report the new list to the parent.
	function toggle(v: TValue) {
		const next = new SvelteSet(selected);
		if (next.has(v)) next.delete(v);
		else next.add(v);
		onChange(Array.from(next));
	}
</script>

<Popover.Root>
	<Popover.Trigger>
		{#snippet child({ props })}
			<!-- Trigger button: gets a stronger "default" variant when there's an active selection
			     so the user can see at a glance which filters are on. -->
			<Button {...props} variant={selected.size > 0 ? 'default' : 'outline'} size="sm">
				{#if Icon}
					<Icon />
				{/if}
				{title}
			</Button>
		{/snippet}
	</Popover.Trigger>
	<Popover.Content class="w-56 p-0" align="start">
		<Command.Root>
			<Command.Input placeholder={title} />
			<Command.List>
				<Command.Empty>{m.log_filter_no_results()}</Command.Empty>
				<Command.Group>
					{#each options as option (option.value)}
						{@const isSelected = selected.has(option.value)}
						<Command.Item data-checked={isSelected} onSelect={() => toggle(option.value)}>
							{option.label}
						</Command.Item>
					{/each}
				</Command.Group>
				{#if selected.size > 0}
					<!-- "Clear" only appears when at least one option is selected. -->
					<Command.Separator />
					<Command.Group>
						<Command.Item onSelect={() => onChange([])} class="justify-center text-center">
							{m.log_filter_clear_filters()}
						</Command.Item>
					</Command.Group>
				{/if}
			</Command.List>
		</Command.Root>
	</Popover.Content>
</Popover.Root>
