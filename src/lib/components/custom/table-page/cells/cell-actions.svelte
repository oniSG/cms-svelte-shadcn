<script lang="ts">
	import { getContext } from 'svelte';
	import { Button } from '$lib/components/ui/button';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import EllipsisVerticalIcon from '@lucide/svelte/icons/ellipsis-vertical';
	import { ROW_ACTIONS_KEY, type RowActionsContext } from '../context';

	// eslint-disable-next-line svelte/no-unused-props
	let { row }: { value: unknown; row: unknown } = $props();

	const ctx = getContext<RowActionsContext | undefined>(ROW_ACTIONS_KEY);
	const actions = $derived(ctx?.get());
	const title = $derived(ctx?.title(row));

	function stop(e: MouseEvent) {
		e.stopPropagation();
	}
</script>

{#if actions}
	<div
		class="-my-2 flex justify-end"
		onclickcapture={stop}
		oncontextmenucapture={stop}
		role="presentation"
	>
		<DropdownMenu.Root>
			<DropdownMenu.Trigger>
				{#snippet child({ props })}
					<Button {...props} variant="ghost" size="icon" aria-label="Row actions">
						<EllipsisVerticalIcon />
					</Button>
				{/snippet}
			</DropdownMenu.Trigger>
			<DropdownMenu.Content align="end">
				{#if title}
					<DropdownMenu.Label class="text-muted-foreground">{title}</DropdownMenu.Label>
				{/if}
				{@render actions(row, { Item: DropdownMenu.Item, Separator: DropdownMenu.Separator })}
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	</div>
{/if}
