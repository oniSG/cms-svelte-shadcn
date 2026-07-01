<script lang="ts" generics="Row">
	import type { Table as TanStackTable } from '@tanstack/table-core';
	import * as ButtonGroup from '$lib/components/ui/button-group/index.js';
	import * as InputGroup from '$lib/components/ui/input-group/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input/index.js';
	import XIcon from '@lucide/svelte/icons/x';
	import SearchIcon from '@lucide/svelte/icons/search';
	import SettingsIcon from '@lucide/svelte/icons/settings';
	import CalendarIcon from '@lucide/svelte/icons/calendar';
	import BookmarkIcon from '@lucide/svelte/icons/bookmark';
	import SaveIcon from '@lucide/svelte/icons/save';
	import RotateCcwIcon from '@lucide/svelte/icons/rotate-ccw';
	import Trash2Icon from '@lucide/svelte/icons/trash-2';
	import Loader2Icon from '@lucide/svelte/icons/loader-2';
	import ColVisibility from './col-visibility.svelte';
	import QueryBuilder from './query-builder/query-builder.svelte';
	import ShortcutMultiSelect from './shortcut-multi-select.svelte';
	import ShortcutDateRange from './shortcut-date-range.svelte';
	import {
		deserializeQuery,
		emptyQuery,
		getShortcutDateRange,
		getShortcutMulti,
		getShortcutSearch,
		getShortcutSearchFields,
		serializeQuery,
		setShortcutDateRange,
		setShortcutMulti,
		setShortcutSearch,
		type Group
	} from './query-builder/fields.js';
	import { loadPreferences, patchPreferences } from './preferences.js';
	import { createSavedViewsStore, type SavedView } from './saved-views.svelte';
	import type { QueryFieldDef, SearchConfig, Shortcut, TableColumn } from './types';

	let {
		queryKey,
		query,
		table,
		columns,
		queryFields,
		search,
		shortcuts = [],
		limit,
		onPatchQuery,
		onReset,
		onResetView,
		onLimitChange
	}: {
		queryKey: string;
		query: Group;
		table: TanStackTable<Row>;
		columns: TableColumn<Row>[];
		queryFields: QueryFieldDef[];
		search?: SearchConfig;
		shortcuts?: Shortcut[];
		limit: number;
		onPatchQuery: (q: Group) => void;
		onReset: () => void;
		onResetView: () => void;
		onLimitChange: (limit: number) => void;
	} = $props();

	// svelte-ignore state_referenced_locally
	const storedPrefs = loadPreferences(queryKey);

	const isFiltered = $derived(query.children.length > 0);
	const labelFor = (id: string) => columns.find((c) => c.id === id)?.label ?? id;
	const searchValue = $derived(search ? getShortcutSearch(query, '__search') : '');

	function initSelectedSearchFields(): string[] {
		const configured = search?.fields ?? [];
		const stored = storedPrefs.searchFields;
		if (!stored) return configured;
		const merged = [...stored];
		for (const f of configured) if (!merged.includes(f)) merged.push(f);
		const valid = merged.filter((f) => configured.includes(f));
		return valid.length > 0 ? valid : configured;
	}

	let selectedSearchFields = $state<string[]>(initSelectedSearchFields());
	let searchFieldsHydrated = false;
	$effect(() => {
		if (searchFieldsHydrated) return;
		searchFieldsHydrated = true;
		const fromUrl = getShortcutSearchFields(query, '__search');
		if (fromUrl.length > 0) selectedSearchFields = fromUrl;
	});
	$effect(() => {
		patchPreferences(queryKey, { searchFields: $state.snapshot(selectedSearchFields) });
	});

	function toggleSearchField(field: string) {
		const next = selectedSearchFields.includes(field)
			? selectedSearchFields.filter((f) => f !== field)
			: [...selectedSearchFields, field];
		if (next.length === 0) return;
		selectedSearchFields = next;
		if (searchValue) {
			onPatchQuery(setShortcutSearch(query, '__search', searchValue, next));
		}
	}

	// svelte-ignore state_referenced_locally
	let searchInput = $state<string>(searchValue);
	let searchInputEl = $state<HTMLInputElement | null>(null);
	$effect(() => {
		if (typeof document === 'undefined') return;
		if (document.activeElement === searchInputEl) return;
		if (searchInput !== searchValue) searchInput = searchValue;
	});

	function commitSearch() {
		if (searchInput === searchValue) return;
		onPatchQuery(setShortcutSearch(query, '__search', searchInput, selectedSearchFields));
	}

	const SEARCH_DEBOUNCE_MS = 350;
	let searchDebounceHandle: ReturnType<typeof setTimeout> | null = null;
	let searchPending = $state(false);

	function cancelSearchDebounce() {
		if (searchDebounceHandle !== null) {
			clearTimeout(searchDebounceHandle);
			searchDebounceHandle = null;
		}
		searchPending = false;
	}

	function scheduleSearchCommit() {
		if (searchDebounceHandle !== null) clearTimeout(searchDebounceHandle);
		searchPending = true;
		searchDebounceHandle = setTimeout(() => {
			searchDebounceHandle = null;
			searchPending = false;
			commitSearch();
		}, SEARCH_DEBOUNCE_MS);
	}

	$effect(() => () => cancelSearchDebounce());

	const searchPlaceholder = $derived.by(() => {
		if (!search) return '';
		const ordered = search.fields.filter((f) => selectedSearchFields.includes(f));
		if (ordered.length === 0) return search.placeholder;
		const first = labelFor(ordered[0]);
		const rest = ordered.length - 1;
		const tail = rest > 0 ? ` + ${rest} ${rest === 1 ? 'other' : 'others'}` : '';
		return `Search by ${first}${tail}`;
	});

	// svelte-ignore state_referenced_locally
	let hiddenShortcuts = $state<string[]>(
		storedPrefs.hiddenShortcuts ?? shortcuts.filter((s) => s.defaultHidden).map((s) => s.id)
	);
	$effect(() => {
		patchPreferences(queryKey, { hiddenShortcuts: $state.snapshot(hiddenShortcuts) });
	});

	function isShortcutActive(s: Shortcut): boolean {
		if (s.kind === 'multi-select') return getShortcutMulti(query, s.id).length > 0;
		if (s.kind === 'date-range') {
			const r = getShortcutDateRange(query, s.id);
			return !!(r.from || r.to);
		}
		return false;
	}

	const visibleShortcuts = $derived(
		shortcuts.filter((s) => !hiddenShortcuts.includes(s.id) || isShortcutActive(s))
	);

	function toggleShortcut(id: string) {
		hiddenShortcuts = hiddenShortcuts.includes(id)
			? hiddenShortcuts.filter((i) => i !== id)
			: [...hiddenShortcuts, id];
	}

	// svelte-ignore state_referenced_locally
	const savedViews = createSavedViewsStore(queryKey);

	function cloneGroup(g: Group): Group {
		return deserializeQuery(serializeQuery(g)) ?? emptyQuery();
	}

	function captureSnapshot() {
		const state = table.getState();
		const sorting = state.sorting[0];
		return {
			q: cloneGroup(query),
			columnVisibility: { ...state.columnVisibility },
			columnOrder: [...state.columnOrder],
			columnSizing: { ...state.columnSizing },
			sort: sorting?.id ?? 'id',
			dir: (sorting?.desc ? 'desc' : 'asc') as 'asc' | 'desc',
			limit
		};
	}

	function applyView(view: SavedView) {
		table.setColumnVisibility(view.columnVisibility);
		table.setColumnOrder(view.columnOrder);
		table.setColumnSizing(view.columnSizing);
		table.setSorting([{ id: view.sort, desc: view.dir === 'desc' }]);
		onPatchQuery(cloneGroup(view.q));
		onLimitChange(view.limit);
	}

	let saveViewDialogOpen = $state(false);
	let saveViewName = $state('');
	let saveViewInputEl = $state<HTMLInputElement | null>(null);

	$effect(() => {
		if (saveViewDialogOpen) {
			saveViewName = '';
			queueMicrotask(() => saveViewInputEl?.focus());
		}
	});

	function confirmSaveView() {
		const name = saveViewName.trim();
		if (!name) return;
		savedViews.save(name, captureSnapshot());
		saveViewDialogOpen = false;
	}

	let pendingDeleteViewId = $state<string | null>(null);
	const pendingDeleteViewName = $derived(
		savedViews.items.find((v) => v.id === pendingDeleteViewId)?.name ?? ''
	);
	const deleteDialogOpen = $derived(pendingDeleteViewId !== null);

	function cancelDeleteView() {
		pendingDeleteViewId = null;
	}

	function confirmDeleteView() {
		if (pendingDeleteViewId) savedViews.remove(pendingDeleteViewId);
		pendingDeleteViewId = null;
	}
