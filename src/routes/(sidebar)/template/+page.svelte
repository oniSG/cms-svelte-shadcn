<script lang="ts">
	import TagIcon from '@lucide/svelte/icons/tag';
	import UserIcon from '@lucide/svelte/icons/user';
	import ZapIcon from '@lucide/svelte/icons/zap';
	import ArchiveIcon from '@lucide/svelte/icons/archive';
	import ArchiveRestoreIcon from '@lucide/svelte/icons/archive-restore';
	import PlusIcon from '@lucide/svelte/icons/plus';
	import PencilIcon from '@lucide/svelte/icons/pencil';
	import TrashIcon from '@lucide/svelte/icons/trash-2';
	import CopyIcon from '@lucide/svelte/icons/copy';
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
		commonTemplateTags,
		TEMPLATE_LIMITS,
		type Template,
		type TemplateFormValues
	} from './template';
	import {
		addTemplate,
		data as templateData,
		deleteTemplate,
		deleteTemplates,
		setArchived,
		updateTemplate
	} from './temp/data';
	import { fetchTemplates } from './temp/api';
	import TemplateFormSheet from './components/template-form-sheet.svelte';
	import PageHeader from '$lib/components/custom/sidebar/page-header.svelte';
	import * as m from '$lib/paraglide/messages.js';

	const QUERY_KEY = 'templates';
	const queryClient = useQueryClient();

	const breadcrumbs = $derived([
		{ title: m.crumb_home(), url: '/' as const },
		{ title: m.sidebar_module_fans() },
		{ title: m.nav_fans_templates() }
	]);

	const tagOptions = commonTemplateTags.map((t) => ({ value: t, label: t }));
	const boolOptions = $derived([
		{ value: 'true', label: m.common_yes() },
		{ value: 'false', label: m.common_no() }
	]);
	const creatorOptions = $derived(
		Array.from(new Set(templateData.map((t) => t.created_by)))
			.sort((a, b) => a.localeCompare(b))
			.map((s) => ({ value: s, label: s }))
	);

	const columns = $derived<TableColumn<Template>[]>([
		{ id: 'name', label: 'Name', type: 'text', width: 240 },
		{ id: 'created_by', label: 'Created by', type: 'text', width: 200 },
		{
			id: 'tags',
			label: 'Tags',
			type: 'text',
			width: 240,
			sortable: false,
			cell: CellTags
		},
		{ id: 'created_at', label: 'Created', type: 'date', width: 180 },
		{
			id: 'description',
			label: 'Description',
			type: 'text',
			width: 260,
			accessor: (t) => t.description
		},
		{ id: 'active', label: 'Active', type: 'bool', width: 100, align: 'center' },
		{ id: 'archived', label: 'Archived', type: 'bool', width: 110, align: 'center' }
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
			id: 'active',
			label: 'Active',
			icon: ZapIcon,
			field: 'active',
			options: boolOptions,
			searchable: false
		},
		{
			kind: 'multi-select',
			id: 'archived',
			label: 'Archived',
			icon: ArchiveIcon,
			field: 'archived',
			options: boolOptions,
			searchable: false
		},
		{
			kind: 'multi-select',
			id: 'created_by',
			label: 'Created by',
			icon: UserIcon,
			field: 'created_by',
			options: creatorOptions,
			defaultHidden: true
		},
		{ kind: 'date-range', id: 'created_at', label: 'Created', field: 'created_at' }
	]);

	let formOpen = $state(false);
	let editingTemplate = $state<Template | undefined>(undefined);

	let deleteOpen = $state(false);
	let deletingTemplate = $state<Template | undefined>(undefined);

	let bulkDeleteOpen = $state(false);
	let bulkDeleteIds = $state<string[]>([]);

	function invalidate() {
		queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
	}

	function isNameTaken(name: string): boolean {
		const target = name.trim().toLowerCase();
		return templateData.some((t) => t.name.trim().toLowerCase() === target);
	}

	function openCreate() {
		if (templateData.length >= TEMPLATE_LIMITS.maxTemplates) {
			toast.error(
				`Template limit reached (${TEMPLATE_LIMITS.maxTemplates}). Delete some templates first.`
			);
			return;
		}
		editingTemplate = undefined;
		formOpen = true;
	}

	function openEdit(t: Template) {
		editingTemplate = t;
		formOpen = true;
	}

	function openDelete(t: Template) {
		deletingTemplate = t;
		deleteOpen = true;
	}

	function openBulkDelete(ids: string[]) {
		bulkDeleteIds = ids;
		bulkDeleteOpen = true;
	}

	function handleSave(input: TemplateFormValues) {
		if (editingTemplate) {
			updateTemplate(editingTemplate.id, input);
			toast.success(`Template "${input.name}" updated`);
		} else {
			addTemplate(input);
			toast.success(`Template "${input.name}" created`);
		}
		editingTemplate = undefined;
		invalidate();
	}

	function handleConfirmDelete() {
		if (!deletingTemplate) return;
		const name = deletingTemplate.name;
		deleteTemplate(deletingTemplate.id);
		deletingTemplate = undefined;
		invalidate();
		toast.success(`Template "${name}" deleted`);
	}

	function handleConfirmBulkDelete() {
		const removed = deleteTemplates(bulkDeleteIds);
		bulkDeleteIds = [];
		invalidate();
		toast.success(`${removed} template${removed === 1 ? '' : 's'} deleted`);
	}

	function handleDuplicate(t: Template) {
		const base = `${t.name} (copy)`;
		let candidate = base;
		let i = 2;
		while (isNameTaken(candidate)) {
			candidate = `${base} ${i++}`;
		}
		addTemplate({
			name: candidate,
			description: t.description,
			tags: t.tags,
			active: t.active,
			auto_save: t.auto_save,
			auto_translate: t.auto_translate
		});
		invalidate();
		toast.success(`Duplicated as "${candidate}"`);
	}

	function handleToggleArchive(t: Template) {
		setArchived(t.id, !t.archived);
		invalidate();
		toast.success(t.archived ? `"${t.name}" restored` : `"${t.name}" archived`);
	}
