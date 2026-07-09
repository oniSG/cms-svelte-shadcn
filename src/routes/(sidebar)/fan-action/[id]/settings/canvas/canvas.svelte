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
	import FlowNode from './node.svelte';
	import FlowEdge from './edge.svelte';
	import ZoomControls from './zoom-controls.svelte';
	import FitViewOnResize from './fit-view-on-resize.svelte';
	import type { WorkflowNodeData, WorkflowPaletteItem } from '../shared/types';
	import { WORKFLOW_DRAG_MIME } from '../shared/types';
	import { getWorkflowRunning, WORKFLOW_EDITED_BY_OTHER } from '../shared/editing-context';
	import { cn } from '$lib/utils.js';
	import { mode } from 'mode-watcher';

	const nodeTypes = { workflow: FlowNode };
	const edgeTypes = { workflow: FlowEdge };

	const flowColorMode = $derived(mode.current === 'dark' ? 'dark' : 'light');
	const getRunning = getWorkflowRunning();
	const isRunning = $derived(getRunning?.() ?? false);

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
			id: `node-${crypto.randomUUID().slice(0, 8)}`,
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
		class={cn(
			'workflow-flow h-full w-full !bg-muted/20',
			isRunning && 'workflow-flow-running',
			WORKFLOW_EDITED_BY_OTHER && 'workflow-flow-locked'
		)}
		{nodeTypes}
		{edgeTypes}
		defaultEdgeOptions={{ type: 'workflow' }}
		fitView
		onconnect={onConnect}
	>
		<Background gap={16} size={1} variant={BackgroundVariant.Dots} />
		<ZoomControls />
		<FitViewOnResize />
	</SvelteFlow>
</div>
