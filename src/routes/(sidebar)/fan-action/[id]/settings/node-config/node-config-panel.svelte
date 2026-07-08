<script lang="ts">
	import type { Node } from '@xyflow/svelte';
	import * as Sheet from '$lib/components/ui/sheet/index.js';
	import { cn } from '$lib/utils.js';
	import type { WorkflowNodeData } from '../shared/types';
	import { workflowDrawerTitle, workflowItemDescription } from '../shared/workflow-items';
	import { workflowDrawerContent } from './registry';

	let {
		open = $bindable(false),
		node = null
	}: {
		open?: boolean;
		node?: Node<WorkflowNodeData> | null;
	} = $props();

	const title = $derived(node ? workflowDrawerTitle(node.data.itemId) : '');
	const description = $derived(node ? workflowItemDescription(node.data.itemId) : '');
	const DrawerContent = $derived(node ? workflowDrawerContent(node.data.itemId) : null);
	const panelOpen = $derived(Boolean(open && node));

	$effect(() => {
		if (open && !node) {
			open = false;
		}
	});
</script>

<div class="relative h-full min-w-0 shrink-0">
	<div
		aria-hidden="true"
		class={cn(
			'h-full bg-transparent transition-[width] duration-200 ease-linear',
			panelOpen ? 'w-96' : 'w-0'
		)}
	></div>

	<div
		class={cn(
			'absolute inset-y-0 right-0 z-10 flex h-full w-96 flex-col overflow-hidden transition-[transform] duration-200 ease-linear',
			panelOpen ? 'translate-x-0' : 'pointer-events-none translate-x-full'
		)}
		aria-hidden={!panelOpen}
	>
		{#if node && DrawerContent}
			<div
				class="flex h-full w-full shrink-0 flex-col [&_[data-slot=sheet-overlay]]:pointer-events-none [&_[data-slot=sheet-overlay]]:hidden"
			>
				<Sheet.Root bind:open>
					<Sheet.Content
						side="right"
						portalProps={{ disabled: true }}
						trapFocus={false}
						preventScroll={false}
						preventOverflowTextSelection={false}
						interactOutsideBehavior="ignore"
						onFocusOutside={(e) => e.preventDefault()}
						onInteractOutside={(e) => e.preventDefault()}
						class="!relative inset-auto top-auto right-auto flex h-full !w-full w-full max-w-full shrink-0 translate-x-0 flex-col gap-0 overflow-hidden border-s shadow-none data-[side=right]:!w-full data-[side=right]:!max-w-full data-[state=closed]:animate-none data-[state=open]:animate-none"
					>
						<Sheet.Header>
							<Sheet.Title>{title}</Sheet.Title>
							{#if description}
								<Sheet.Description>{description}</Sheet.Description>
							{/if}
						</Sheet.Header>

						<div class="min-h-0 flex-1 space-y-6 overflow-y-auto px-6 py-2 pb-6">
							<DrawerContent nodeId={node.id} data={node.data} />
						</div>
					</Sheet.Content>
				</Sheet.Root>
			</div>
		{/if}
	</div>
</div>
