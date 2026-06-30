<script lang="ts">
	import * as Sheet from '$lib/components/ui/sheet/index.js';
	import type { Node } from '@xyflow/svelte';
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
</script>

<Sheet.Root bind:open>
	<Sheet.Content side="right" class="w-full overflow-y-auto sm:max-w-2xl">
		{#if node && DrawerContent}
			<Sheet.Header>
				<Sheet.Title>{title}</Sheet.Title>
			</Sheet.Header>

			<div class="px-4 pb-6">
				<DrawerContent nodeId={node.id} data={node.data} />
			</div>
		{/if}
	</Sheet.Content>
</Sheet.Root>
