<script lang="ts">
	import { afterNavigate } from '$app/navigation';
	import { browser } from '$app/environment';
	import { page } from '$app/state';
	import { SvelteFlowProvider, type Edge, type Node } from '@xyflow/svelte';
	import '@xyflow/svelte/dist/style.css';
	import Canvas from './canvas/canvas.svelte';
	import PaletteSheet from './palette-panel/palette-sheet.svelte';
	import NodeConfigPanel from './node-config/node-config-panel.svelte';
	import {
		getFanActionSaveHandlers,
		setWorkflowConfigureNode,
		setWorkflowEditingNodeId
	} from './shared/editing-context';
	import type { WorkflowNodeData } from './shared/types';
	import { data, saveFanActionWorkflow } from '../../temp/data.js';

	const actionId = $derived(Number(page.params.id));
	const action = $derived(data.find((item) => item.id === actionId) ?? null);

	let nodes = $state<Node<WorkflowNodeData>[]>([]);
	let edges = $state<Edge[]>([]);

	let drawerOpen = $state(false);
	let activeNodeId = $state<string | null>(null);
	const activeNode = $derived(nodes.find((node) => node.id === activeNodeId) ?? null);
	const editingNodeId = $derived(drawerOpen ? activeNodeId : null);
	const saveHandlers = getFanActionSaveHandlers();

	let loadedActionId = $state<number | null>(null);

	afterNavigate(() => {
		loadedActionId = null;
	});

	$effect(() => {
		const id = actionId;
		if (id === loadedActionId) return;

		loadedActionId = id;
		const source = data.find((item) => item.id === id);

		if (source) {
			nodes = structuredClone(source.workflow.nodes) as Node<WorkflowNodeData>[];
			edges = structuredClone(source.workflow.edges);
		} else {
			nodes = [];
			edges = [];
		}

		drawerOpen = false;
		activeNodeId = null;
	});

	function syncNodeConfig(nodeId: string, config: Record<string, unknown>) {
		const index = nodes.findIndex((node) => node.id === nodeId);
		if (index === -1) return;

		nodes[index] = {
			...nodes[index],
			data: {
				...nodes[index].data,
				config,
				incomplete: false
			}
		};
	}

	$effect(() => {
		const id = actionId;
		if (!saveHandlers || !id) return;

		saveHandlers.workflow = async () => {
			return saveFanActionWorkflow(id, {
				nodes: structuredClone($state.snapshot(nodes)) as (typeof data)[0]['workflow']['nodes'],
				edges: structuredClone($state.snapshot(edges)) as (typeof data)[0]['workflow']['edges']
			});
		};

		return () => {
			delete saveHandlers.workflow;
		};
	});

	function openNodeDrawer(nodeId: string) {
		if (drawerOpen && activeNodeId === nodeId) {
			drawerOpen = false;
			activeNodeId = null;
			return;
		}

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

			<NodeConfigPanel bind:open={drawerOpen} node={activeNode} {actionId} {syncNodeConfig} />
		</div>
	</SvelteFlowProvider>
{:else}
	<div class="relative h-full w-full bg-muted/20"></div>
{/if}
