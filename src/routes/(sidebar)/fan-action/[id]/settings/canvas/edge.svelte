<script lang="ts">
	import { getBezierPath, useSvelteFlow, type EdgeProps } from '@xyflow/svelte';
	import { workflowConditionBranchStyle } from '../shared/condition-branch-styles';
	import OperatorEdge from './operators/edge/edge.svelte';
	import ActionEdge from './actions/edge/edge.svelte';
	import { buildWorkflowEdgeStyle, getWorkflowConditionBranch } from './operators/edge/edge-utils';

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

	const conditionBranch = $derived.by(() =>
		getWorkflowConditionBranch(source, sourceHandleId, getNode)
	);

	const branchStyle = $derived(workflowConditionBranchStyle(conditionBranch));

	const edgeStyle = $derived(buildWorkflowEdgeStyle(style, branchStyle?.stroke));

	function deleteEdge(event: MouseEvent) {
		event.stopPropagation();
		if (!id) return;
		deleteElements({ edges: [{ id }] });
	}
</script>

<OperatorEdge {id} {path} {markerEnd} {markerStart} style={edgeStyle} />

<ActionEdge {labelX} {labelY} {branchStyle} onDelete={deleteEdge} />
