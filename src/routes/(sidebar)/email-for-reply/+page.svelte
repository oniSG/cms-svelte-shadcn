<script lang="ts">
	import PageHeader from '$lib/components/custom/sidebar/page-header.svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Table from '$lib/components/ui/table/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import ChevronLeftIcon from '@lucide/svelte/icons/chevron-left';
	import ChevronRightIcon from '@lucide/svelte/icons/chevron-right';
	import * as ButtonGroup from '$lib/components/ui/button-group/index.js';
	import * as ContextMenu from '$lib/components/ui/context-menu/index.js';
	import { Check } from '@lucide/svelte';
	import { X } from '@lucide/svelte';

	import DeleteDialog from './components/data-table-delete-dialog.svelte';
	import EditDialog from './components/data-table-edit-dialog.svelte';
	import AddDialog from './components/data-table-add-dialog.svelte';
	import { Plus } from '@lucide/svelte';
	import * as m from '$lib/paraglide/messages.js';

	let currentPage = $state(1);
	let maxItemsPerPage = $state(10);
	const emails = [
		{ id: 1, email: 'alice757@gmail.com', isActive: 'true' },
		{ id: 2, email: 'alice@gmail.com', isActive: 'true' },
		{ id: 3, email: 'bob@yahoo.com', isActive: 'false' },
		{ id: 4, email: 'carol@outlook.com', isActive: 'true' },
		{ id: 5, email: 'david@example.com', isActive: 'true' },
		{ id: 6, email: 'eve@test.org', isActive: 'false' },
		{ id: 7, email: 'frank@gmail.com', isActive: 'true' },
		{ id: 8, email: 'grace@yahoo.com', isActive: 'false' },
		{ id: 9, email: 'henry@outlook.com', isActive: 'true' },
		{ id: 10, email: 'ivan@example.com', isActive: 'false' },
		{ id: 11, email: 'julia@test.org', isActive: 'true' },
		{ id: 12, email: 'alice1@gmail.com', isActive: 'false' },
		{ id: 13, email: 'bob1@yahoo.com', isActive: 'true' },
		{ id: 14, email: 'carol1@outlook.com', isActive: 'false' },
		{ id: 15, email: 'david1@example.com', isActive: 'true' },
		{ id: 16, email: 'eve1@test.org', isActive: 'true' },
		{ id: 17, email: 'frank1@gmail.com', isActive: 'false' },
		{ id: 18, email: 'grace1@yahoo.com', isActive: 'true' },
		{ id: 19, email: 'henry1@outlook.com', isActive: 'false' },
		{ id: 20, email: 'ivan1@example.com', isActive: 'true' },
		{ id: 21, email: 'julia1@test.org', isActive: 'false' },
		{ id: 22, email: 'alice2@gmail.com', isActive: 'true' },
		{ id: 23, email: 'bob2@yahoo.com', isActive: 'true' },
		{ id: 24, email: 'carol2@outlook.com', isActive: 'false' },
		{ id: 25, email: 'david2@example.com', isActive: 'false' },
		{ id: 26, email: 'eve2@test.org', isActive: 'true' },
		{ id: 27, email: 'frank2@gmail.com', isActive: 'false' },
		{ id: 28, email: 'grace2@yahoo.com', isActive: 'true' },
		{ id: 29, email: 'henry2@outlook.com', isActive: 'true' },
		{ id: 30, email: 'ivan2@example.com', isActive: 'false' },
		{ id: 31, email: 'julia2@test.org', isActive: 'true' },
		{ id: 32, email: 'alice3@gmail.com', isActive: 'false' },
		{ id: 33, email: 'bob3@yahoo.com', isActive: 'true' },
		{ id: 34, email: 'carol3@outlook.com', isActive: 'true' },
		{ id: 35, email: 'david3@example.com', isActive: 'false' },
		{ id: 36, email: 'eve3@test.org', isActive: 'true' },
		{ id: 37, email: 'frank3@gmail.com', isActive: 'true' },
		{ id: 38, email: 'grace3@yahoo.com', isActive: 'false' },
		{ id: 39, email: 'henry3@outlook.com', isActive: 'true' },
		{ id: 40, email: 'ivan3@example.com', isActive: 'false' },
		{ id: 41, email: 'julia3@test.org', isActive: 'false' },
		{ id: 42, email: 'alice4@gmail.com', isActive: 'true' },
		{ id: 43, email: 'bob4@yahoo.com', isActive: 'false' },
		{ id: 44, email: 'carol4@outlook.com', isActive: 'true' },
		{ id: 45, email: 'david4@example.com', isActive: 'true' },
		{ id: 46, email: 'eve4@test.org', isActive: 'false' },
		{ id: 47, email: 'frank4@gmail.com', isActive: 'true' },
		{ id: 48, email: 'grace4@yahoo.com', isActive: 'true' },
		{ id: 49, email: 'henry4@outlook.com', isActive: 'false' },
		{ id: 50, email: 'ivan4@example.com', isActive: 'true' },
		{ id: 51, email: 'julia4@test.org', isActive: 'false' },
		{ id: 52, email: 'alice5@gmail.com', isActive: 'false' },
		{ id: 53, email: 'bob5@yahoo.com', isActive: 'true' },
		{ id: 54, email: 'carol5@outlook.com', isActive: 'false' },
		{ id: 55, email: 'david5@example.com', isActive: 'true' },
		{ id: 56, email: 'eve5@test.org', isActive: 'true' },
		{ id: 57, email: 'frank5@gmail.com', isActive: 'false' },
		{ id: 58, email: 'grace5@yahoo.com', isActive: 'false' },
		{ id: 59, email: 'henry5@outlook.com', isActive: 'true' },
		{ id: 60, email: 'ivan5@example.com', isActive: 'true' },
		{ id: 61, email: 'julia5@test.org', isActive: 'false' },
		{ id: 62, email: 'alice6@gmail.com', isActive: 'true' },
		{ id: 63, email: 'bob6@yahoo.com', isActive: 'false' },
		{ id: 64, email: 'carol6@outlook.com', isActive: 'true' },
		{ id: 65, email: 'david6@example.com', isActive: 'false' },
		{ id: 66, email: 'eve6@test.org', isActive: 'true' },
		{ id: 67, email: 'frank6@gmail.com', isActive: 'true' },
		{ id: 68, email: 'grace6@yahoo.com', isActive: 'false' },
		{ id: 69, email: 'henry6@outlook.com', isActive: 'true' },
		{ id: 70, email: 'ivan6@example.com', isActive: 'false' },
		{ id: 71, email: 'julia6@test.org', isActive: 'true' },
		{ id: 72, email: 'alice7@gmail.com', isActive: 'false' },
		{ id: 73, email: 'bob7@yahoo.com', isActive: 'true' },
		{ id: 74, email: 'carol7@outlook.com', isActive: 'false' },
		{ id: 75, email: 'david7@example.com', isActive: 'true' },
		{ id: 76, email: 'eve7@test.org', isActive: 'false' },
		{ id: 77, email: 'frank7@gmail.com', isActive: 'true' },
		{ id: 78, email: 'grace7@yahoo.com', isActive: 'true' },
		{ id: 79, email: 'henry7@outlook.com', isActive: 'false' },
		{ id: 80, email: 'ivan7@example.com', isActive: 'true' },
		{ id: 81, email: 'julia7@test.org', isActive: 'true' },
		{ id: 82, email: 'alice8@gmail.com', isActive: 'false' },
		{ id: 83, email: 'bob8@yahoo.com', isActive: 'true' },
		{ id: 84, email: 'carol8@outlook.com', isActive: 'true' },
		{ id: 85, email: 'david8@example.com', isActive: 'false' },
		{ id: 86, email: 'eve8@test.org', isActive: 'false' },
		{ id: 87, email: 'frank8@gmail.com', isActive: 'true' },
		{ id: 88, email: 'grace8@yahoo.com', isActive: 'false' },
		{ id: 89, email: 'henry8@outlook.com', isActive: 'true' },
		{ id: 90, email: 'ivan8@example.com', isActive: 'true' },
		{ id: 91, email: 'julia8@test.org', isActive: 'false' },
		{ id: 92, email: 'alice9@gmail.com', isActive: 'true' },
		{ id: 93, email: 'bob9@yahoo.com', isActive: 'false' },
		{ id: 94, email: 'carol9@outlook.com', isActive: 'true' },
		{ id: 95, email: 'david9@example.com', isActive: 'true' },
		{ id: 96, email: 'eve9@test.org', isActive: 'false' },
		{ id: 97, email: 'frank9@gmail.com', isActive: 'false' },
		{ id: 98, email: 'grace9@yahoo.com', isActive: 'true' },
		{ id: 99, email: 'henry9@outlook.com', isActive: 'false' },
		{ id: 100, email: 'ivan9@example.com', isActive: 'true' },
		{ id: 101, email: 'julia9@test.org', isActive: 'true' }
	];
	const totalPages = $derived(Math.ceil(emails.length / maxItemsPerPage));

	let emailToDelete = $state<(typeof emails)[0] | null>(null);
	let emailToEdit = $state<(typeof emails)[0] | null>(null);
	let showAddDialog = $state(false);
