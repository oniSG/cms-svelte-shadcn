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

	const breadcrumbs = [
		{ title: 'Home', url: '/' as const },
		{ title: 'Fans' },
		{ title: 'Visitors' }
	];

	const tagOptions = allTags.map((t) => ({ value: t, label: t }));
	const sourceOptions = allSources.map((s) => ({ value: s, label: s }));
	const boolOptions = [
		{ value: 'true', label: 'Yes' },
		{ value: 'false', label: 'No' }
	];

	const columns: TableColumn<Fan>[] = [
		{ id: 'surname', label: 'Surname', type: 'text', width: 160 },
		{ id: 'first_name', label: 'First name', type: 'text', width: 160 },
		{ id: 'email', label: 'E-mail', type: 'text', width: 260 },
		{ id: 'phone', label: 'Phone', type: 'text', width: 180, accessor: (f) => f.phone ?? '' },
		{ id: 'city', label: 'City', type: 'text', width: 160, accessor: (f) => f.city ?? '' },
		{ id: 'tags', label: 'Tags', type: 'text', width: 220, sortable: true, cell: CellTags },
		{
			id: 'registration_source',
			label: 'Source',
			type: 'select',
			options: sourceOptions,
			searchable: true,
			width: 180,
			cell: CellBadge
		},
		{ id: 'partner', label: 'Partner', type: 'text', width: 200, accessor: (f) => f.partner ?? '' },
		{ id: 'segment_match', label: 'In segment', type: 'bool', width: 110, align: 'center' },
		{ id: 'date_added', label: 'Date added', type: 'date', width: 200 },
		{ id: 'id', label: 'ID', type: 'text', width: 110 }
	];

	const shortcuts: Shortcut[] = [
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
			id: 'source',
			label: 'Source',
			icon: ZapIcon,
			field: 'registration_source',
			options: sourceOptions,
			searchable: false
		},
		{
			kind: 'multi-select',
			id: 'segment',
			label: 'In segment',
			icon: TargetIcon,
			field: 'segment_match',
			options: boolOptions,
			searchable: false
		},
		{ kind: 'date-range', id: 'date_added', label: 'Added', field: 'date_added' }
	];

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
		Import
	</Button>
	<Button size="sm" onclick={handleCreate}>
		<PlusIcon />
		Create visitor
	</Button>
</PageHeader>

<TablePage
	queryKey="fans"
	{columns}
	{shortcuts}
	fetcher={fetchFans}
	search={{
		placeholder: 'Search visitors',
		fields: ['surname', 'first_name', 'email', 'phone', 'city', 'partner', 'id']
	}}
	defaultSort={{ id: 'surname', desc: false }}
	click={{ drawer: fanDrawer }}
	{rowActions}
	rowActionsTitle={(f) => `${f.first_name} ${f.surname}`}
	selectable
	selectionActions={[
		{ label: 'Edit', icon: PencilIcon, onClick: (ids) => console.log('bulk edit', ids) }
	]}
	onDeleteSelected={(ids) => console.log('bulk delete', ids)}
/>

{#snippet fanDrawer(fan: Fan)}
	<FanDrawer {fan} />
{/snippet}

{#snippet rowActions(fan: Fan, { Item, Separator }: ActionWrap)}
	<Item onSelect={() => editFan(fan)}>
		<PencilIcon />
		Edit
	</Item>
	<Item onSelect={() => emailFan(fan)}>
		<MailIcon />
		Send e-mail
	</Item>
	<Separator />
	<Item onSelect={() => deleteFan(fan)} class="text-destructive focus:text-destructive">
		<TrashIcon />
		Delete
	</Item>
{/snippet}
