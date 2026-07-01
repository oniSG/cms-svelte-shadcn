<script lang="ts">
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import * as Tooltip from '$lib/components/ui/tooltip/index.js';
	import * as ButtonGroup from '$lib/components/ui/button-group/index.js';
	import { Button } from '$lib/components/ui/button';
	import XIcon from '@lucide/svelte/icons/x';
	import Trash2Icon from '@lucide/svelte/icons/trash-2';
	import { localeState } from '$lib/i18n.svelte';
	import * as m from '$lib/paraglide/messages.js';
	import Pagination from './pagination.svelte';
	import type { SelectionAction } from './types';

	let {
		page,
		total,
		totalPages,
		limit,
		pageSizes,
		loading,
		isInfinite,
		onGotoPage,
		onNext,
		onPrev,
		onLimitChange,
		selectionCount = 0,
		selectionIds = [],
		selectionActions = [],
		onDeleteSelected,
		onClearSelection
	}: {
		page: number;
		total: number;
		totalPages: number;
		limit: number;
		pageSizes: number[];
		loading: boolean;
		isInfinite: boolean;
		onGotoPage: (page: number) => void;
		onNext: () => void;
		onPrev: () => void;
		onLimitChange: (limit: number) => void;
		selectionCount?: number;
		selectionIds?: string[];
		selectionActions?: SelectionAction[];
		onDeleteSelected?: (ids: string[]) => void;
		onClearSelection?: () => void;
	} = $props();

	const showCount = $derived(!(loading && total === 0));
	const hasActions = $derived(selectionActions.length > 0 || !!onDeleteSelected);
</script>

<div class="flex h-12 shrink-0 items-center border-t border-border bg-background px-2">
	<div class="flex flex-1 items-center justify-start">
		{#if !isInfinite}
			<Pagination {page} {total} {totalPages} {loading} {onGotoPage} {onNext} {onPrev} />
		{/if}
	</div>

	<div class="flex flex-1 items-center justify-center gap-2">
		{#if showCount}
			<span class="text-sm text-muted-foreground tabular-nums">
				{m.tp_total_records({ total: total.toLocaleString(localeState.current) })}
				{#if selectionCount > 0}
					<span class="text-foreground"> / {m.tp_selected({ count: selectionCount })}</span>
				{/if}
			</span>
		{/if}

		{#if selectionCount > 0 && hasActions}
			<ButtonGroup.Root>
				{#each selectionActions as action (action.label)}
					<Button variant="outline" size="sm" onclick={() => action.onClick(selectionIds)}>
						{#if action.icon}
							<action.icon />
						{/if}
						{action.label}
					</Button>
				{/each}
				{#if onDeleteSelected}
					<Button
						variant="outline"
						size="sm"
						class="text-destructive hover:text-destructive"
						onclick={() => onDeleteSelected(selectionIds)}
					>
						<Trash2Icon />
						{m.tp_delete()}
					</Button>
				{/if}
			</ButtonGroup.Root>
		{/if}

		{#if selectionCount > 0 && onClearSelection}
			<Button
				variant="outline"
				size="icon-sm"
				aria-label={m.tp_clear_selection()}
				onclick={onClearSelection}
			>
				<XIcon />
			</Button>
		{/if}
	</div>

	<div class="flex flex-1 items-center justify-end gap-2 text-sm">
		<span class="text-muted-foreground">{m.tp_rows_per_page()}</span>
		<DropdownMenu.Root>
			<DropdownMenu.Trigger>
				{#snippet child({ props })}
					<Button {...props} variant="outline" size="sm" class="tabular-nums">
						{Number.isFinite(limit) ? limit : m.tp_all()}
					</Button>
				{/snippet}
			</DropdownMenu.Trigger>
			<DropdownMenu.Content align="end" class="w-56">
				{#each pageSizes as size (size)}
					{#if Number.isFinite(size)}
						<DropdownMenu.CheckboxItem
							onSelect={() => onLimitChange(size)}
							checked={limit === size}
						>
							{size}
						</DropdownMenu.CheckboxItem>
					{:else}
						<Tooltip.Root>
							<Tooltip.Trigger>
								{#snippet child({ props })}
									<div {...props}>
										<DropdownMenu.CheckboxItem
											onSelect={() => onLimitChange(size)}
											checked={!Number.isFinite(limit)}
											class="flex items-center justify-between"
										>
											<span>{m.tp_infinite_scroll()}</span>
										</DropdownMenu.CheckboxItem>
									</div>
								{/snippet}
							</Tooltip.Trigger>
						</Tooltip.Root>
					{/if}
				{/each}
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	</div>
</div>
