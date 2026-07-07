<script lang="ts">
	import ShapesIcon from '@lucide/svelte/icons/shapes';
	import FolderIcon from '@lucide/svelte/icons/folder';
	import ZapIcon from '@lucide/svelte/icons/zap';
	import Building2Icon from '@lucide/svelte/icons/building-2';
	import PlusIcon from '@lucide/svelte/icons/plus';
	import PencilIcon from '@lucide/svelte/icons/pencil';
	import TrashIcon from '@lucide/svelte/icons/trash-2';
	import FolderCogIcon from '@lucide/svelte/icons/folder-cog';
	import { useQueryClient } from '@tanstack/svelte-query';
	import { toast } from 'svelte-sonner';
	import { Button } from '$lib/components/ui/button';
	import DeleteDialog from '$lib/components/custom/delete-dialog.svelte';
	import {
		CellBadge,
		TablePage,
		type ActionWrap,
		type Shortcut,
		type TableColumn
	} from '$lib/components/custom/table-page';
	import {
		allFieldTypes,
		CA_LIMITS,
		fieldTypeLabels,
		formatDefaultValue,
		type CAFormValues,
		type CustomAttribute
	} from './custom-attribute';
	import { groupsState } from './groups.svelte.js';
	import { addCA, data as caData, deleteCA, deleteCAs, updateCA } from './temp/data';
	import { fetchCustomAttributes } from './temp/api';
	import CustomAttributeFormSheet from './components/custom-attribute-form-sheet.svelte';
	import GroupsManageSheet from './components/groups-manage-sheet.svelte';
	import PageHeader from '$lib/components/custom/sidebar/page-header.svelte';
	import * as m from '$lib/paraglide/messages.js';

	const QUERY_KEY = 'custom-attributes';
	const queryClient = useQueryClient();

	const breadcrumbs = $derived([
		{ title: m.crumb_home(), url: '/' as const },
		{ title: m.sidebar_module_settings() },
		{ title: m.nav_set_fans_custom_visitor_field() }
	]);

	const fieldTypeOptions = allFieldTypes.map((t) => ({ value: t, label: fieldTypeLabels[t] }));
	const groupOptions = $derived(groupsState.list.map((s) => ({ value: s, label: s })));
	const boolOptions = $derived([
		{ value: 'true', label: m.common_yes() },
		{ value: 'false', label: m.common_no() }
	]);

	const columns = $derived<TableColumn<CustomAttribute>[]>([
		{ id: 'name', label: 'Field name', type: 'text', width: 220 },
		{
			id: 'api_key',
			label: 'API key',
			type: 'text',
			width: 220,
			accessor: (a) => a.api_key
		},
		{
			id: 'field_type',
			label: 'Field type',
			type: 'select',
			options: fieldTypeOptions,
			searchable: true,
			width: 160,
			cell: CellBadge,
			accessor: (a) => fieldTypeLabels[a.field_type]
		},
		{
			id: 'group',
			label: 'Group',
			type: 'select',
			options: groupOptions,
			searchable: true,
			width: 200,
			accessor: (a) => a.group
		},
		{
			id: 'default_value',
			label: 'Default value',
			type: 'text',
			width: 200,
			accessor: (a) => formatDefaultValue(a)
		},
		{ id: 'all_clubs', label: 'All clubs', type: 'bool', width: 110, align: 'center' },
		{ id: 'active', label: 'Active', type: 'bool', width: 110, align: 'center' },
		{ id: 'created_at', label: 'Created', type: 'date', width: 200 }
	]);

	const shortcuts = $derived<Shortcut[]>([
		{
			kind: 'multi-select',
			id: 'field_type',
			label: 'Field type',
			icon: ShapesIcon,
			field: 'field_type',
			options: fieldTypeOptions
		},
		{
			kind: 'multi-select',
			id: 'group',
			label: 'Group',
			icon: FolderIcon,
			field: 'group',
			options: groupOptions
		},
		{
			kind: 'multi-select',
			id: 'active',
			label: 'Active',
			icon: ZapIcon,
			field: 'active',
			options: boolOptions,
			searchable: false
		},
		{
			kind: 'multi-select',
			id: 'all_clubs',
			label: 'All clubs',
			icon: Building2Icon,
			field: 'all_clubs',
			options: boolOptions,
			searchable: false,
			defaultHidden: true
		},
		{ kind: 'date-range', id: 'created_at', label: 'Created', field: 'created_at' }
	]);

	let formOpen = $state(false);
	let editingAttr = $state<CustomAttribute | undefined>(undefined);

	let deleteOpen = $state(false);
	let deletingAttr = $state<CustomAttribute | undefined>(undefined);

	let bulkDeleteOpen = $state(false);
	let bulkDeleteIds = $state<string[]>([]);

	let groupsOpen = $state(false);

	function invalidate() {
		queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
	}

	function isNameTaken(name: string): boolean {
		const target = name.trim().toLowerCase();
		return caData.some((a) => a.name.trim().toLowerCase() === target);
	}

	function isApiKeyTaken(key: string): boolean {
		const target = key.trim().toLowerCase();
		return caData.some((a) => a.api_key.trim().toLowerCase() === target);
	}

	function openCreate() {
		if (caData.length >= CA_LIMITS.maxAttributes) {
			toast.error(
				`Custom field limit reached (${CA_LIMITS.maxAttributes}). Delete some fields first.`
			);
			return;
		}
		editingAttr = undefined;
		formOpen = true;
	}

	function openEdit(attr: CustomAttribute) {
		editingAttr = attr;
		formOpen = true;
	}

	function openDelete(attr: CustomAttribute) {
		deletingAttr = attr;
		deleteOpen = true;
	}

	function openBulkDelete(ids: string[]) {
		bulkDeleteIds = ids;
		bulkDeleteOpen = true;
	}

	function handleSave(input: CAFormValues) {
		if (editingAttr) {
			updateCA(editingAttr.id, input);
			toast.success(`Field "${input.name}" updated`);
		} else {
			addCA(input);
			toast.success(`Field "${input.name}" created`);
		}
		editingAttr = undefined;
		invalidate();
	}

	function handleConfirmDelete() {
		if (!deletingAttr) return;
		const name = deletingAttr.name;
		deleteCA(deletingAttr.id);
		deletingAttr = undefined;
		invalidate();
		toast.success(`Field "${name}" deleted`);
	}

	function handleConfirmBulkDelete() {
		const removed = deleteCAs(bulkDeleteIds);
		bulkDeleteIds = [];
		invalidate();
		toast.success(`${removed} field${removed === 1 ? '' : 's'} deleted`);
	}
