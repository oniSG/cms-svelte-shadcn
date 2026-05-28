<script generics="TData" lang="ts">
	import type { Table } from '@tanstack/table-core';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { Button } from '$lib/components/ui/button';
	import Settings2Icon from '@lucide/svelte/icons/settings-2';

	let { table }: { table: Table<TData> } = $props();

	const columnTitles: Record<string, string> = {
		event: 'Název',
		label: 'Štítky',
		name: 'Vytvořil/a',
		time: 'Datum vytvoření',
		active: 'Aktivní'
	};
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger>
		{#snippet child({ props })}
			<Button {...props} variant="outline" size="sm" class="ml-auto">
				<Settings2Icon />
				Zobrazení
			</Button>
		{/snippet}
	</DropdownMenu.Trigger>
	<DropdownMenu.Content align="end">
		{#each table.getAllColumns().filter((col) => col.getCanHide()) as column (column.id)}
			<DropdownMenu.CheckboxItem
				closeOnSelect={false}
				bind:checked={() => column.getIsVisible(), (v) => column.toggleVisibility(!!v)}
			>
				{columnTitles[column.id] ?? column.id}
			</DropdownMenu.CheckboxItem>
		{/each}
	</DropdownMenu.Content>
</DropdownMenu.Root>