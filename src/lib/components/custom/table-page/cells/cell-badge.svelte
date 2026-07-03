<script lang="ts">
	import { Badge } from '$lib/components/ui/badge';
	import Highlight from './highlight.svelte';

	let { value }: { value: unknown } = $props();

	const label = $derived(value == null || value === '' ? '' : String(value));
</script>

{#if label}
	<Badge variant="outline" class="font-medium uppercase">
		<Highlight text={label} />
	</Badge>
{/if}
