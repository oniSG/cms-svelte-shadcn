<script lang="ts">
	import { browser } from '$app/environment';
	import { page } from '$app/state';
	import { SvelteFlowProvider, type Edge, type Node } from '@xyflow/svelte';
	import '@xyflow/svelte/dist/style.css';
	import Canvas from './canvas/canvas.svelte';
	import PaletteSheet from './palette-panel/palette-sheet.svelte';
	import NodeConfigPanel from './node-config/node-config-panel.svelte';
	import { setWorkflowConfigureNode, setWorkflowEditingNodeId } from './shared/editing-context';
	import type { WorkflowNodeData } from './shared/types';
	import { data } from '../../temp/data.js';

	const actionId = $derived(Number(page.params.id));
	const action = $derived(data.find((item) => item.id === actionId) ?? null);

	let nodes = $state<Node<WorkflowNodeData>[]>([]);
	let edges = $state<Edge[]>([]);

	let drawerOpen = $state(false);
	let activeNodeId = $state<string | null>(null);
	const activeNode = $derived(nodes.find((node) => node.id === activeNodeId) ?? null);
	const editingNodeId = $derived(drawerOpen ? activeNodeId : null);

	$effect(() => {
		if (action) {
			nodes = structuredClone(action.workflow.nodes) as Node<WorkflowNodeData>[];
			edges = structuredClone(action.workflow.edges);
		} else {
			nodes = [];
			edges = [];
		}
		drawerOpen = false;
		activeNodeId = null;
	});

	function openNodeDrawer(nodeId: string) {
		activeNodeId = nodeId;
		drawerOpen = true;
	}

	setWorkflowConfigureNode(openNodeDrawer);
	setWorkflowEditingNodeId(() => editingNodeId);
</script>

{#if browser}
	<SvelteFlowProvider>
		<div class="flex h-full w-full min-w-0 overflow-hidden">
			<PaletteSheet {action} />

			<div class="relative min-h-0 w-0 min-w-0 flex-1">
				{#key action?.id}
					<Canvas bind:nodes bind:edges />
				{/key}
			</div>

			<NodeConfigPanel bind:open={drawerOpen} node={activeNode} />
		</div>
	</SvelteFlowProvider>
{:else}
	<div class="relative h-full w-full bg-muted/20"></div>
{/if}
