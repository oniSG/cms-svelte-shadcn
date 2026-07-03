<script lang="ts">
	import type { Node } from '@xyflow/svelte';
	import * as Sheet from '$lib/components/ui/sheet/index.js';
	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
	import { cn } from '$lib/utils.js';
	import type { WorkflowNodeData } from './types';
	import { workflowItemDescription, workflowItemLabel } from './item-labels';
	import { workflowDrawerContent } from './drawers/registry';
	import * as m from '$lib/paraglide/messages.js';

	let {
		open = $bindable(false),
		node = null
	}: {
		open?: boolean;
		node?: Node<WorkflowNodeData> | null;
	} = $props();

	const title = $derived(node ? workflowItemLabel(node.data.itemId) : '');
	const description = $derived(node ? workflowItemDescription(node.data.itemId) : '');
	const DrawerContent = $derived(node ? workflowDrawerContent(node.data.itemId) : null);

	function handleSave() {
		// placeholder until node config is wired to persistence
		open = false;
	}
</script>

<div class="relative h-full min-w-0 shrink-0">
	<div
		aria-hidden="true"
		class={cn(
			'h-full bg-transparent transition-[width] duration-200 ease-linear',
			open ? 'w-96' : 'w-0'
		)}
	></div>

	<div
		class={cn(
			'absolute inset-y-0 right-0 z-10 flex h-full w-96 flex-col overflow-hidden transition-[transform] duration-200 ease-linear',
			open ? 'translate-x-0' : 'pointer-events-none translate-x-full'
		)}
		aria-hidden={!open}
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

						<div class="min-h-0 flex-1 space-y-6 overflow-y-auto px-6 py-2">
							<DrawerContent nodeId={node.id} data={node.data} />
						</div>

						<Sheet.Footer class="flex-row justify-end">
							<Sheet.Close type="button" class={buttonVariants({ variant: 'outline' })}>
								{m.common_cancel()}
							</Sheet.Close>
							<Button type="button" onclick={handleSave}>{m.save()}</Button>
						</Sheet.Footer>
					</Sheet.Content>
				</Sheet.Root>
			</div>
		{/if}
	</div>
</div>
