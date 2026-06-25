<!--
  data-table-pagination.svelte — snapshot+offset pagination footer.

  Layout (left → center → right):
    [ ‹ | 1/12 | › ]      (40 objektů) · ⟳ 14:23      Rows per page [ 25 ▾ ]

  LEFT is a single segmented control built with ButtonGroup: the prev
  button, the editable "page / total" pill, and the next button share
  borders and round corners as one unit. Styled to match the toolbar
  filter buttons above the table (same ButtonGroup pattern, outline
  variant, sm size).

  CENTER is the row count + snapshot/refresh — no "Stránka X z Y"
  prefix because the segmented control already conveys that.

  Load-stage behaviour:
    • While the very first fetch is in flight (total === 0 && loading),
      render a Skeleton in place of the segmented control. We don't yet
      know totalPages, so showing "< 1 / 1 >" with disabled buttons would
      be misleading.
    • When totalPages <= 1 (single page of results), hide the segmented
      control entirely — pagination has no meaning. The row count and
      page-size dropdown stay.

  Style contract:
    • All buttons:        variant="outline" or "ghost", size="sm" (h-8).
    • All label text:     text-sm text-muted-foreground.
    • All numeric text:   tabular-nums.
    • Icon-only buttons:  aria-label always set.
-->
<script lang="ts">
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import * as ButtonGroup from '$lib/components/ui/button-group/index.js';
	import { Button } from '$lib/components/ui/button';
	import ChevronLeftIcon from '@lucide/svelte/icons/chevron-left';
	import ChevronRightIcon from '@lucide/svelte/icons/chevron-right';
	import RefreshCwIcon from '@lucide/svelte/icons/refresh-cw';
	import * as m from '$lib/paraglide/messages.js';
	import { localeState } from '$lib/i18n.svelte.js';
	import DataTableGotoPage from './data-table-goto-page.svelte';

	const PAGE_SIZE_OPTIONS = [10, 20, 25, 30, 50];

	let {
		limit,
		page,
		total,
		totalPages,
		asOf,
		loading,
		onLimitChange,
		onGotoPage,
		onNext,
		onPrev,
		onRefresh
	}: {
		limit: number;
		page: number;
		total: number;
		totalPages: number;
		asOf: Date;
		loading: boolean;
		onLimitChange: (limit: number) => void;
		onGotoPage: (page: number) => void;
		onNext: () => void;
		onPrev: () => void;
		onRefresh: () => void;
	} = $props();

	const snapshotTime = $derived(
		new Intl.DateTimeFormat(localeState.current, { timeStyle: 'short' }).format(asOf)
	);

	const isFirst = $derived(page <= 1);
	const isLast = $derived(page >= totalPages);

	const initialLoad = $derived(loading && total === 0);
	const showPagination = $derived(!initialLoad && totalPages > 1);
</script>

<div class="flex w-full flex-wrap items-center justify-between gap-4 py-2">
	<!-- LEFT: pagination control (with load-stage and single-page fallbacks).
	     ButtonGroup automatically joins borders between children via its
	     `[&>[data-slot]~[data-slot]]:border-l-0` rule — DO NOT add manual
	     `border-r-0` overrides, that produces a borderless seam.

	     Initial-load skeleton mirrors the real control's shape (chevrons +
	     middle segment) but with "0 / 0" as the placeholder count and all
	     buttons disabled. No visual jump when data arrives. -->
	{#if initialLoad}
		<ButtonGroup.Root>
			<Button
				variant="outline"
				size="sm"
				disabled
				aria-label={m.log_pagination_prev()}
				class="px-2"
			>
				<ChevronLeftIcon />
			</Button>
			<Button variant="outline" size="sm" disabled class="tabular-nums">0 / 0</Button>
			<Button
				variant="outline"
				size="sm"
				disabled
				aria-label={m.log_pagination_next()}
				class="px-2"
			>
				<ChevronRightIcon />
			</Button>
		</ButtonGroup.Root>
	{:else if showPagination}
		<ButtonGroup.Root>
			<Button
				variant="outline"
				size="sm"
				disabled={isFirst || loading}
				aria-label={m.log_pagination_prev()}
				onclick={onPrev}
				class="px-2"
			>
				<ChevronLeftIcon />
			</Button>
			<DataTableGotoPage currentPage={page} {totalPages} onGoto={onGotoPage} />
			<Button
				variant="outline"
				size="sm"
				disabled={isLast || loading}
				aria-label={m.log_pagination_next()}
				onclick={onNext}
				class="px-2"
			>
				<ChevronRightIcon />
			</Button>
		</ButtonGroup.Root>
	{:else}
		<!-- Spacer so justify-between keeps center/right where they were. -->
		<span></span>
	{/if}

	<!-- CENTER: records count + refresh/snapshot, joined as one ButtonGroup pill.
	     Same segmented pattern as the LEFT control. The records text uses
	     `data-slot="text"` so ButtonGroup's `[&>[data-slot]]` rounding/border
	     rules pick it up as a sibling segment alongside the refresh button.
	     When total === 0 (initial load), the records segment is omitted and
	     the refresh button renders as a standalone pill. -->
	<ButtonGroup.Root>
		<Button
			variant="outline"
			size="sm"
			onclick={onRefresh}
			aria-label={m.log_pagination_refresh()}
			title={m.log_pagination_refresh()}
		>
			<RefreshCwIcon class={loading ? 'animate-spin' : ''} />
			<span class="tabular-nums">{snapshotTime}</span>
		</Button>
		<Button variant="outline" size="sm" disabled={loading} class="px-3">
			<!-- <TablePropertiesIcon /> -->
			{m.log_pagination_records({ count: total.toLocaleString(localeState.current) })}
		</Button>
	</ButtonGroup.Root>

	<!-- RIGHT: "Rows per page" label + size dropdown. -->
	<div class="flex items-center gap-2 text-sm">
		<span class="text-muted-foreground">{m.log_pagination_rows_per_page()}</span>
		<DropdownMenu.Root>
			<DropdownMenu.Trigger>
				{#snippet child({ props })}
					<Button {...props} variant="outline" size="sm" class="tabular-nums">
						{limit}
					</Button>
				{/snippet}
			</DropdownMenu.Trigger>
			<DropdownMenu.Content align="end" class="w-24">
				{#each PAGE_SIZE_OPTIONS as size (size)}
					<DropdownMenu.CheckboxItem onSelect={() => onLimitChange(size)} checked={limit === size}>
						{size}
					</DropdownMenu.CheckboxItem>
				{/each}
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	</div>
</div>