</script>

<PageHeader
	breadcrumbs={[
		{ title: 'Home', url: '/' },
		{ title: m.sidebar_module_settings() },
		{ title: m.nav_set_fans_reply_email() }
	]}
/>

<div class="mb-2 flex flex-row justify-end">
	<Button onclick={() => (showAddDialog = true)} size="sm" variant="default">
		<Plus class="mr-2 size-4" />
		{m.reply_email_add()}
	</Button>
</div>

<div class="overflow-hidden rounded-md border">
	<Table.Root>
		<Table.Header>
			<Table.Row>
				<Table.Head class="w-25">{m.reply_email_name()}</Table.Head>
				<Table.Head>{m.reply_email_active()}</Table.Head>
			</Table.Row>
		</Table.Header>
		<Table.Body>
			{#each emails.slice((currentPage - 1) * maxItemsPerPage, currentPage * maxItemsPerPage) as email (email)}
				<ContextMenu.Root>
					<ContextMenu.Trigger>
						{#snippet child({ props })}
							<Table.Row class="hover:cursor-context-menu" {...props}>
								<Table.Cell>{email.email}</Table.Cell>
								<Table.Cell>
									{#if email.isActive === 'true'}
										<Check class="size-4 text-primary" />
									{:else}
										<X class="size-4 text-destructive" />
									{/if}
								</Table.Cell>
							</Table.Row>
						{/snippet}
					</ContextMenu.Trigger>
					<ContextMenu.Content>
						<ContextMenu.Item
							onclick={() => {
								emailToEdit = email;
							}}
						>
							{m.reply_email_edit()}
						</ContextMenu.Item>
						<ContextMenu.Item onclick={() => (emailToDelete = email)}>
							{m.reply_email_delete()}
						</ContextMenu.Item>
					</ContextMenu.Content>
				</ContextMenu.Root>
			{/each}
		</Table.Body>
	</Table.Root>
</div>

<div class="mt-2 mb-6 flex items-center justify-between">
	<DropdownMenu.Root>
		<DropdownMenu.Trigger>
			{#snippet child({ props })}
				<Button {...props} variant="outline" size="sm"
					>{m.reply_email_items_per_page({ count: maxItemsPerPage })}</Button
				>
			{/snippet}
		</DropdownMenu.Trigger>
		<DropdownMenu.Content align="start">
			<DropdownMenu.Item
				onclick={() => {
					maxItemsPerPage = 10;
					currentPage = 1;
				}}>10</DropdownMenu.Item
			>
			<DropdownMenu.Item
				onclick={() => {
					maxItemsPerPage = 20;
					currentPage = 1;
				}}>20</DropdownMenu.Item
			>
			<DropdownMenu.Item
				onclick={() => {
					maxItemsPerPage = 30;
					currentPage = 1;
				}}>30</DropdownMenu.Item
			>
			<DropdownMenu.Item
				onclick={() => {
					maxItemsPerPage = 50;
					currentPage = 1;
				}}>50</DropdownMenu.Item
			>
		</DropdownMenu.Content>
	</DropdownMenu.Root>

	<ButtonGroup.Root>
		<Button
			class="size-8"
			disabled={currentPage <= 1}
			onclick={() => (currentPage -= 1)}
			size="icon"
			variant="outline"
		>
			<ChevronLeftIcon class="size-4" />
		</Button>

		<Button class="pointer-events-none size-8 px-8" variant="outline">
			<span class="text-sm">{currentPage} / {totalPages}</span>
		</Button>

		<Button
			class="size-8"
			disabled={currentPage >= totalPages}
			onclick={() => (currentPage += 1)}
			size="icon"
			variant="outline"
		>
			<ChevronRightIcon class="size-4" />
		</Button>
	</ButtonGroup.Root>
</div>

<EditDialog bind:emailToEdit />
<DeleteDialog bind:emailToDelete />
<AddDialog bind:open={showAddDialog} />
