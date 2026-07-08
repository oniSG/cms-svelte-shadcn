<script lang="ts">
	import TriggerEdgePath from '../../triggers/edge/edge.svelte';

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

<TriggerEdgePath {id} {path} {markerEnd} {markerStart} {style} />
