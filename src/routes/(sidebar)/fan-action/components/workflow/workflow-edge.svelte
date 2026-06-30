<script lang="ts">
	import {
		BaseEdge,
		EdgeLabel,
		getSmoothStepPath,
		useSvelteFlow,
		type EdgeProps
	} from '@xyflow/svelte';
	import X from '@lucide/svelte/icons/x';

	let {
		id,
		sourceX,
		sourceY,
		targetX,
		targetY,
		sourcePosition,
		targetPosition,
		markerEnd,
		markerStart,
		style
	}: EdgeProps = $props();

	const { deleteElements } = useSvelteFlow();

	const [path, labelX, labelY] = $derived(
		getSmoothStepPath({
			sourceX,
			sourceY,
			targetX,
			targetY,
			sourcePosition,
			targetPosition
		})
	);

	function deleteEdge(event: MouseEvent) {
		event.stopPropagation();
		if (!id) return;
		deleteElements({ edges: [{ id }] });
	}
</script>

<BaseEdge {id} {path} {markerEnd} {markerStart} {style} />

<EdgeLabel x={labelX} y={labelY}>
	<button
		type="button"
		class="nodrag nopan flex size-5 cursor-pointer items-center justify-center rounded-full border border-border bg-background text-muted-foreground shadow-sm hover:bg-muted"
		aria-label="Delete connection"
		onclick={deleteEdge}
	>
		<X class="size-3" />
	</button>
</EdgeLabel>