</script>

<PageHeader separator {breadcrumbs}>
	<Button size="sm" variant="outline" onclick={() => (groupsOpen = true)}>
		<FolderCogIcon />
		Manage groups
	</Button>
	<Button size="sm" onclick={openCreate}>
		<PlusIcon />
		Create custom field
	</Button>
</PageHeader>

<TablePage
	queryKey={QUERY_KEY}
	{columns}
	{shortcuts}
	fetcher={fetchCustomAttributes}
	search={{
		placeholder: 'Search custom fields',
		fields: ['name', 'api_key', 'group', 'field_type', 'default_value']
	}}
	defaultSort={{ id: 'name', desc: false }}
	click={{ onClick: openEdit }}
	{rowActions}
	rowActionsTitle={(a) => a.name}
	selectable
	onDeleteSelected={openBulkDelete}
/>

<CustomAttributeFormSheet
	bind:open={formOpen}
	attr={editingAttr}
	{isNameTaken}
	{isApiKeyTaken}
	onSave={handleSave}
/>

<GroupsManageSheet bind:open={groupsOpen} onChange={invalidate} />

<DeleteDialog
	bind:open={deleteOpen}
	title="Delete custom field"
	description={deletingAttr
		? `Are you sure you want to delete "${deletingAttr.name}"? This action cannot be undone.`
		: ''}
	onConfirm={handleConfirmDelete}
/>

<DeleteDialog
	bind:open={bulkDeleteOpen}
	title="Delete custom fields"
	description={`Are you sure you want to delete ${bulkDeleteIds.length} field${bulkDeleteIds.length === 1 ? '' : 's'}? This action cannot be undone.`}
	confirmLabel="Delete all"
	onConfirm={handleConfirmBulkDelete}
/>

{#snippet rowActions(a: CustomAttribute, { Item, Separator }: ActionWrap)}
	<Item onSelect={() => openEdit(a)}>
		<PencilIcon />
		Edit
	</Item>
	<Separator />
	<Item onSelect={() => openDelete(a)} class="text-destructive focus:text-destructive">
		<TrashIcon />
		Delete
	</Item>
{/snippet}
