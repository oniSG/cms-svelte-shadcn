<script lang="ts">
	import TagIcon from '@lucide/svelte/icons/tag';
	import UserIcon from '@lucide/svelte/icons/user';
	import PlusIcon from '@lucide/svelte/icons/plus';
	import PencilIcon from '@lucide/svelte/icons/pencil';
	import TrashIcon from '@lucide/svelte/icons/trash-2';
	import CopyIcon from '@lucide/svelte/icons/copy';
	import InfoIcon from '@lucide/svelte/icons/info';
	import { useQueryClient } from '@tanstack/svelte-query';
	import { toast } from 'svelte-sonner';
	import { Button } from '$lib/components/ui/button';
	import DeleteDialog from '$lib/components/custom/delete-dialog.svelte';
	import {
		CellTags,
		TablePage,
		type ActionWrap,
		type Shortcut,
		type TableColumn
	} from '$lib/components/custom/table-page';
	import {
		commonSegmentTags,
		SEGMENT_LIMITS,
		type Segment,
		type SegmentFormValues
	} from './segment';
	import {
		addSegment,
		data as segmentData,
		deleteSegment,
		deleteSegments,
		updateSegment
	} from './temp/data';
	import { fetchSegments } from './temp/api';
	import SegmentFormSheet from './components/segment-form-sheet.svelte';
	import PageHeader from '$lib/components/custom/sidebar/page-header.svelte';
	import * as m from '$lib/paraglide/messages.js';
	import * as Sheet from '$lib/components/ui/sheet/index.js';

	const QUERY_KEY = 'segments';
	const queryClient = useQueryClient();

	const breadcrumbs = $derived([
		{ title: m.crumb_home(), url: '/' as const },
		{ title: m.sidebar_module_fans() },
		{ title: m.nav_fans_segments() }
	]);

	const tagOptions = commonSegmentTags.map((t) => ({ value: t, label: t }));
	const creatorOptions = $derived(
		Array.from(new Set(segmentData.map((s) => s.created_by)))
			.sort((a, b) => a.localeCompare(b))
			.map((s) => ({ value: s, label: s }))
	);

	const columns = $derived<TableColumn<Segment>[]>([
		{ id: 'name', label: 'Name', type: 'text', width: 240 },
		{
			id: 'tags',
			label: 'Tags',
			type: 'text',
			width: 260,
			sortable: true,
			cell: CellTags
		},
		{
			id: 'description',
			label: 'Description',
			type: 'text',
			width: 320,
			accessor: (s) => s.description
		},
		{ id: 'created_by', label: 'Created by', type: 'text', width: 200 },
		{ id: 'updated_at', label: 'Last updated', type: 'date', width: 200 }
	]);

	const shortcuts = $derived<Shortcut[]>([
		{
			kind: 'multi-select',
			id: 'tags',
			label: 'Tags',
			icon: TagIcon,
			field: 'tags',
			options: tagOptions
		},
		{
			kind: 'multi-select',
			id: 'created_by',
			label: 'Created by',
			icon: UserIcon,
			field: 'created_by',
			options: creatorOptions
		},
		{ kind: 'date-range', id: 'updated_at', label: 'Updated', field: 'updated_at' }
	]);

	let formOpen = $state(false);
	let editingSegment = $state<Segment | undefined>(undefined);

	let deleteOpen = $state(false);
	let deletingSegment = $state<Segment | undefined>(undefined);

	let bulkDeleteOpen = $state(false);
	let bulkDeleteIds = $state<string[]>([]);

	function invalidate() {
		queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
	}

	function isNameTaken(name: string): boolean {
		const target = name.trim().toLowerCase();
		return segmentData.some((s) => s.name.trim().toLowerCase() === target);
	}

	function openCreate() {
		if (segmentData.length >= SEGMENT_LIMITS.maxSegments) {
			toast.error(
				`Segment limit reached (${SEGMENT_LIMITS.maxSegments}). Delete some segments first.`
			);
			return;
		}
		editingSegment = undefined;
		formOpen = true;
	}

	function openEdit(seg: Segment) {
		editingSegment = seg;
		formOpen = true;
	}

	function openDelete(seg: Segment) {
		deletingSegment = seg;
		deleteOpen = true;
	}

	function openBulkDelete(ids: string[]) {
		bulkDeleteIds = ids;
		bulkDeleteOpen = true;
	}

	function handleSave(input: SegmentFormValues) {
		if (editingSegment) {
			updateSegment(editingSegment.id, input);
			toast.success(`Segment "${input.name}" updated`);
		} else {
			addSegment(input);
			toast.success(`Segment "${input.name}" created`);
		}
		editingSegment = undefined;
		invalidate();
	}

	function handleConfirmDelete() {
		if (!deletingSegment) return;
		const name = deletingSegment.name;
		deleteSegment(deletingSegment.id);
		deletingSegment = undefined;
		invalidate();
		toast.success(`Segment "${name}" deleted`);
	}

	function handleConfirmBulkDelete() {
		const removed = deleteSegments(bulkDeleteIds);
		bulkDeleteIds = [];
		invalidate();
		toast.success(`${removed} segment${removed === 1 ? '' : 's'} deleted`);
	}

	function handleDuplicate(seg: Segment) {
		const base = `${seg.name} (copy)`;
		let candidate = base;
		let i = 2;
		while (isNameTaken(candidate)) {
			candidate = `${base} ${i++}`;
		}
		addSegment({
			name: candidate,
			description: seg.description,
			tags: seg.tags
		});
		invalidate();
		toast.success(`Duplicated as "${candidate}"`);
	}
