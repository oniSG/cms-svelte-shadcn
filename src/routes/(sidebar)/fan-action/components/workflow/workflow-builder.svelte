<script lang="ts">
	import { browser } from '$app/environment';
	import { SvelteFlowProvider, type Edge, type Node } from '@xyflow/svelte';
	import '@xyflow/svelte/dist/style.css';
	import WorkflowCanvas from './workflow-canvas.svelte';
	import WorkflowToolbar from './workflow-toolbar.svelte';
	import WorkflowPaletteSheet from './workflow-palette-sheet.svelte';
	import WorkflowNodeDrawerHost from './workflow-node-drawer-host.svelte';
	import { setWorkflowConfigureNode, setWorkflowEditingNode } from './workflow-context';
	import { createInitialFlow } from './workflow-data';
	import type { WorkflowNodeData } from './workflow-types';

	const initialFlow = createInitialFlow();

	let {
		nodes = $bindable(initialFlow.nodes),
		edges = $bindable(initialFlow.edges),
		scriptStopped = $bindable(true),
		testingStopped = $bindable(true)
	}: {
		nodes?: Node<WorkflowNodeData>[];
		edges?: Edge[];
		scriptStopped?: boolean;
		testingStopped?: boolean;
	} = $props();

	let drawerOpen = $state(false);
	let activeNodeId = $state<string | null>(null);
	const editingNode = $state<{ nodeId: string | null }>({ nodeId: null });
	const activeNode = $derived(nodes.find((node) => node.id === activeNodeId) ?? null);

	function handleSave() {
		scriptStopped = true;
		testingStopped = true;
	}

	function openNodeDrawer(nodeId: string) {
		activeNodeId = nodeId;
		drawerOpen = true;
	}

	setWorkflowConfigureNode(openNodeDrawer);
	setWorkflowEditingNode(editingNode);

	$effect(() => {
		editingNode.nodeId = drawerOpen ? activeNodeId : null;
	});
</script>

{#if browser}
	<SvelteFlowProvider>
		<div class="flex h-full min-w-0 w-full overflow-hidden">
			<WorkflowPaletteSheet />

			<div class="relative min-h-0 min-w-0 w-0 flex-1">
				<WorkflowCanvas bind:nodes bind:edges />

				<!-- 
				<div class="pointer-events-none absolute inset-0 z-20 p-3">
					<div
						class="pointer-events-auto absolute top-3 right-3 left-3 overflow-hidden rounded-xl border bg-background/95 shadow-lg backdrop-blur-sm supports-backdrop-filter:bg-background/80"
					>
						<WorkflowToolbar bind:scriptStopped bind:testingStopped onSave={handleSave} />
					</div>
				</div>
				-->
			</div>

			<WorkflowNodeDrawerHost bind:open={drawerOpen} node={activeNode} />
		</div>
	</SvelteFlowProvider>
{:else}
	<div class="relative h-full w-full bg-muted/20"></div>
{/if}
