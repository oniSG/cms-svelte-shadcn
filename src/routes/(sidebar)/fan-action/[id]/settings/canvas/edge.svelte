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
	import type { Node } from '@xyflow/svelte';
	import type { WorkflowNodeData } from '../shared/types';

	const conditionBranchButtonClass = {
		yes: 'bg-success/10 text-success hover:bg-success/20 dark:bg-success/20 dark:hover:bg-success/30 border-success/25 dark:border-success/30',
		no: 'bg-destructive/10 text-destructive hover:bg-destructive/20 dark:bg-destructive/20 dark:hover:bg-destructive/30 border-destructive/25 dark:border-destructive/30'
	} as const;

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

	const branchStyle = $derived.by(() => {
		const sourceNode = getNode(source) as Node<WorkflowNodeData> | undefined;
		if (sourceNode?.data.variant !== 'condition') return null;

		if (sourceHandleId === 'yes') {
			return { stroke: 'var(--success)', button: conditionBranchButtonClass.yes };
		}
		if (sourceHandleId === 'no') {
			return { stroke: 'var(--destructive)', button: conditionBranchButtonClass.no };
		}
		return null;
	});

	const edgeStyle = $derived(
		[style, 'stroke-width: 1.5', branchStyle?.stroke ? `stroke: ${branchStyle.stroke}` : null]
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
		<Button variant="outline" size="sm" class={branchStyle?.button}>
			<UserIcon />
			225
		</Button>
		<Button variant="outline" size="icon-sm" aria-label="Delete connection" onclick={deleteEdge}>
			<X />
		</Button>
	</ButtonGroup.Root>
</EdgeLabel>
