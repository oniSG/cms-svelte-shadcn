<script lang="ts">
	import * as Select from '$lib/components/ui/select/index.js';
	import FilterShell from './filter-shell.svelte';
	import type { BoolFilter, Filter } from './fields.js';
	import type { QueryFieldDef } from '../types';

	let {
		filter,
		fields,
		onChange,
		onDelete
	}: {
		filter: BoolFilter;
		fields: QueryFieldDef[];
		onChange: (next: Filter) => void;
		onDelete: () => void;
	} = $props();
</script>

<FilterShell {filter} {fields} {onChange} {onDelete}>
	<Select.Root
		type="single"
		value={String(filter.value)}
		onValueChange={(v) => onChange({ ...filter, value: v === 'true' })}
	>
		<Select.Trigger class="w-full border border-border bg-background">
			{filter.value ? 'true' : 'false'}
		</Select.Trigger>
		<Select.Content>
			<Select.Item value="true" label="true">true</Select.Item>
			<Select.Item value="false" label="false">false</Select.Item>
		</Select.Content>
	</Select.Root>
</FilterShell>
