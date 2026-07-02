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
	import UserIcon from '@lucide/svelte/icons/user';
	import * as m from '$lib/paraglide/messages.js';
	import { Button } from '$lib/components/ui/button';
	import * as ButtonGroup from '$lib/components/ui/button-group';
	import { cn } from '$lib/utils.js';

	const workflowEdgeStrokeWidth = 1.5;

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

	const conditionBranch = $derived.by((): 'yes' | 'no' | null => {
		const sourceNode = getNode(source) as Node<WorkflowNodeData> | undefined;
		if (sourceNode?.data.variant !== 'condition') return null;

		if (sourceHandleId === 'yes') return 'yes';
		if (sourceHandleId === 'no') return 'no';
		return null;
	});

	const conditionBranchLabel = $derived(
		conditionBranch === 'yes'
			? m.fan_action_flow_edge_yes()
			: conditionBranch === 'no'
				? m.fan_action_flow_edge_no()
				: null
	);

	const conditionBranchButtonClass = $derived(
		conditionBranch === 'yes'
			? 'bg-success/10 text-success hover:bg-success/20 dark:bg-success/20 dark:hover:bg-success/30 border-success/25 dark:border-success/30'
			: conditionBranch === 'no'
				? 'bg-destructive/10 text-destructive hover:bg-destructive/20 dark:bg-destructive/20 dark:hover:bg-destructive/30 border-destructive/25 dark:border-destructive/30'
				: undefined
	);

	const edgeStyle = $derived(
		[
			style,
			`stroke-width: ${workflowEdgeStrokeWidth}`,
			conditionBranch === 'yes'
				? 'stroke: var(--success)'
				: conditionBranch === 'no'
					? 'stroke: var(--destructive)'
					: null
		]
			.filter(Boolean)
			.join('; ')
	);

	function deleteEdge(event: MouseEvent) {
		event.stopPropagation();
		if (!id) return;
		deleteElements({ edges: [{ id }] });
	}
</script>

<BaseEdge {id} {path} {markerEnd} {markerStart} style={edgeStyle} />

<EdgeLabel x={labelX} y={labelY} transparent class="workflow-edge-label relative z-10 !p-0">
	<ButtonGroup.Root class="overflow-hidden rounded-4xl bg-workflow-canvas-base">
		<!--
		{#if conditionBranchLabel}
			<Button variant="outline" size="sm" class={cn(conditionBranchButtonClass)}>
				{conditionBranchLabel}
			</Button>
		{/if}
		-->
		<Button variant="outline" size="sm" class={conditionBranchButtonClass}>
			<UserIcon />
			225
		</Button>
		<Button variant="outline" size="icon-sm" aria-label="Delete connection" onclick={deleteEdge}>
			<X />
		</Button>
	</ButtonGroup.Root>
</EdgeLabel>
