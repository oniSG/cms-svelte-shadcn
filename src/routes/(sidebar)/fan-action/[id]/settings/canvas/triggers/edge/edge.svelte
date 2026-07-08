<script lang="ts">
	import { BaseEdge } from '@xyflow/svelte';

	let {
		id,
		path,
		markerEnd,
		markerStart,
		style
	}: {
		id?: string;
		path: string;
		markerEnd?: string;
		markerStart?: string;
		style?: string;
	} = $props();
</script>

<BaseEdge {id} {path} {markerEnd} {markerStart} {style} />
