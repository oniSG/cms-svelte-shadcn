<script lang="ts">
	import {
		BaseEdge,
		EdgeLabel,
		getBezierPath,
		useSvelteFlow,
		type EdgeProps
	} from '@xyflow/svelte';
	import X from '@lucide/svelte/icons/x';
	import UserIcon from '@lucide/svelte/icons/user';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as ButtonGroup from '$lib/components/ui/button-group/index.js';
	import { workflowConditionBranchStyle } from '../shared/condition-branch-styles';
	import { buildWorkflowEdgeStyle, getWorkflowConditionBranch } from './edge-utils';

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

<BaseEdge {id} {path} {markerEnd} {markerStart} style={edgeStyle} />

<EdgeLabel x={labelX} y={labelY} transparent class="workflow-edge-label relative z-10 !p-0">
	<ButtonGroup.Root class="overflow-hidden rounded-4xl bg-workflow-canvas-base">
		<Button variant="outline" size="sm" class={branchStyle?.button}>
			<UserIcon />
			225
		</Button>
		<Button variant="outline" size="icon-sm" aria-label="Delete connection" onclick={deleteEdge}>
			<X />
		</Button>
	</ButtonGroup.Root>
</EdgeLabel>
