<script lang="ts">
	import * as Command from '$lib/components/ui/command/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import ChevronDownIcon from '@lucide/svelte/icons/chevron-down';
	import CheckIcon from '@lucide/svelte/icons/check';
	import { cn } from '$lib/utils.js';
	import FilterShell from './filter-shell.svelte';
	import { getField, type Filter, type SelectFilter } from './fields.js';
	import type { QueryFieldDef } from '../types';

	let {
		filter,
		fields,
		onChange,
		onDelete
	}: {
		filter: SelectFilter;
		fields: QueryFieldDef[];
		onChange: (next: Filter) => void;
		onDelete: () => void;
	} = $props();

	let open = $state(false);

	const def = $derived(getField(fields, filter.field));
	const options = $derived(def?.type === 'select' ? def.options : []);
	const searchable = $derived(def?.type === 'select' ? def.searchable !== false : true);
	const valueLabel = $derived(options.find((o) => o.value === filter.value)?.label ?? 'value...');
</script>

<FilterShell {filter} {fields} {onChange} {onDelete}>
	<Popover.Root bind:open>
		<Popover.Trigger>
			{#snippet child({ props })}
				<Button
					{...props}
					variant="outline"
					role="combobox"
					aria-expanded={open}
					class="w-full justify-between border border-border bg-background font-normal"
				>
					<span class:text-muted-foreground={!filter.value}>{valueLabel}</span>
					<ChevronDownIcon class="size-4 opacity-50" />
				</Button>
			{/snippet}
		</Popover.Trigger>
		<Popover.Content class="w-72 p-0" align="start">
			<Command.Root>
				{#if searchable}
					<Command.Input placeholder="Search {def?.label?.toLowerCase() ?? 'options'}..." />
				{/if}
				<Command.List>
					{#if searchable}
						<Command.Empty>No results.</Command.Empty>
					{/if}
					<Command.Group heading={def?.label ?? 'Options'}>
						{#each options as o (o.value)}
							<Command.Item
								value={o.value}
								onSelect={() => {
									onChange({ ...filter, value: o.value });
									open = false;
								}}
							>
								<CheckIcon
									class={cn('size-4', filter.value === o.value ? 'opacity-100' : 'opacity-0')}
								/>
								{o.label}
							</Command.Item>
						{/each}
					</Command.Group>
				</Command.List>
			</Command.Root>
		</Popover.Content>
	</Popover.Root>
</FilterShell>
