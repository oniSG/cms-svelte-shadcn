<script generics="TData" lang="ts">
	import type { Table } from '@tanstack/table-core';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { Button } from '$lib/components/ui/button';
	import Settings2Icon from '@lucide/svelte/icons/settings-2';
	import * as m from '$lib/paraglide/messages.js';

	let { table }: { table: Table<TData> } = $props();

	const columnTitles: Record<string, string> = {
		event: m.col_event(),
		label: m.col_label(),
		name: m.col_created_by(),
		time: m.col_created_at(),
		active: m.col_active()
	};
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger>
		{#snippet child({ props })}
			<Button {...props} variant="outline" size="sm" class="ml-auto">
				<Settings2Icon />
				{m.reply_email_view()}
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
