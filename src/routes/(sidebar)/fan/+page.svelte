<script lang="ts">
	import TagIcon from '@lucide/svelte/icons/tag';
	import ZapIcon from '@lucide/svelte/icons/zap';
	import TargetIcon from '@lucide/svelte/icons/target';
	import PlusIcon from '@lucide/svelte/icons/plus';
	import UploadIcon from '@lucide/svelte/icons/upload';
	import PencilIcon from '@lucide/svelte/icons/pencil';
	import MailIcon from '@lucide/svelte/icons/mail';
	import TrashIcon from '@lucide/svelte/icons/trash-2';
	import { Button } from '$lib/components/ui/button';
	import {
		CellBadge,
		CellTags,
		TablePage,
		type ActionWrap,
		type Shortcut,
		type TableColumn
	} from '$lib/components/custom/table-page';
	import { allSources, allTags, type Fan } from './fan';
	import { fetchFans } from './temp/api';
	import FanDrawer from './components/fan-drawer.svelte';
	import PageHeader from '$lib/components/custom/sidebar/page-header.svelte';
	import * as m from '$lib/paraglide/messages.js';

	const breadcrumbs = $derived([
		{ title: m.crumb_home(), url: '/' as const },
		{ title: m.sidebar_module_fans() },
		{ title: m.fans_crumb_visitors() }
	]);

	const tagOptions = allTags.map((t) => ({ value: t, label: t }));
	const sourceOptions = allSources.map((s) => ({ value: s, label: s }));
	const boolOptions = $derived([
		{ value: 'true', label: m.common_yes() },
		{ value: 'false', label: m.common_no() }
	]);

	const columns = $derived<TableColumn<Fan>[]>([
		{ id: 'surname', label: m.fans_col_surname(), type: 'text', width: 160 },
		{ id: 'first_name', label: m.fans_col_first_name(), type: 'text', width: 160 },
		{ id: 'email', label: m.fans_col_email(), type: 'text', width: 260 },
		{
			id: 'phone',
			label: m.fans_col_phone(),
			type: 'text',
			width: 180,
			accessor: (f) => f.phone ?? ''
		},
		{
			id: 'city',
			label: m.fans_col_city(),
			type: 'text',
			width: 160,
			accessor: (f) => f.city ?? ''
		},
		{
			id: 'tags',
			label: m.fans_col_tags(),
			type: 'text',
			width: 220,
			sortable: true,
			cell: CellTags
		},
		{
			id: 'registration_source',
			label: m.fans_col_source(),
			type: 'select',
			options: sourceOptions,
			searchable: true,
			width: 180,
			cell: CellBadge
		},
		{
			id: 'partner',
			label: m.fans_col_partner(),
			type: 'text',
			width: 200,
			accessor: (f) => f.partner ?? ''
		},
		{
			id: 'segment_match',
			label: m.fans_col_in_segment(),
			type: 'bool',
			width: 110,
			align: 'center'
		},
		{ id: 'date_added', label: m.fans_col_date_added(), type: 'date', width: 200 },
		{ id: 'id', label: m.fans_col_id(), type: 'text', width: 110 }
	]);

	const shortcuts = $derived<Shortcut[]>([
		{
			kind: 'multi-select',
			id: 'tags',
			label: m.fans_col_tags(),
			icon: TagIcon,
			field: 'tags',
			options: tagOptions
		},
		{
			kind: 'multi-select',
			id: 'source',
			label: m.fans_col_source(),
			icon: ZapIcon,
			field: 'registration_source',
			options: sourceOptions,
			searchable: false
		},
		{
			kind: 'multi-select',
			id: 'segment',
			label: m.fans_col_in_segment(),
			icon: TargetIcon,
			field: 'segment_match',
			options: boolOptions,
			searchable: false
		},
		{ kind: 'date-range', id: 'date_added', label: m.fans_shortcut_added(), field: 'date_added' }
	]);

	function handleCreate() {
		console.log('create visitor');
	}

	function handleImport() {
		console.log('import visitors');
	}

	function editFan(f: Fan) {
		console.log('edit', f.id);
	}

	function emailFan(f: Fan) {
		console.log('email', f.id);
	}

	function deleteFan(f: Fan) {
		console.log('delete', f.id);
	}
</script>

<PageHeader separator {breadcrumbs}>
	<Button variant="outline" size="sm" onclick={handleImport}>
		<UploadIcon />
		{m.common_import()}
	</Button>
	<Button size="sm" onclick={handleCreate}>
		<PlusIcon />
		{m.fans_create_visitor()}
	</Button>
</PageHeader>

<TablePage
	queryKey="fans"
	{columns}
	{shortcuts}
	fetcher={fetchFans}
	search={{
		placeholder: m.fans_search_placeholder(),
		fields: ['surname', 'first_name', 'email', 'phone', 'city', 'partner', 'id']
	}}
	defaultSort={{ id: 'surname', desc: false }}
	click={{ drawer: fanDrawer }}
	{rowActions}
	rowActionsTitle={(f) => `${f.first_name} ${f.surname}`}
	selectable
	selectionActions={[
		{ label: m.common_edit(), icon: PencilIcon, onClick: (ids) => console.log('bulk edit', ids) }
	]}
	onDeleteSelected={(ids) => console.log('bulk delete', ids)}
/>

{#snippet fanDrawer(fan: Fan)}
	<FanDrawer {fan} />
{/snippet}

{#snippet rowActions(fan: Fan, { Item, Separator }: ActionWrap)}
	<Item onSelect={() => editFan(fan)}>
		<PencilIcon />
		{m.common_edit()}
	</Item>
	<Item onSelect={() => emailFan(fan)}>
		<MailIcon />
		{m.fans_send_email()}
	</Item>
	<Separator />
	<Item onSelect={() => deleteFan(fan)} class="text-destructive focus:text-destructive">
		<TrashIcon />
		{m.common_delete()}
	</Item>
{/snippet}
