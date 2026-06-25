<script lang="ts">
	import { localeState } from '$lib/i18n.svelte.js';

	let { value }: { value: Date } = $props();

	const formatter = $derived(
		new Intl.DateTimeFormat(localeState.current, {
			dateStyle: 'medium',
			timeStyle: 'short'
		})
	);
</script>

<span class="tabular-nums">{formatter.format(value)}</span>
