<!--
  filter-sub-menu.svelte — searchable multi-select body, designed to live
  INSIDE a <DropdownMenu.SubContent>.

  Why a separate component instead of inlining in each snippet:
  • Local search state — when the sub-menu closes the SubContent unmounts,
    which auto-resets the search box on the next open. Top-level $state
    couldn't do that without extra wiring.
  • Generic over TValue so it works for both action-type filtering and
    free-form email filtering.

  Quirk worth knowing:
  bits-ui's DropdownMenu applies a TYPEAHEAD listener that grabs letter
  keys and moves focus to a matching item. While our search Input has
  focus we don't want that — so we stopPropagation on keydown. The Input
  still works normally; the menu just stops "hearing" the keys.
-->
<script lang="ts" generics="TValue extends string">
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import SearchIcon from '@lucide/svelte/icons/search';
	import * as m from '$lib/paraglide/messages.js';

	let {
		options, // every option the user could pick
		selected, // currently-selected values (controlled by parent)
		onToggle, // (value, on) → tell parent to flip one option
		onClear, // user clicked "Clear filters"
		placeholder // search-box placeholder (usually the column title)
	}: {
		options: { value: TValue; label: string }[];
		selected: TValue[];
		onToggle: (v: TValue, on: boolean) => void;
		onClear: () => void;
		placeholder: string;
	} = $props();

	let search = $state('');

	const filtered = $derived.by(() => {
		const q = search.trim().toLowerCase();
		if (q === '') return options;
		return options.filter((o) => o.label.toLowerCase().includes(q));
	});
</script>

<!--
  Outer wrapper carries the bottom-gap to the list below; the inner
  `relative` is sized exactly to the Input so `top-1/2` centers the
  search icon on the input row instead of including the gap in its math.
-->
<div class="px-1 pb-1.5">
	<div class="relative">
		<SearchIcon
			class="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground/70"
		/>
		<Input
			type="text"
			bind:value={search}
			{placeholder}
			class="h-8 bg-transparent pl-8 text-sm"
			onkeydown={(e) => e.stopPropagation()}
		/>
	</div>
</div>

<div class="max-h-56 overflow-y-auto">
	{#each filtered as opt (opt.value)}
		<DropdownMenu.CheckboxItem
			closeOnSelect={false}
			checked={selected.includes(opt.value)}
			onCheckedChange={(c) => onToggle(opt.value, !!c)}
		>
			{opt.label}
		</DropdownMenu.CheckboxItem>
	{:else}
		<div class="px-3 py-2 text-sm text-muted-foreground">
			{m.log_filter_no_results()}
		</div>
	{/each}
</div>

{#if selected.length > 0}
	<DropdownMenu.Separator />
	<DropdownMenu.Item onclick={onClear}>
		{m.log_filter_clear_filters()}
	</DropdownMenu.Item>
{/if}
