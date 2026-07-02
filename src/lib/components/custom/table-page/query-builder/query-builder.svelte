<script lang="ts">
	import { untrack } from 'svelte';
	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
	import * as Sheet from '$lib/components/ui/sheet/index.js';
	import FilterIcon from '@lucide/svelte/icons/filter';
	import ChevronRightIcon from '@lucide/svelte/icons/chevron-right';
	import {
		countFilters,
		deserializeQuery,
		emptyQuery,
		serializeQuery,
		type Group
	} from './fields.js';
	import GroupView from './group.svelte';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import * as m from '$lib/paraglide/messages.js';
	import type { QueryFieldDef } from '../types';

	let {
		group,
		fields,
		onApply
	}: {
		group: Group;
		fields: QueryFieldDef[];
		onApply: (next: Group) => void;
	} = $props();

	const total = $derived(countFilters(group));

	function cloneGroup(g: Group): Group {
		return deserializeQuery(serializeQuery(g)) ?? emptyQuery();
	}

	let sheetOpen = $state(false);
	// svelte-ignore state_referenced_locally
	let draft = $state<Group>(cloneGroup(group));

	$effect(() => {
		if (sheetOpen) {
			draft = cloneGroup(untrack(() => group));
		}
	});

	const draftDirty = $derived(serializeQuery(draft) !== serializeQuery(group));

	function apply() {
		onApply(cloneGroup(draft));
		sheetOpen = false;
	}
</script>

<Sheet.Root bind:open={sheetOpen}>
	<Sheet.Trigger>
		{#snippet child({ props })}
			<Button {...props} size="sm" variant={total > 0 ? 'default' : 'outline'}>
				<FilterIcon />
				{m.tp_advanced_filtering()}
			</Button>
		{/snippet}
	</Sheet.Trigger>
	<Sheet.Content
		showCloseButton={false}
		class="p-0 data-[side=right]:w-fit data-[side=right]:min-w-200 data-[side=right]:sm:max-w-none"
	>
		<Sheet.Header class="flex flex-row items-center px-8 pt-6 pb-0 md:gap-4">
			<Button
				variant="outline"
				size="icon-lg"
				class="scale-110 border-primary/30 bg-primary/5 p-0 text-primary hover:bg-primary/10"
			>
				<FilterIcon class="text-primary" />
			</Button>
			<div class="flex min-w-0 flex-col">
				<Sheet.Title class="text-lg font-medium">{m.tp_advanced_filtering()}</Sheet.Title>
				<Sheet.Description class="text-sm text-muted-foreground">
					{m.tp_advanced_filtering_description()}
				</Sheet.Description>
			</div>
			<div class="ml-auto flex items-center gap-2">
				<Button size="sm" onclick={apply} disabled={!draftDirty}>{m.tp_apply()}</Button>
				<Sheet.Close class={buttonVariants({ variant: 'secondary', size: 'icon' })}>
					<ChevronRightIcon />
				</Sheet.Close>
			</div>
		</Sheet.Header>
		<Separator class="my-4" />

		<div class="no-scrollbar flex-1 overflow-y-auto px-8 pb-6">
			<GroupView group={draft} {fields} root />
		</div>
	</Sheet.Content>
</Sheet.Root>
