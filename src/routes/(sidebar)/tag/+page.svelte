<script lang="ts">
	import PaletteIcon from '@lucide/svelte/icons/palette';
	import ZapIcon from '@lucide/svelte/icons/zap';
	import PlusIcon from '@lucide/svelte/icons/plus';
	import PencilIcon from '@lucide/svelte/icons/pencil';
	import TrashIcon from '@lucide/svelte/icons/trash-2';
	import InfoIcon from '@lucide/svelte/icons/info';
	import { useQueryClient } from '@tanstack/svelte-query';
	import { toast } from 'svelte-sonner';
	import { Button } from '$lib/components/ui/button';
	import DeleteDialog from '$lib/components/custom/delete-dialog.svelte';
	import {
		TablePage,
		type ActionWrap,
		type Shortcut,
		type TableColumn
	} from '$lib/components/custom/table-page';
	import { allColors, colorLabels, TAG_LIMITS, type Tag, type TagFormValues } from './tag';
	import { addTag, data as tagData, deleteTag, deleteTags, updateTag } from './temp/data';
	import { fetchTags } from './temp/api';
	import CellTagColor from './components/cell-tag-color.svelte';
	import TagFormSheet from './components/tag-form-sheet.svelte';
	import PageHeader from '$lib/components/custom/sidebar/page-header.svelte';
	import * as m from '$lib/paraglide/messages.js';
	import * as Sheet from '$lib/components/ui/sheet/index.js';

	const QUERY_KEY = 'tags';
	const queryClient = useQueryClient();

	const breadcrumbs = $derived([
		{ title: m.crumb_home(), url: '/' as const },
		{ title: m.sidebar_module_settings() },
		{ title: m.nav_set_tags() }
	]);

	const colorOptions = allColors.map((c) => ({ value: c, label: colorLabels[c] }));
	const boolOptions = $derived([
		{ value: 'true', label: m.common_yes() },
		{ value: 'false', label: m.common_no() }
	]);

	const columns = $derived<TableColumn<Tag>[]>([
		{ id: 'name', label: 'Name', type: 'text', width: 260 },
		{
			id: 'color',
			label: 'Color',
			type: 'select',
			options: colorOptions,
			searchable: true,
			width: 260,
			sortable: true,
			cell: CellTagColor
		},
		{ id: 'active', label: 'Active', type: 'bool', width: 110, align: 'center' },
		{ id: 'created_at', label: 'Created', type: 'date', width: 200 }
	]);

	const shortcuts = $derived<Shortcut[]>([
		{
			kind: 'multi-select',
			id: 'color',
			label: 'Color',
			icon: PaletteIcon,
			field: 'color',
			options: colorOptions
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
		{ kind: 'date-range', id: 'created_at', label: 'Created', field: 'created_at' }
	]);

	let formOpen = $state(false);
	let editingTag = $state<Tag | undefined>(undefined);

	let deleteOpen = $state(false);
	let deletingTag = $state<Tag | undefined>(undefined);

	let bulkDeleteOpen = $state(false);
	let bulkDeleteIds = $state<string[]>([]);

	function invalidate() {
		queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
	}

	function isNameTaken(name: string): boolean {
		const target = name.trim().toLowerCase();
		return tagData.some((t) => t.name.trim().toLowerCase() === target);
	}

	function openCreate() {
		if (tagData.length >= TAG_LIMITS.maxTags) {
			toast.error(`Tag limit reached (${TAG_LIMITS.maxTags}). Delete some tags first.`);
			return;
		}
		editingTag = undefined;
		formOpen = true;
	}

	function openEdit(tag: Tag) {
		editingTag = tag;
		formOpen = true;
	}

	function openDelete(tag: Tag) {
		deletingTag = tag;
		deleteOpen = true;
	}

	function openBulkDelete(ids: string[]) {
		bulkDeleteIds = ids;
		bulkDeleteOpen = true;
	}

	function handleSave(input: TagFormValues) {
		if (editingTag) {
			updateTag(editingTag.id, input);
			toast.success(`Tag "${input.name}" updated`);
		} else {
			addTag(input);
			toast.success(`Tag "${input.name}" created`);
		}
		editingTag = undefined;
		invalidate();
	}

	function handleConfirmDelete() {
		if (!deletingTag) return;
		const name = deletingTag.name;
		deleteTag(deletingTag.id);
		deletingTag = undefined;
		invalidate();
		toast.success(`Tag "${name}" deleted`);
	}

	function handleConfirmBulkDelete() {
		const removed = deleteTags(bulkDeleteIds);
		bulkDeleteIds = [];
		invalidate();
		toast.success(`${removed} tag${removed === 1 ? '' : 's'} deleted`);
	}
</script>

<PageHeader separator {breadcrumbs}>
	<Sheet.Root>
		<Sheet.Trigger>
			{#snippet child({ props })}
				<Button {...props} variant="outline" size="icon">
					<InfoIcon />
				</Button>
			{/snippet}
		</Sheet.Trigger>
		<Sheet.Content>
			<div
				class="prose prose-sm min-h-0 flex-1 overflow-y-auto px-6 py-6 dark:prose-invert prose-code:before:content-none prose-code:after:content-none"
			>
				<h2>{m.domain_drawer_title()}</h2>
				<p>{m.domain_drawer_sending_domain_body()}</p>

				<h2>{m.domain_drawer_dns_title()}</h2>
				<p>{m.domain_drawer_dns_body()}</p>

				<h3>DKIM — DomainKeys Identified Mail</h3>
				<p>{m.domain_drawer_dkim_body()}</p>
				<ol>
					<li>{m.domain_drawer_dkim_step1()}</li>
					<li>{m.domain_drawer_dkim_step2()}</li>
					<li>{m.domain_drawer_dkim_step3()}</li>
				</ol>

				<h3>DMARC — Domain-based Message Authentication</h3>
				<p>{m.domain_drawer_dmarc_body()}</p>
				<p>{m.domain_drawer_dmarc_minimal()}</p>
				<pre><code>v=DMARC1; p=none; rua=mailto:dmarc@yourdomain.com</code></pre>
				<p>{m.domain_drawer_dmarc_tighten()}</p>

				<h3>SPF — Sender Policy Framework</h3>
				<p>{m.domain_drawer_spf_body()}</p>

				<h2>{m.domain_drawer_troubleshooting_title()}</h2>
				<ul>
					<li>{m.domain_drawer_trouble_not_found()}</li>
					<li>{m.domain_drawer_trouble_unverified()}</li>
					<li>{m.domain_drawer_trouble_spf()}</li>
				</ul>
			</div>
		</Sheet.Content>
	</Sheet.Root>
	<Button size="sm" onclick={openCreate}>
		<PlusIcon />
		Create tag
	</Button>
</PageHeader>

<TablePage
	queryKey={QUERY_KEY}
	{columns}
	{shortcuts}
	fetcher={fetchTags}
	search={{
		placeholder: 'Search tags',
		fields: ['name']
	}}
	defaultSort={{ id: 'name', desc: false }}
	click={{ onClick: openEdit }}
	{rowActions}
	rowActionsTitle={(t) => t.name}
	selectable
	onDeleteSelected={openBulkDelete}
/>

<TagFormSheet bind:open={formOpen} tag={editingTag} {isNameTaken} onSave={handleSave} />

<DeleteDialog
	bind:open={deleteOpen}
	title="Delete tag"
	description={deletingTag
		? `Are you sure you want to delete "${deletingTag.name}"? This action cannot be undone.`
		: ''}
	onConfirm={handleConfirmDelete}
/>

<DeleteDialog
	bind:open={bulkDeleteOpen}
	title="Delete tags"
	description={`Are you sure you want to delete ${bulkDeleteIds.length} tag${bulkDeleteIds.length === 1 ? '' : 's'}? This action cannot be undone.`}
	confirmLabel="Delete all"
	onConfirm={handleConfirmBulkDelete}
/>

{#snippet rowActions(t: Tag, { Item, Separator }: ActionWrap)}
	<Item onSelect={() => openEdit(t)}>
		<PencilIcon />
		Edit
	</Item>
	<Separator />
	<Item onSelect={() => openDelete(t)} class="text-destructive focus:text-destructive">
		<TrashIcon />
		Delete
	</Item>
{/snippet}
