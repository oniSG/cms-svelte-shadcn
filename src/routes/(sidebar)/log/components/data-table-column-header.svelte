<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import type { Column } from '@tanstack/table-core';
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils.js';
	import ArrowUpIcon from '@lucide/svelte/icons/arrow-up';
	import ArrowDownIcon from '@lucide/svelte/icons/arrow-down';
	import EyeOffIcon from '@lucide/svelte/icons/eye-off';
	import type { Log } from '../columns';
	import * as m from '$lib/paraglide/messages.js';
	import { ChevronsUpDownIcon } from '@lucide/svelte';

	let {
		column,
		title,
		// Optional `filter` snippet rendered as the FIRST entry in the dropdown
		// (above the sort items). The caller is expected to render a
		// <DropdownMenu.Sub> so the filter UI shows up as a nested sub-menu —
		// this keeps the column header dumb and lets each column choose its own
		// filter shape (checkbox list, calendar, etc.).
		filter,
		class: className,
		...restProps
	}: {
		column: Column<Log>;
		title: string;
		filter?: Snippet;
	} & HTMLAttributes<HTMLDivElement> = $props();
</script>

{#if !column?.getCanSort()}
	<div class={className} {...restProps}>
		{title}
	</div>
{:else}
	<div class={cn('flex items-center', className)} {...restProps}>
		<DropdownMenu.Root>
			<DropdownMenu.Trigger>
				{#snippet child({ props })}
					<Button
						{...props}
						variant="outline"
						size="sm"
						class="-ms-3 h-8 font-semibold data-[state=open]:bg-accent"
					>
						<span>
							{title}
						</span>
						{#if column.getIsSorted() === 'desc'}
							<ArrowDownIcon />
						{:else if column.getIsSorted() === 'asc'}
							<ArrowUpIcon />
						{:else}
							<ChevronsUpDownIcon class="text-muted-foreground/70" />
						{/if}
					</Button>
				{/snippet}
			</DropdownMenu.Trigger>
			<DropdownMenu.Content align="start">
				{#if filter}
					{@render filter()}
					<DropdownMenu.Separator />
				{/if}
				<DropdownMenu.Item onclick={() => column.toggleSorting(false)}>
					<ArrowUpIcon class="me-2 size-3.5 text-muted-foreground/70" />
					{m.log_action_sort_asc()}
				</DropdownMenu.Item>
				<DropdownMenu.Item onclick={() => column.toggleSorting(true)}>
					<ArrowDownIcon class="me-2 size-3.5 text-muted-foreground/70" />
					{m.log_action_sort_desc()}
				</DropdownMenu.Item>
				<DropdownMenu.Separator />
				<DropdownMenu.Item onclick={() => column.toggleVisibility(false)}>
					<EyeOffIcon class="me-2 size-3.5 text-muted-foreground/70" />
					{m.log_action_hide()}
				</DropdownMenu.Item>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	</div>
{/if}