</script>

<PageHeader separator {breadcrumbs}>
	<Sheet.Root>
		<Sheet.Trigger>
			{#snippet child({ props })}
				<Button {...props} variant="outline" size="icon" aria-label="What is a segment?">
					<InfoIcon />
				</Button>
			{/snippet}
		</Sheet.Trigger>
		<Sheet.Content>
			<div
				class="prose prose-sm min-h-0 flex-1 overflow-y-auto px-6 py-6 dark:prose-invert prose-code:before:content-none prose-code:after:content-none"
			>
				<h2>What is a segment?</h2>
				<p>
					A segment is a saved audience — a reusable set of visitors that share a common trait or
					behaviour. Instead of building the same filter over and over you name it once and target
					it from campaigns, exports, and reports.
				</p>

				<h3>Tags</h3>
				<p>
					Tags on a segment are purely organisational — they help you find related segments quickly.
					They have no impact on who ends up inside the segment.
				</p>
			</div>
		</Sheet.Content>
	</Sheet.Root>
	<Button size="sm" onclick={openCreate}>
		<PlusIcon />
		Create segment
	</Button>
</PageHeader>

<TablePage
	queryKey={QUERY_KEY}
	{columns}
	{shortcuts}
	fetcher={fetchSegments}
	search={{
		placeholder: 'Search segments',
		fields: ['name', 'description', 'created_by']
	}}
	defaultSort={{ id: 'updated_at', desc: true }}
	click={{ onClick: openEdit }}
	{rowActions}
	rowActionsTitle={(s) => s.name}
	selectable
	onDeleteSelected={openBulkDelete}
/>

<SegmentFormSheet bind:open={formOpen} segment={editingSegment} {isNameTaken} onSave={handleSave} />

<DeleteDialog
	bind:open={deleteOpen}
	title="Delete segment"
	description={deletingSegment
		? `Are you sure you want to delete "${deletingSegment.name}"? This action cannot be undone.`
		: ''}
	onConfirm={handleConfirmDelete}
/>

<DeleteDialog
	bind:open={bulkDeleteOpen}
	title="Delete segments"
	description={`Are you sure you want to delete ${bulkDeleteIds.length} segment${bulkDeleteIds.length === 1 ? '' : 's'}? This action cannot be undone.`}
	confirmLabel="Delete all"
	onConfirm={handleConfirmBulkDelete}
/>

{#snippet rowActions(s: Segment, { Item, Separator }: ActionWrap)}
	<Item onSelect={() => openEdit(s)}>
		<PencilIcon />
		Edit
	</Item>
	<Item onSelect={() => handleDuplicate(s)}>
		<CopyIcon />
		Duplicate
	</Item>
	<Separator />
	<Item onSelect={() => openDelete(s)} class="text-destructive focus:text-destructive">
		<TrashIcon />
		Delete
	</Item>
{/snippet}
