<script lang="ts">
	import { Input } from '$lib/components/ui/input/index.js';
	import FilterShell from './filter-shell.svelte';
	import type { Filter, NumberFilter } from './fields.js';
	import type { QueryFieldDef } from '../types';

	let {
		filter,
		fields,
		onChange,
		onDelete
	}: {
		filter: NumberFilter;
		fields: QueryFieldDef[];
		onChange: (next: Filter) => void;
		onDelete: () => void;
	} = $props();

	function onInput(e: Event & { currentTarget: HTMLInputElement }) {
		const raw = e.currentTarget.value;
		onChange({ ...filter, value: raw === '' ? null : Number(raw) });
	}
</script>

<FilterShell {filter} {fields} {onChange} {onDelete}>
	<Input
		type="number"
		value={filter.value ?? ''}
		placeholder="Value"
		oninput={onInput}
		class="w-full border border-border bg-background text-foreground placeholder:text-muted-foreground"
	/>
</FilterShell>
