<script lang="ts">
	import TagIcon from '@lucide/svelte/icons/tag';
	import ShieldCheckIcon from '@lucide/svelte/icons/shield-check';
	import ZapIcon from '@lucide/svelte/icons/zap';
	import PlusIcon from '@lucide/svelte/icons/plus';
	import PencilIcon from '@lucide/svelte/icons/pencil';
	import KeyIcon from '@lucide/svelte/icons/key';
	import TrashIcon from '@lucide/svelte/icons/trash-2';
	import { Button } from '$lib/components/ui/button';
	import {
		CellTags,
		TablePage,
		type ActionWrap,
		type Shortcut,
		type TableColumn
	} from '$lib/components/custom/table-page';
	import { allTags, type User } from './user';
	import { fetchUsers } from './temp/api';
	import UserDrawer from './components/user-drawer.svelte';
	import PageHeader from '$lib/components/custom/sidebar/page-header.svelte';

	const breadcrumbs = [
		{ title: 'Home', url: '/' as const },
		{ title: 'Settings' },
		{ title: 'Users & access' },
		{ title: 'Users' }
	];

	const tagOptions = allTags.map((t) => ({ value: t, label: t }));
	const boolOptions = [
		{ value: 'true', label: 'Yes' },
		{ value: 'false', label: 'No' }
	];

	const columns: TableColumn<User>[] = [
		{ id: 'surname', label: 'Surname', type: 'text', width: 180 },
		{ id: 'first_name', label: 'First name', type: 'text', width: 180 },
		{ id: 'email', label: 'E-mail', type: 'text', width: 280 },
		{
			id: 'phone',
			label: 'Phone',
			type: 'text',
			width: 180,
			accessor: (u) => u.phone ?? ''
		},
		{
			id: 'tags',
			label: 'Tags',
			type: 'text',
			width: 260,
			sortable: true,
			cell: CellTags
		},
		{ id: 'last_activity', label: 'Last activity', type: 'date', width: 200 },
		{ id: 'active', label: 'Active', type: 'bool', width: 110, align: 'center' },
		{ id: 'two_fa', label: '2FA', type: 'bool', width: 90, align: 'center' }
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
			id: 'active',
			label: 'Active',
			icon: ZapIcon,
			field: 'active',
			options: boolOptions,
			searchable: false
		},
		{
			kind: 'multi-select',
			id: 'two_fa',
			label: '2FA',
			icon: ShieldCheckIcon,
			field: 'two_fa',
			options: boolOptions,
			searchable: false
		},
		{ kind: 'date-range', id: 'last_activity', label: 'Activity', field: 'last_activity' }
	];

	function handleCreate() {
		console.log('create user');
	}

	function editUser(u: User) {
		console.log('edit', u.id);
	}

	function resetPassword(u: User) {
		console.log('reset password', u.id);
	}

	function deleteUser(u: User) {
		console.log('delete', u.id);
	}
</script>

<PageHeader separator {breadcrumbs}>
	<Button onclick={handleCreate}>
		<PlusIcon />
		Create user
	</Button>
</PageHeader>

<TablePage
	queryKey="users"
	{columns}
	{shortcuts}
	fetcher={fetchUsers}
	search={{
		placeholder: 'Search users',
		fields: ['surname', 'first_name', 'email', 'phone']
	}}
	defaultSort={{ id: 'surname', desc: false }}
	click={{ sheet: userSheet }}
	{rowActions}
	rowActionsTitle={(u) => `${u.first_name} ${u.surname}`}
/>

{#snippet userSheet(user: User)}
	<UserDrawer {user} />
{/snippet}

{#snippet rowActions(user: User, { Item, Separator }: ActionWrap)}
	<Item onSelect={() => editUser(user)}>
		<PencilIcon />
		Edit
	</Item>
	<Item onSelect={() => resetPassword(user)}>
		<KeyIcon />
		Reset password
	</Item>
	<Separator />
	<Item onSelect={() => deleteUser(user)} class="text-destructive focus:text-destructive">
		<TrashIcon />
		Delete
	</Item>
{/snippet}
