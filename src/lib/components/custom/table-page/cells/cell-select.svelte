<script lang="ts">
	import Highlight from './highlight.svelte';

	let { value, options }: { value: unknown; options: Array<{ value: string; label: string }> } =
		$props();

	const label = $derived(options.find((o) => o.value === value)?.label ?? String(value ?? ''));
</script>

<span>
	<Highlight text={label} />
</span>