</script>

<div
	class="flex h-12 shrink-0 items-center justify-between gap-2 border-b border-border bg-background px-2"
>
	<div class="flex min-w-0 items-center gap-2">
		{#if search}
			{@const hasMultipleFields = search.fields.length > 1}
			{#snippet searchField()}
				<InputGroup.Root class="h-8 w-64 border border-border bg-background">
					<InputGroup.Addon>
						{#if searchPending}
							<Loader2Icon class="animate-spin text-muted-foreground" />
						{:else}
							<SearchIcon />
						{/if}
					</InputGroup.Addon>
					<InputGroup.Input
						bind:ref={searchInputEl}
						bind:value={searchInput}
						placeholder={searchPlaceholder}
						oninput={scheduleSearchCommit}
						onkeydown={(e) => {
							if (e.key === 'Enter') {
								e.preventDefault();
								cancelSearchDebounce();
								commitSearch();
							} else if (e.key === 'Escape') {
								e.preventDefault();
								cancelSearchDebounce();
								searchInput = searchValue;
								searchInputEl?.blur();
							}
						}}
						onblur={() => {
							cancelSearchDebounce();
							commitSearch();
						}}
					/>
				</InputGroup.Root>
			{/snippet}
			{#snippet searchInDropdown()}
				<DropdownMenu.Root>
					<DropdownMenu.Trigger>
						{#snippet child({ props })}
							<Button {...props} variant="outline" size="sm">
								<SettingsIcon />
							</Button>
						{/snippet}
					</DropdownMenu.Trigger>
					<DropdownMenu.Content align="end">
						<DropdownMenu.Label>Search in</DropdownMenu.Label>
						{#each search.fields as field (field)}
							<DropdownMenu.CheckboxItem
								checked={selectedSearchFields.includes(field)}
								onSelect={(e) => {
									e.preventDefault();
									toggleSearchField(field);
								}}
							>
								{labelFor(field)}
							</DropdownMenu.CheckboxItem>
						{/each}
					</DropdownMenu.Content>
				</DropdownMenu.Root>
			{/snippet}
			{#if hasMultipleFields}
				<ButtonGroup.Root>
					{@render searchField()}
					{@render searchInDropdown()}
				</ButtonGroup.Root>
			{:else}
				{@render searchField()}
			{/if}
		{/if}

		{#if shortcuts.length > 0}
			<ButtonGroup.Root>
				{#each visibleShortcuts as shortcut (shortcut.id)}
					{#if shortcut.kind === 'multi-select'}
						<ShortcutMultiSelect
							title={shortcut.label}
							icon={shortcut.icon}
							options={shortcut.options}
							value={getShortcutMulti(query, shortcut.id)}
							searchable={shortcut.searchable}
							onChange={(v) =>
								onPatchQuery(setShortcutMulti(query, shortcut.id, shortcut.field, v))}
						/>
					{:else if shortcut.kind === 'date-range'}
						{@const range = getShortcutDateRange(query, shortcut.id)}
						<ShortcutDateRange
							from={range.from}
							to={range.to}
							label={shortcut.label}
							icon={shortcut.icon}
							onChange={(from, to) =>
								onPatchQuery(setShortcutDateRange(query, shortcut.id, shortcut.field, from, to))}
						/>
					{/if}
				{/each}
				<DropdownMenu.Root>
					<DropdownMenu.Trigger>
						{#snippet child({ props })}
							<Button {...props} variant="outline" size="icon-sm" aria-label="Configure shortcuts">
								<SettingsIcon />
							</Button>
						{/snippet}
					</DropdownMenu.Trigger>
					<DropdownMenu.Content align="start" class="w-56">
						<DropdownMenu.Label>Shortcuts</DropdownMenu.Label>
						{#each shortcuts as shortcut (shortcut.id)}
							{@const Icon =
								shortcut.icon ?? (shortcut.kind === 'date-range' ? CalendarIcon : undefined)}
							{@const active = isShortcutActive(shortcut)}
							{@const hidden = hiddenShortcuts.includes(shortcut.id)}
							<DropdownMenu.CheckboxItem
								checked={!hidden || active}
								disabled={active}
								onSelect={(e) => {
									e.preventDefault();
									if (!active) toggleShortcut(shortcut.id);
								}}
							>
								{#if Icon}
									<Icon />
								{/if}
								{shortcut.label ?? shortcut.id}
							</DropdownMenu.CheckboxItem>
						{/each}
					</DropdownMenu.Content>
				</DropdownMenu.Root>
			</ButtonGroup.Root>
		{/if}

		<QueryBuilder group={query} fields={queryFields} onApply={onPatchQuery} />

		{#if isFiltered}
			<Button variant="ghost" size="sm" onclick={onReset}>
				<XIcon />
				Reset
			</Button>
		{/if}
	</div>

	<div class="flex shrink-0 items-center gap-2 text-sm">
		<ColVisibility {table} {labelFor} />

		<DropdownMenu.Root>
			<DropdownMenu.Trigger>
				{#snippet child({ props })}
					<Button {...props} variant="outline" size="sm">
						<BookmarkIcon />
						Views
					</Button>
				{/snippet}
			</DropdownMenu.Trigger>
			<DropdownMenu.Content align="end" class="w-64">
				<DropdownMenu.Group>
					<DropdownMenu.Label>Views</DropdownMenu.Label>
					<DropdownMenu.Item onSelect={onResetView}>
						<RotateCcwIcon />
						Default view
					</DropdownMenu.Item>
					{#each savedViews.items as v (v.id)}
						<DropdownMenu.Item
							class="group flex items-center justify-between gap-2"
							onSelect={() => applyView(v)}
						>
							<span class="truncate">{v.name}</span>
							<button
								type="button"
								class="delete-view-btn cursor-pointer"
								aria-label={`Delete view ${v.name}`}
								onclick={(e) => {
									e.stopPropagation();
									e.preventDefault();
									pendingDeleteViewId = v.id;
								}}
							>
								<Trash2Icon class="size-4 transition-colors" />
							</button>
						</DropdownMenu.Item>
					{/each}
				</DropdownMenu.Group>
				<DropdownMenu.Separator />
				<DropdownMenu.Group>
					<DropdownMenu.Item onSelect={() => (saveViewDialogOpen = true)}>
						<SaveIcon />
						Save current view…
					</DropdownMenu.Item>
				</DropdownMenu.Group>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	</div>
</div>

<Dialog.Root bind:open={saveViewDialogOpen}>
	<Dialog.Content class="sm:max-w-md">
		<Dialog.Header>
			<Dialog.Title>Save view</Dialog.Title>
			<Dialog.Description>
				Save the current filters, columns, sort and page size as a view you can reopen later from
				this device.
			</Dialog.Description>
		</Dialog.Header>
		<form
			class="flex flex-col gap-2"
			onsubmit={(e) => {
				e.preventDefault();
				confirmSaveView();
			}}
		>
			<Input
				bind:ref={saveViewInputEl}
				bind:value={saveViewName}
				placeholder="View name"
				autocomplete="off"
			/>
		</form>
		<Dialog.Footer>
			<Button variant="outline" onclick={() => (saveViewDialogOpen = false)}>Cancel</Button>
			<Button onclick={confirmSaveView} disabled={!saveViewName.trim()}>Save</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>

<Dialog.Root
	open={deleteDialogOpen}
	onOpenChange={(open) => {
		if (!open) cancelDeleteView();
	}}
>
	<Dialog.Content class="sm:max-w-md">
		<Dialog.Header>
			<Dialog.Title>Delete view</Dialog.Title>
			<Dialog.Description>
				Delete the view <span class="font-medium text-foreground">{pendingDeleteViewName}</span>?
				This cannot be undone.
			</Dialog.Description>
		</Dialog.Header>
		<Dialog.Footer>
			<Button variant="outline" onclick={cancelDeleteView}>Cancel</Button>
			<Button variant="destructive" onclick={confirmDeleteView}>
				<Trash2Icon />
				Delete
			</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>

<style>
	.delete-view-btn:hover :global(svg) {
		color: var(--destructive) !important;
	}
</style>
