<script lang="ts">
	let { value, options }: { value: unknown; options: Array<{ value: string; label: string }> } =
		$props();

	const label = $derived(options.find((o) => o.value === value)?.label ?? String(value ?? ''));
</script>

<span>{label}</span>
