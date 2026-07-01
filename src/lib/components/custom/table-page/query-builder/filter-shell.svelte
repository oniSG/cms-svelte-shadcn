<script lang="ts">
	import type { Snippet } from 'svelte';
	import * as Select from '$lib/components/ui/select/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import XIcon from '@lucide/svelte/icons/x';
	import { createFilter, getField, operators, type Filter } from './fields.js';
	import * as m from '$lib/paraglide/messages.js';
	import type { QueryFieldDef } from '../types';

	let {
		filter,
		fields,
		onChange,
		onDelete,
		children
	}: {
		filter: Filter;
		fields: QueryFieldDef[];
		onChange: (next: Filter) => void;
		onDelete: () => void;
		children: Snippet;
	} = $props();

	function changeField(v: string) {
		const def = getField(fields, v);
		if (!def) return;
		if (def.type === filter.type) {
			onChange({ ...filter, field: v } as Filter);
		} else {
			onChange(createFilter(def, filter.id));
		}
	}

	function changeOperator(v: string) {
		onChange({ ...filter, operator: v } as Filter);
	}

	const fieldLabel = $derived(getField(fields, filter.field)?.label ?? '');
	const ops = $derived(operators[filter.type]);
	const operatorLabel = $derived(ops.find((o) => o.value === filter.operator)?.label() ?? '');
</script>

<div class="flex items-center gap-2">
	<Select.Root type="single" value={filter.field} onValueChange={changeField}>
		<Select.Trigger class="w-42 border border-border bg-background">{fieldLabel}</Select.Trigger>
		<Select.Content>
			<Select.Group>
				<Select.Label>{m.qb_fields()}</Select.Label>
				{#each fields as f (f.value)}
					<Select.Item value={f.value} label={f.label}>{f.label}</Select.Item>
				{/each}
			</Select.Group>
		</Select.Content>
	</Select.Root>

	<Select.Root type="single" value={filter.operator} onValueChange={changeOperator}>
		<Select.Trigger class="w-42 border border-border bg-background">{operatorLabel}</Select.Trigger>
		<Select.Content>
			<Select.Group>
				<Select.Label>{m.qb_operators()}</Select.Label>
				{#each ops as o (o.value)}
					<Select.Item value={o.value} label={o.label()}>{o.label()}</Select.Item>
				{/each}
			</Select.Group>
		</Select.Content>
	</Select.Root>

	<div class="min-w-0 flex-1">
		{@render children()}
	</div>

	<Button variant="outline" size="icon-sm" onclick={onDelete} aria-label={m.qb_remove_filter()}>
		<XIcon />
	</Button>
</div>
