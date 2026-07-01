<script lang="ts">
	import { localeState } from '$lib/i18n.svelte.js';

	let { value }: { value: unknown } = $props();

	const date = $derived(value instanceof Date ? value : value ? new Date(value as string) : null);
	const formatter = $derived(
		new Intl.DateTimeFormat(localeState.current, { dateStyle: 'medium', timeStyle: 'short' })
	);
</script>

<span class="tabular-nums">{date ? formatter.format(date) : ''}</span>