</script>

<PageHeader separator {breadcrumbs}>
	<Button size="sm" onclick={openCreate}>
		<PlusIcon />
		Create template
	</Button>
</PageHeader>

<TablePage
	queryKey={QUERY_KEY}
	{columns}
	{shortcuts}
	fetcher={fetchTemplates}
	search={{
		placeholder: 'Search templates',
		fields: ['name', 'description', 'created_by']
	}}
	defaultSort={{ id: 'created_at', desc: true }}
	click={{ onClick: openEdit }}
	{rowActions}
	rowActionsTitle={(t) => t.name}
	selectable
	onDeleteSelected={openBulkDelete}
/>

<TemplateFormSheet
	bind:open={formOpen}
	template={editingTemplate}
	{isNameTaken}
	onSave={handleSave}
/>

<DeleteDialog
	bind:open={deleteOpen}
	title="Delete template"
	description={deletingTemplate
		? `Are you sure you want to delete "${deletingTemplate.name}"? This action cannot be undone.`
		: ''}
	onConfirm={handleConfirmDelete}
/>

<DeleteDialog
	bind:open={bulkDeleteOpen}
	title="Delete templates"
	description={`Are you sure you want to delete ${bulkDeleteIds.length} template${bulkDeleteIds.length === 1 ? '' : 's'}? This action cannot be undone.`}
	confirmLabel="Delete all"
	onConfirm={handleConfirmBulkDelete}
/>

{#snippet rowActions(t: Template, { Item, Separator }: ActionWrap)}
	<Item onSelect={() => openEdit(t)}>
		<PencilIcon />
		Edit
	</Item>
	<Item onSelect={() => handleDuplicate(t)}>
		<CopyIcon />
		Duplicate
	</Item>
	<Item onSelect={() => handleToggleArchive(t)}>
		{#if t.archived}
			<ArchiveRestoreIcon />
			Restore
		{:else}
			<ArchiveIcon />
			Archive
		{/if}
	</Item>
	<Separator />
	<Item onSelect={() => openDelete(t)} class="text-destructive focus:text-destructive">
		<TrashIcon />
		Delete
	</Item>
{/snippet}
