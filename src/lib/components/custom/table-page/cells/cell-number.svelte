<script lang="ts">
	import { localeState } from '$lib/i18n.svelte.js';

	let { value }: { value: unknown } = $props();

	const formatted = $derived(
		value == null || value === '' ? '' : Number(value).toLocaleString(localeState.current)
	);
</script>

<span class="block text-right tabular-nums">{formatted}</span>
