<script lang="ts">
	import type { Node } from '@xyflow/svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import { cn } from '$lib/utils.js';
	import X from '@lucide/svelte/icons/x';
	import type { WorkflowNodeData } from './workflow-types';
	import { workflowItemLabel } from './workflow-labels';
	import { workflowDrawerContent } from './drawers/registry';

	let {
		open = $bindable(false),
		node = null
	}: {
		open?: boolean;
		node?: Node<WorkflowNodeData> | null;
	} = $props();

	const title = $derived(node ? workflowItemLabel(node.data.itemId) : '');
	const DrawerContent = $derived(node ? workflowDrawerContent(node.data.itemId) : null);

	function close() {
		open = false;
	}
</script>

<div class="relative h-full min-w-0 shrink-0">
	<div
		aria-hidden="true"
		class={cn(
			'h-full bg-transparent transition-[width] duration-200 ease-linear',
			open ? 'w-80' : 'w-0'
		)}
	></div>

	<div
		class={cn(
			'absolute inset-y-0 right-0 z-10 flex h-full w-80 flex-col overflow-hidden border-s bg-background transition-[transform] duration-200 ease-linear',
			open ? 'translate-x-0' : 'pointer-events-none translate-x-full'
		)}
		aria-hidden={!open}
	>
		{#if node && DrawerContent}
			<header class="flex shrink-0 items-center justify-between gap-3 border-b px-4 py-3">
				<h2 class="min-w-0 truncate text-base font-semibold">{title}</h2>
				<Button type="button" variant="ghost" size="icon-sm" onclick={close}>
					<X />
					<span class="sr-only">Close</span>
				</Button>
			</header>

			<div class="min-h-0 flex-1 overflow-y-auto px-4 py-4">
				<DrawerContent nodeId={node.id} data={node.data} />
			</div>
		{/if}
	</div>
</div>
