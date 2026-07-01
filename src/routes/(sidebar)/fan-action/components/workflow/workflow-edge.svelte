<script lang="ts">
	import {
		BaseEdge,
		EdgeLabel,
		getBezierPath,
		useSvelteFlow,
		type EdgeProps,
		type Node
	} from '@xyflow/svelte';
	import type { WorkflowNodeData } from './workflow-types';
	import X from '@lucide/svelte/icons/x';
	import * as m from '$lib/paraglide/messages.js';

	let {
		id,
		source,
		sourceX,
		sourceY,
		targetX,
		targetY,
		sourcePosition,
		targetPosition,
		sourceHandleId,
		markerEnd,
		markerStart,
		style
	}: EdgeProps = $props();

	const { deleteElements, getNode } = useSvelteFlow();

	const [path, labelX, labelY] = $derived(
		getBezierPath({
			sourceX,
			sourceY,
			targetX,
			targetY,
			sourcePosition,
			targetPosition
		})
	);

	const conditionBranchLabel = $derived.by(() => {
		const sourceNode = getNode(source) as Node<WorkflowNodeData> | undefined;
		if (sourceNode?.data.variant !== 'condition') return null;

		if (sourceHandleId === 'yes') return m.fan_action_flow_edge_yes();
		if (sourceHandleId === 'no') return m.fan_action_flow_edge_no();
		return null;
	});

	function deleteEdge(event: MouseEvent) {
		event.stopPropagation();
		if (!id) return;
		deleteElements({ edges: [{ id }] });
	}
</script>

<BaseEdge {id} {path} {markerEnd} {markerStart} {style} />

<EdgeLabel x={labelX} y={labelY}>
	<div class="flex flex-col items-center gap-1">
		{#if conditionBranchLabel}
			<span class="text-xs text-muted-foreground">{conditionBranchLabel}</span>
		{/if}
		<button
			type="button"
			class="nodrag nopan flex size-5 cursor-pointer items-center justify-center rounded-full border border-border bg-background text-muted-foreground shadow-sm hover:bg-muted"
			aria-label="Delete connection"
			onclick={deleteEdge}
		>
			<X class="size-3" />
		</button>
	</div>
</EdgeLabel>
