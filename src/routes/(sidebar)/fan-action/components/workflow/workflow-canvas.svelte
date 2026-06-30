<script lang="ts">
	import {
		SvelteFlow,
		Background,
		BackgroundVariant,
		Controls,
		addEdge,
		useSvelteFlow,
		type Connection,
		type Edge,
		type Node
	} from '@xyflow/svelte';
	import WorkflowNode from './workflow-node.svelte';
	import { createNodeId } from './workflow-data';
	import type { WorkflowNodeData, WorkflowPaletteItem } from './workflow-types';
	import { WORKFLOW_DRAG_MIME } from './workflow-types';

	const nodeTypes = { workflow: WorkflowNode };

	let {
		nodes = $bindable(),
		edges = $bindable()
	}: {
		nodes: Node<WorkflowNodeData>[];
		edges: Edge[];
	} = $props();

	const { screenToFlowPosition } = useSvelteFlow();

	function onConnect(connection: Connection) {
		edges = addEdge({ ...connection, type: 'smoothstep' }, edges);
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
	class="absolute inset-0 h-full w-full"
	ondragover={onDragOver}
	ondrop={onDrop}
	role="presentation"
>
	<SvelteFlow
		bind:nodes
		bind:edges
		class="h-full w-full !bg-muted/20"
		{nodeTypes}
		defaultEdgeOptions={{ type: 'smoothstep' }}
		fitView
		onconnect={onConnect}
	>
		<Background gap={16} size={1} variant={BackgroundVariant.Dots} />
		<Controls showLock={false} />
	</SvelteFlow>
</div>

<style>
	:global(.svelte-flow__controls) {
		box-shadow: none;
	}

	:global(.svelte-flow__controls-button) {
		border: 1px solid hsl(var(--border));
		background: hsl(var(--background));
	}
</style>
