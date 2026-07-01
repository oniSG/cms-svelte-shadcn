<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import * as ButtonGroup from '$lib/components/ui/button-group/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import PlusIcon from '@lucide/svelte/icons/plus';
	import LayoutGridIcon from '@lucide/svelte/icons/layout-grid';
	import XIcon from '@lucide/svelte/icons/x';
	import ArrowRightLeftIcon from '@lucide/svelte/icons/arrow-right-left';

	import { createFilter, createGroup, type Group, type Node } from './fields.js';
	import FilterText from './filter-text.svelte';
	import FilterNumber from './filter-number.svelte';
	import FilterSelect from './filter-select.svelte';
	import FilterDate from './filter-date.svelte';
	import FilterBool from './filter-bool.svelte';
	import Self from './group.svelte';
	import type { QueryFieldDef } from '../types';

	let {
		group,
		fields,
		root = false,
		onDelete
	}: {
		group: Group;
		fields: QueryFieldDef[];
		root?: boolean;
		onDelete?: () => void;
	} = $props();

	function addCondition() {
		if (fields.length === 0) return;
		group.children.push(createFilter(fields[0]));
	}

	function addGroup() {
		const g = createGroup('and');
		if (fields.length > 0) g.children.push(createFilter(fields[0]));
		group.children.push(g);
	}

	function toggleCombinator() {
		group.combinator = group.combinator === 'and' ? 'or' : 'and';
	}

	function replaceChild(i: number, next: Node) {
		group.children[i] = next;
	}

	function removeChild(i: number) {
		group.children.splice(i, 1);
		if (group.children.length === 0) onDelete?.();
	}

	const cardClass = $derived(
		group.combinator === 'and'
			? 'gap-2 py-0 rounded-2xl shadow-none ring-0 border bg-primary/5 border-primary/20'
			: 'gap-2 py-0 rounded-2xl shadow-none ring-0 border bg-orange-100/50 border-orange-200 dark:bg-orange-950/30 dark:border-orange-900/40'
	);

	const pillClass = $derived(
		group.combinator === 'and'
			? 'font-bold bg-primary/15 text-primary hover:bg-primary/25'
			: 'font-bold bg-orange-200/80 text-orange-900 hover:bg-orange-200 dark:bg-orange-800/50 dark:text-orange-100 dark:hover:bg-orange-800/70'
	);

	const headerClass = $derived(
		group.combinator === 'and'
			? 'border-b border-primary/20'
			: 'border-b border-orange-200 dark:border-orange-900/40'
	);
</script>

{#snippet renderChildren()}
	{#each group.children as child, i (child.id)}
		{#if child.type === 'group'}
			<Self group={child} {fields} onDelete={() => removeChild(i)} />
		{:else if child.type === 'text'}
			<FilterText
				filter={child}
				{fields}
				onChange={(n) => replaceChild(i, n)}
				onDelete={() => removeChild(i)}
			/>
		{:else if child.type === 'number'}
			<FilterNumber
				filter={child}
				{fields}
				onChange={(n) => replaceChild(i, n)}
				onDelete={() => removeChild(i)}
			/>
		{:else if child.type === 'select'}
			<FilterSelect
				filter={child}
				{fields}
				onChange={(n) => replaceChild(i, n)}
				onDelete={() => removeChild(i)}
			/>
		{:else if child.type === 'date'}
			<FilterDate
				filter={child}
				{fields}
				onChange={(n) => replaceChild(i, n)}
				onDelete={() => removeChild(i)}
			/>
		{:else if child.type === 'bool'}
			<FilterBool
				filter={child}
				{fields}
				onChange={(n) => replaceChild(i, n)}
				onDelete={() => removeChild(i)}
			/>
		{/if}
	{/each}
{/snippet}

{#snippet renderActions()}
	<Button variant="outline" size="sm" onclick={addCondition}>
		<PlusIcon /> Condition
	</Button>
	<Button variant="outline" size="sm" onclick={addGroup}>
		<LayoutGridIcon /> Group
	</Button>
{/snippet}

{#if root}
	<div class="space-y-2">
		{@render renderChildren()}
		{@render renderActions()}
	</div>
{:else}
	<Card.Root size="sm" class={cardClass}>
		<Card.Header class={headerClass}>
			<ButtonGroup.Root>
				<ButtonGroup.Root>
					<Button size="sm" class={pillClass} onclick={toggleCombinator}>
						{group.combinator.toUpperCase()}
						<ArrowRightLeftIcon />
					</Button>
				</ButtonGroup.Root>
				<ButtonGroup.Root>
					{#if onDelete}
						<Button size="icon-sm" variant="outline" onclick={onDelete} aria-label="Remove group">
							<XIcon />
						</Button>
					{/if}
				</ButtonGroup.Root>
			</ButtonGroup.Root>
		</Card.Header>

		{#if group.children.length > 0}
			<Card.Content class="space-y-2">
				{@render renderChildren()}
			</Card.Content>
		{/if}
		<Card.Footer class="space-x-2">
			{@render renderActions()}
		</Card.Footer>
	</Card.Root>
{/if}
