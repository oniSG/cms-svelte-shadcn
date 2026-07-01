<script lang="ts">
	import { Input } from '$lib/components/ui/input/index.js';
	import FilterShell from './filter-shell.svelte';
	import * as m from '$lib/paraglide/messages.js';
	import type { Filter, TextFilter } from './fields.js';
	import type { QueryFieldDef } from '../types';

	let {
		filter,
		fields,
		onChange,
		onDelete
	}: {
		filter: TextFilter;
		fields: QueryFieldDef[];
		onChange: (next: Filter) => void;
		onDelete: () => void;
	} = $props();
</script>

<FilterShell {filter} {fields} {onChange} {onDelete}>
	<Input
		value={filter.value}
		placeholder={m.qb_value_placeholder()}
		oninput={(e) => onChange({ ...filter, value: e.currentTarget.value })}
		class="w-full border border-border bg-background text-foreground placeholder:text-muted-foreground"
	/>
</FilterShell>
