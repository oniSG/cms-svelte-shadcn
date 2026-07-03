<script lang="ts">
	import {
		SvelteFlow,
		Background,
		BackgroundVariant,
		addEdge,
		useSvelteFlow,
		type Connection,
		type Edge,
		type Node
	} from '@xyflow/svelte';
	import WorkflowNode from './workflow-node.svelte';
	import WorkflowEdge from './workflow-edge.svelte';
	import WorkflowZoomControls from './workflow-zoom-controls.svelte';
	import WorkflowDrawerFitView from './workflow-drawer-fit-view.svelte';
	import { createNodeId } from './workflow-data';
	import type { WorkflowNodeData, WorkflowPaletteItem } from './workflow-types';
	import { WORKFLOW_DRAG_MIME } from './workflow-types';
	import { mode } from 'mode-watcher';

	const nodeTypes = { workflow: WorkflowNode };
	const edgeTypes = { workflow: WorkflowEdge };

	const flowColorMode = $derived(mode.current === 'dark' ? 'dark' : 'light');

	let {
		nodes = $bindable(),
		edges = $bindable()
	}: {
		nodes: Node<WorkflowNodeData>[];
		edges: Edge[];
	} = $props();

	const { screenToFlowPosition } = useSvelteFlow();

	function onConnect(connection: Connection) {
		edges = addEdge({ ...connection, type: 'workflow' }, edges);
	}

	function onDragOver(event: DragEvent) {
		event.preventDefault();
		if (event.dataTransfer) {
			event.dataTransfer.dropEffect = 'move';
		}
	}

	function onDrop(event: DragEvent) {
		event.preventDefault();
		const payload = event.dataTransfer?.getData(WORKFLOW_DRAG_MIME);
		if (!payload) return;

		const item = JSON.parse(payload) as WorkflowPaletteItem;
		const position = screenToFlowPosition({ x: event.clientX, y: event.clientY });

		const newNode: Node<WorkflowNodeData> = {
			id: createNodeId(),
			type: 'workflow',
			position,
			data: {
				itemId: item.id,
				variant: item.variant,
				incomplete: item.incomplete ?? item.variant !== 'trigger'
			}
		};

		nodes = [...nodes, newNode];
	}
</script>

<div
	class="workflow-flow-canvas h-full min-h-0 w-full"
	ondragover={onDragOver}
	ondrop={onDrop}
	role="presentation"
>
	<SvelteFlow
		bind:nodes
		bind:edges
		colorMode={flowColorMode}
		class="workflow-flow h-full w-full !bg-muted/20"
		{nodeTypes}
		{edgeTypes}
		defaultEdgeOptions={{ type: 'workflow' }}
		fitView
		onconnect={onConnect}
	>
		<Background gap={16} size={1} variant={BackgroundVariant.Dots} />
		<WorkflowZoomControls />
		<WorkflowDrawerFitView />
	</SvelteFlow>
</div>

<style>
	:global(.workflow-flow .workflow-node-label) {
		z-index: 0;
	}

	:global(.workflow-flow .workflow-edge-label) {
		z-index: 10;
	}
</style>
