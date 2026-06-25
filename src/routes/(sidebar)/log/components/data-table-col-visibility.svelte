<script lang="ts" generics="TData">
	import type { Table } from '@tanstack/table-core';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { Button } from '$lib/components/ui/button';
	import Settings2Icon from '@lucide/svelte/icons/settings-2';
	import * as m from '$lib/paraglide/messages.js';

	type Props = {
		table: Table<TData>;
		labelFor?: (id: string) => string;
	};

	let { table, labelFor = (id: string) => id }: Props = $props();
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger>
		{#snippet child({ props })}
			<Button {...props} variant="outline" size="sm" class="ml-auto">
				<Settings2Icon />
				{m.log_action_view()}
			</Button>
		{/snippet}
	</DropdownMenu.Trigger>
	<DropdownMenu.Content align="end">
		{#each table.getAllColumns().filter((col) => col.getCanHide()) as column (column.id)}
			<DropdownMenu.CheckboxItem
				closeOnSelect={false}
				bind:checked={() => column.getIsVisible(), (v) => column.toggleVisibility(!!v)}
			>
				{labelFor(column.id)}
			</DropdownMenu.CheckboxItem>
		{/each}
	</DropdownMenu.Content>
</DropdownMenu.Root>
