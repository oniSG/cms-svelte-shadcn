<script lang="ts">
	import { browser } from '$app/environment';
	import { SvelteFlowProvider, type Edge, type Node } from '@xyflow/svelte';
	import '@xyflow/svelte/dist/style.css';
	import WorkflowCanvas from './workflow-canvas.svelte';
	import WorkflowPaletteSheet from './workflow-palette-sheet.svelte';
	import WorkflowNodeDrawerHost from './workflow-node-drawer-host.svelte';
	import { setWorkflowConfigureNode, setWorkflowEditingNode } from './workflow-context';
	import { createInitialFlow } from './workflow-data';
	import type { WorkflowNodeData } from './workflow-types';
	import type { FanAction } from '$lib/types/fan-action.js';

	const initialFlow = createInitialFlow();

	let {
		action = null,
		nodes = $bindable(initialFlow.nodes),
		edges = $bindable(initialFlow.edges)
	}: {
		action?: FanAction | null;
		nodes?: Node<WorkflowNodeData>[];
		edges?: Edge[];
	} = $props();

	let drawerOpen = $state(false);
	let activeNodeId = $state<string | null>(null);
	let runFitView: (() => void) | null = null;
	const editingNode = $state<{ nodeId: string | null }>({ nodeId: null });
	const activeNode = $derived(nodes.find((node) => node.id === activeNodeId) ?? null);

	function openNodeDrawer(nodeId: string) {
		activeNodeId = nodeId;
		drawerOpen = true;
	}

	setWorkflowConfigureNode(openNodeDrawer);
	setWorkflowEditingNode(editingNode);

	function handleFitViewReady(fitView: () => void) {
		runFitView = fitView;
	}

	let skipInitialDrawerFit = true;

	$effect(() => {
		void drawerOpen;

		if (skipInitialDrawerFit) {
			skipInitialDrawerFit = false;
			return;
		}

		if (!runFitView) return;

		const timeout = setTimeout(() => {
			runFitView?.();
		}, 0);

		return () => clearTimeout(timeout);
	});

	$effect(() => {
		editingNode.nodeId = drawerOpen ? activeNodeId : null;
	});
</script>

{#if browser}
	<SvelteFlowProvider>
		<div class="flex h-full w-full min-w-0 overflow-hidden">
			<WorkflowPaletteSheet {action} />

			<div class="relative min-h-0 w-0 min-w-0 flex-1">
				<WorkflowCanvas bind:nodes bind:edges onFitViewReady={handleFitViewReady} />
			</div>

			<WorkflowNodeDrawerHost bind:open={drawerOpen} node={activeNode} />
		</div>
	</SvelteFlowProvider>
{:else}
	<div class="relative h-full w-full bg-muted/20"></div>
{/if}
