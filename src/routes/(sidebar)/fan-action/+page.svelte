<script lang="ts">
	import TagIcon from '@lucide/svelte/icons/tag';
	import UserIcon from '@lucide/svelte/icons/user';
	import ZapIcon from '@lucide/svelte/icons/zap';
	import PlusIcon from '@lucide/svelte/icons/plus';
	import PencilIcon from '@lucide/svelte/icons/pencil';
	import CopyIcon from '@lucide/svelte/icons/copy';
	import EyeIcon from '@lucide/svelte/icons/eye';
	import TrashIcon from '@lucide/svelte/icons/trash-2';
	import { goto } from '$app/navigation';
	import { Button } from '$lib/components/ui/button';
	import {
		CellTags,
		TablePage,
		type ActionWrap,
		type Shortcut,
		type TableColumn
	} from '$lib/components/custom/table-page';
	import * as m from '$lib/paraglide/messages.js';
	import type { FanAction } from '$lib/types/fan-action.js';
	import { allCreators, allTags } from './temp/options.js';
	import { fetchFanActions } from './temp/api';
	import PageHeader from '$lib/components/custom/sidebar/page-header.svelte';

	const breadcrumbs = $derived([
		{ title: m.crumb_home(), url: '/' as const },
		{ title: m.sidebar_module_fans() },
		{ title: m.nav_fans_campaigns() }
	]);

	const tagOptions = allTags.map((t) => ({ value: t, label: t }));
	const creatorOptions = allCreators.map((c) => ({ value: c, label: c }));
	const boolOptions = $derived([
		{ value: 'true', label: m.common_yes() },
		{ value: 'false', label: m.common_no() }
	]);

	const columns = $derived<TableColumn<FanAction>[]>([
		{ id: 'event', label: m.col_event(), type: 'text', width: 260 },
		{
			id: 'tags',
			label: m.event_tags_label(),
			type: 'text',
			width: 200,
			sortable: true,
			cell: CellTags
		},
		{ id: 'description', label: m.col_description(), type: 'text', width: 220 },
		{ id: 'created_at', label: m.col_created_at(), type: 'date', width: 200 },
		{ id: 'created_by', label: m.col_created_by(), type: 'text', width: 200 },
		{ id: 'active', label: m.col_active(), type: 'bool', width: 120, align: 'center' },
		{ id: 'id', label: 'ID', type: 'number', width: 80 }
	]);

	const shortcuts = $derived<Shortcut[]>([
		{
			kind: 'multi-select',
			id: 'created_by',
			label: m.col_created_by(),
			icon: UserIcon,
			field: 'created_by',
			options: creatorOptions
		},
		{
			kind: 'multi-select',
			id: 'tags',
			label: m.event_tags_label(),
			icon: TagIcon,
			field: 'tags',
			options: tagOptions
		},
		{
			kind: 'multi-select',
			id: 'active',
			label: m.col_active(),
			icon: ZapIcon,
			field: 'active',
			options: boolOptions,
			searchable: false
		},
		{ kind: 'date-range', id: 'created_at', label: m.col_created_at(), field: 'created_at' }
	]);

	function handleCreate() {
		console.log('create fan action');
	}

	function editAction(action: FanAction) {
		goto(`/fan-action/${action.id}/settings`);
	}

	function copyAction(action: FanAction) {
		console.log('copy', action.id);
	}

	function showDetail(action: FanAction) {
		console.log('detail', action.id);
	}

	function deleteAction(action: FanAction) {
		console.log('delete', action.id);
	}
</script>

<PageHeader separator {breadcrumbs}>
	<Button size="sm" onclick={handleCreate}>
		<PlusIcon />
		{m.add_record()}
	</Button>
</PageHeader>

<TablePage
	queryKey="fan-actions"
	{columns}
	{shortcuts}
	fetcher={fetchFanActions}
	search={{
		placeholder: m.col_event(),
		fields: ['event', 'description', 'created_by']
	}}
	defaultSort={{ id: 'created_at', desc: true }}
	click={{ href: (action) => `/fan-action/${action.id}/settings` }}
	getRowId={(action) => String(action.id)}
	{rowActions}
	rowActionsTitle={(action) => action.event}
/>

{#snippet rowActions(action: FanAction, { Item, Separator }: ActionWrap)}
	<Item onSelect={() => editAction(action)}>
		<PencilIcon />
		{m.reply_email_edit()}
	</Item>
	<Item onSelect={() => copyAction(action)}>
		<CopyIcon />
		{m.event_dialog_copy_submit()}
	</Item>
	<Item onSelect={() => showDetail(action)}>
		<EyeIcon />
		{m.event_detail()}
	</Item>
	<Separator />
	<Item onSelect={() => deleteAction(action)} class="text-destructive focus:text-destructive">
		<TrashIcon />
		{m.event_dialog_delete_submit()}
	</Item>
{/snippet}
