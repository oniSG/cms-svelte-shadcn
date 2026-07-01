<script lang="ts">
	import { Badge } from '$lib/components/ui/badge';

	let { value }: { value: unknown } = $props();

	const label = $derived(value == null || value === '' ? '' : String(value));
</script>

{#if label}
	<Badge variant="outline" class="font-medium uppercase">{label}</Badge>
{/if}
