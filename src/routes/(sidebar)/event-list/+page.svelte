<script lang="ts">
	import TagIcon from '@lucide/svelte/icons/tag';
	import UserIcon from '@lucide/svelte/icons/user';
	import PlusIcon from '@lucide/svelte/icons/plus';
	import PencilIcon from '@lucide/svelte/icons/pencil';
	import CopyIcon from '@lucide/svelte/icons/copy';
	import EyeIcon from '@lucide/svelte/icons/eye';
	import TrashIcon from '@lucide/svelte/icons/trash-2';
	import { Button } from '$lib/components/ui/button';
	import {
		CellTags,
		TablePage,
		type ActionWrap,
		type Shortcut,
		type TableColumn
	} from '$lib/components/custom/table-page';
	import PageHeader from '$lib/components/custom/sidebar/page-header.svelte';
	import { eventListTags, type Event } from './event-list';
	import { eventCreatorOptions, fetchEvents } from './temp/api';
	import EventFormSheet from './components/event-form-sheet.svelte';
	import EventDetailSheet from './components/event-detail-sheet.svelte';
	import EventCopySheet from './components/event-copy-sheet.svelte';
	import EventDeleteSheet from './components/event-delete-sheet.svelte';
	import * as Sheet from '$lib/components/ui/sheet/index.js';
	import * as m from '$lib/paraglide/messages.js';

	const QUERY_KEY = 'event-list';

	const breadcrumbs = $derived([
		{ title: m.crumb_home(), url: '/' as const },
		{ title: m.sidebar_module_fans() },
		{ title: m.nav_fans_event_lists() }
	]);

	const tagOptions = eventListTags.map((tag) => ({ value: tag, label: tag }));
	const creatorOptions = eventCreatorOptions();

	const columns = $derived<TableColumn<Event>[]>([
		{ id: 'event', label: m.col_event(), type: 'text', width: 260 },
		{
			id: 'label',
			label: m.col_label(),
			type: 'text',
			width: 180,
			sortable: true,
			cell: CellTags
		},
		{ id: 'name', label: m.col_created_by(), type: 'text', width: 220 },
		{ id: 'time', label: m.col_created_at(), type: 'date', width: 200 },
		{ id: 'active', label: m.col_active(), type: 'bool', width: 120, align: 'center' }
	]);

	const shortcuts = $derived<Shortcut[]>([
		{
			kind: 'multi-select',
			id: 'creators',
			label: m.col_created_by(),
			icon: UserIcon,
			field: 'name',
			options: creatorOptions
		},
		{
			kind: 'multi-select',
			id: 'labels',
			label: m.col_label(),
			icon: TagIcon,
			field: 'label',
			options: tagOptions
		},
		{ kind: 'date-range', id: 'time', label: m.col_created_at(), field: 'time' }
	]);

	let formOpen = $state(false);
	let editingEvent = $state<Event | undefined>(undefined);
	let copyOpen = $state(false);
	let copyingEvent = $state<Event | undefined>(undefined);
	let detailOpen = $state(false);
	let detailEvent = $state<Event | undefined>(undefined);
	let deleteOpen = $state(false);
	let deletingEvent = $state<Event | undefined>(undefined);

	function openCreate() {
		editingEvent = undefined;
		formOpen = true;
	}

	function openEdit(event: Event) {
		editingEvent = event;
		formOpen = true;
	}

	function openCopy(event: Event) {
		copyingEvent = event;
		copyOpen = true;
	}

	function openDetail(event: Event) {
		detailEvent = event;
		detailOpen = true;
	}

	function openDelete(event: Event) {
		deletingEvent = event;
		deleteOpen = true;
	}

	function handleCopy(event: Event) {
		console.log('copy', event.id);
	}

	function handleDelete(event: Event) {
		console.log('delete', event.id);
	}
</script>

<PageHeader separator {breadcrumbs}>
	<Button size="sm" onclick={openCreate}>
		<PlusIcon />
		{m.add_record()}
	</Button>
</PageHeader>

<TablePage
	queryKey={QUERY_KEY}
	{columns}
	{shortcuts}
	fetcher={fetchEvents}
	search={{
		placeholder: m.col_event(),
		fields: ['event', 'name']
	}}
	defaultSort={{ id: 'time', desc: true }}
	getRowId={(event) => String(event.id)}
	click={{ sheet: eventDetailSheet }}
	{rowActions}
	rowActionsTitle={(event) => event.event}
/>

<EventFormSheet bind:open={formOpen} event={editingEvent} />

<EventCopySheet bind:open={copyOpen} event={copyingEvent} onConfirm={handleCopy} />

<EventDeleteSheet bind:open={deleteOpen} event={deletingEvent} onConfirm={handleDelete} />

<Sheet.Root bind:open={detailOpen}>
	<Sheet.Content>
		{#if detailEvent}
			<EventDetailSheet event={detailEvent} />
		{/if}
	</Sheet.Content>
</Sheet.Root>

{#snippet eventDetailSheet(event: Event)}
	<EventDetailSheet {event} />
{/snippet}

{#snippet rowActions(event: Event, { Item, Separator }: ActionWrap)}
	<Item onSelect={() => openEdit(event)}>
		<PencilIcon />
		{m.reply_email_edit()}
	</Item>
	<Item onSelect={() => openCopy(event)}>
		<CopyIcon />
		{m.event_dialog_copy_submit()}
	</Item>
	<Item onSelect={() => openDetail(event)}>
		<EyeIcon />
		{m.event_detail()}
	</Item>
	<Separator />
	<Item onSelect={() => openDelete(event)} class="text-destructive focus:text-destructive">
		<TrashIcon />
		{m.event_dialog_delete_submit()}
	</Item>
{/snippet}
