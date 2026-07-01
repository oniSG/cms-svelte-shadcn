<script lang="ts">
	import { untrack } from 'svelte';
	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
	import * as Drawer from '$lib/components/ui/drawer/index.js';
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

	let drawerOpen = $state(false);
	// svelte-ignore state_referenced_locally
	let draft = $state<Group>(cloneGroup(group));

	$effect(() => {
		if (drawerOpen) {
			draft = cloneGroup(untrack(() => group));
		}
	});

	const draftDirty = $derived(serializeQuery(draft) !== serializeQuery(group));

	function apply() {
		onApply(cloneGroup(draft));
		drawerOpen = false;
	}
</script>

<Drawer.Root direction="right" bind:open={drawerOpen}>
	<Drawer.Trigger>
		{#snippet child({ props })}
			<Button {...props} size="sm" variant={total > 0 ? 'default' : 'outline'}>
				<FilterIcon />
				Advanced filtering
			</Button>
		{/snippet}
	</Drawer.Trigger>
	<Drawer.Content
		class="p-0 data-[vaul-drawer-direction=right]:w-fit data-[vaul-drawer-direction=right]:min-w-200 data-[vaul-drawer-direction=right]:sm:max-w-none"
	>
		<Drawer.Header class="flex flex-row items-center px-8 pt-6 pb-0 md:gap-4">
			<Button
				variant="outline"
				size="icon-lg"
				class="scale-110 border-primary/30 bg-primary/5 p-0 text-primary hover:bg-primary/10"
			>
				<FilterIcon class="text-primary" />
			</Button>
			<div class="flex min-w-0 flex-col">
				<Drawer.Title class="text-lg font-medium">Advanced filtering</Drawer.Title>
				<Drawer.Description class="text-sm text-muted-foreground">
					Build a complex nested query.
				</Drawer.Description>
			</div>
			<div class="ml-auto flex items-center gap-2">
				<Button size="sm" onclick={apply} disabled={!draftDirty}>Apply</Button>
				<Drawer.Close class={buttonVariants({ variant: 'secondary', size: 'icon' })}>
					<ChevronRightIcon />
				</Drawer.Close>
			</div>
		</Drawer.Header>
		<Separator class="my-4" />

		<div class="no-scrollbar flex-1 overflow-y-auto px-8 pb-6">
			<GroupView group={draft} {fields} root />
		</div>
	</Drawer.Content>
</Drawer.Root>
