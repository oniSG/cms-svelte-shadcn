<script lang="ts">
	// Shadcn imports
	import PageHeader from '$lib/components/custom/sidebar/page-header.svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Table from '$lib/components/ui/table/index.js';
	import * as ContextMenu from '$lib/components/ui/context-menu/index.js';
	import { Badge } from '$lib/components/ui/badge';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import * as Field from '$lib/components/ui/field/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Switch } from '$lib/components/ui/switch/index.js';
	import * as Command from '$lib/components/ui/command/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import { Separator } from '$lib/components/ui/separator/index.js';

	// Lucide imports
	import { Check } from '@lucide/svelte';
	import { X } from '@lucide/svelte';
	import { Plus } from '@lucide/svelte';
	import { SquarePen } from '@lucide/svelte';
	import { Copy } from '@lucide/svelte';
	import { Trash } from '@lucide/svelte';
	import { Eye } from '@lucide/svelte';

	// Custom component imports
	import FilterBar from './components/data-table-col-filter.svelte';
	import Pagination from './components/data-table-pagination.svelte';

	//Other imports
	import { getLocalTimeZone, today } from '@internationalized/date';
	import { SvelteSet } from 'svelte/reactivity';
	import { events } from '../../settings/logs2/data';

	let currentPage = $state(1);
	let maxItemsPerPage = $state(10);
	const totalPages = $derived(Math.ceil(events.length / maxItemsPerPage));

	let editOpen = $state(false);
	let duplicateOpen = $state(false);
	let deleteOpen = $state(false);
	let detailOpen = $state(false);
	let addOpen = $state(false);

	const uniquePeople = new SvelteSet<string>();
	const uniqueTags = new SvelteSet<string>();
	const uniqueEvents = new SvelteSet<string>();

	for (const event of events) {
		uniquePeople.add(event.name);
		uniqueTags.add(event.label);
		uniqueEvents.add(event.event);
	}

	const start = today(getLocalTimeZone());
	const end = start.add({ days: 7 });

	let value = $state({
		start,
		end
	});

	let selectedTags = $state<string[]>([]);
	let tagPopoverOpen = $state(false);
	const availableTags = ['VIP-gold', 'VIP-silver', 'premium', 'normal'];
</script>

<PageHeader
	breadcrumbs={[{ title: 'Home', url: '/' }, { title: 'Fans' }, { title: 'Event list' }]}
/>

<div class="mb-2 flex justify-between">
	<div class="flex gap-2">
		<FilterBar {uniqueEvents} {uniqueTags} {uniquePeople} bind:dateRange={value} />
	</div>
	<Button size="sm" onclick={() => (addOpen = true)}>
		<Plus class="mr-2 size-4" />
		Vytvořit seznam událostí
	</Button>
</div>

<div class="overflow-hidden rounded-md border">
	<Table.Root>
		<Table.Header>
			<Table.Row>
				<Table.Head class="w-25">Název</Table.Head>
				<Table.Head>Štítky</Table.Head>
				<Table.Head>Vytvořil/a</Table.Head>
				<Table.Head>Datum vytvoření</Table.Head>
				<Table.Head>Aktivní</Table.Head>
			</Table.Row>
		</Table.Header>
		<Table.Body>
			{#each events.slice((currentPage - 1) * maxItemsPerPage, currentPage * maxItemsPerPage) as event (event)}
				<ContextMenu.Root>
					<ContextMenu.Trigger>
						{#snippet child({ props })}
							<Table.Row class="hover:cursor-context-menu" {...props}>
								<Table.Cell>{event.event}</Table.Cell>
								<Table.Cell>
									<Badge variant="outline">{event.label}</Badge>
								</Table.Cell>
								<Table.Cell>{event.name}</Table.Cell>
								<Table.Cell>{event.creation_date}</Table.Cell>
								<Table.Cell>
									{#if event.isActive === 'true'}
										<Check class="size-4 text-primary" />
									{:else}
										<X class="size-4 text-destructive" />
									{/if}
								</Table.Cell>
							</Table.Row>
						{/snippet}
					</ContextMenu.Trigger>
					<ContextMenu.Content>
						<ContextMenu.Item onSelect={() => (editOpen = true)}>
							<SquarePen /> Editovat
						</ContextMenu.Item>
						<ContextMenu.Item onSelect={() => (duplicateOpen = true)}>
							<Copy /> Duplikovat
						</ContextMenu.Item>
						<ContextMenu.Item onSelect={() => (detailOpen = true)}>
							<Eye /> Detail
						</ContextMenu.Item>
						<ContextMenu.Item
							onSelect={() => (deleteOpen = true)}
							class="text-destructive data-highlighted:text-destructive"
						>
							<Trash class="mr-2 h-4 w-4" />
							<span>Odstranit</span>
						</ContextMenu.Item>
					</ContextMenu.Content>
				</ContextMenu.Root>
			{/each}
		</Table.Body>
	</Table.Root>
</div>

<Pagination bind:currentPage bind:maxItemsPerPage {totalPages} />

<Dialog.Root bind:open={editOpen}>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Editace seznamu událostí</Dialog.Title>
		</Dialog.Header>

		<div class="flex flex-col gap-4">
			<Field.Field>
				<Field.Label for="name">Název</Field.Label>
				<Input id="name" autocomplete="off" placeholder="Název události" />
			</Field.Field>

			<Field.Field orientation="horizontal">
				<Field.Label for="active">Aktivní</Field.Label>
				<Switch id="active" />
			</Field.Field>

			<Field.Field>
				<Field.Label for="label">Štítky</Field.Label>
				<div
					class="flex min-h-9 w-full flex-wrap items-center gap-1 rounded-md border border-input px-3 py-1 text-sm shadow-sm"
				>
					{#each selectedTags as tag (tag)}
						<Badge variant="secondary" class="gap-1">
							{tag}
							<button
								type="button"
								onclick={() => (selectedTags = selectedTags.filter((t) => t !== tag))}
								class="hover:text-destructive"
							>
								<X class="size-3" />
							</button>
						</Badge>
					{/each}
					<Popover.Root bind:open={tagPopoverOpen}>
						<Popover.Trigger>
							{#snippet child({ props })}
								<Button
									{...props}
									type="button"
									variant="ghost"
									size="icon"
									class="ml-auto size-5 shrink-0"
								>
									<Plus class="size-3" />
								</Button>
							{/snippet}
						</Popover.Trigger>
						<Popover.Content class="w-48 p-0" align="end">
							<Command.Root>
								<Command.Input placeholder="Hledat štítek..." />
								<Command.List>
									<Command.Empty>Žádné výsledky.</Command.Empty>
									<Command.Group>
										{#each availableTags as tag (tag)}
											<Command.Item
												value={tag}
												onSelect={() => {
													if (!selectedTags.includes(tag)) selectedTags = [...selectedTags, tag];
													tagPopoverOpen = false;
												}}
											>
												{tag}
											</Command.Item>
										{/each}
									</Command.Group>
								</Command.List>
							</Command.Root>
						</Popover.Content>
					</Popover.Root>
				</div>
			</Field.Field>

			<Field.Field orientation="horizontal">
				<Field.Label for="ticketing">Aktualizovat podle ticketingu</Field.Label>
				<Switch id="ticketing" />
			</Field.Field>
		</div>

		<Dialog.Footer>
			<Button variant="outline" onclick={() => (editOpen = false)}>Zrušit</Button>
			<Button>Uložit</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>

<Dialog.Root bind:open={duplicateOpen}>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Duplikovat položku</Dialog.Title>
			<Dialog.Description>Opravdu chcete duplikovat tuto položku?</Dialog.Description>
		</Dialog.Header>
		<Dialog.Footer>
			<Button variant="outline" onclick={() => (duplicateOpen = false)}>Zrušit</Button>
			<Button>Duplikovat</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>

<Dialog.Root bind:open={deleteOpen}>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Odstranit položku</Dialog.Title>
			<Dialog.Description
				>Opravdu chcete odstranit tuto položku? Tuto akci nelze vzít zpět.</Dialog.Description
			>
		</Dialog.Header>
		<Dialog.Footer>
			<Button variant="outline" onclick={() => (deleteOpen = false)}>Zrušit</Button>
			<Button variant="destructive">Odstranit</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>

<Dialog.Root bind:open={detailOpen}>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Firemní večírek 2024</Dialog.Title>
		</Dialog.Header>

		<div class="flex flex-col gap-4">
			<Separator />

			<Field.Field>
				<h3>Vytvořil/a: Tomáš Bodina</h3>
			</Field.Field>

			<Field.Field>
				<h3>Vytvořeno: 25. 3. 2026</h3>
			</Field.Field>

			<Field.Field>
				<h3>Stav: aktivní</h3>
			</Field.Field>

			<div class="flex w-fit flex-wrap items-center gap-2">
				<h3>Štítky:</h3>
				<Badge variant="secondary">VIP-gold</Badge>
				<Badge variant="default">VIP-silver</Badge>
			</div>

			<Separator />

			<Field.Field>
				<Field.Label for="label">Události</Field.Label>
				<Table.Root>
					<Table.Header>
						<Table.Row>
							<Table.Head>Název</Table.Head>
							<Table.Head>ID</Table.Head>
							<Table.Head>Datum konání</Table.Head>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						<Table.Row>
							<Table.Cell class="font-medium">Test Event Feb</Table.Cell>
							<Table.Cell>9876</Table.Cell>
							<Table.Cell>01.02.2026</Table.Cell>
						</Table.Row>
						<Table.Row>
							<Table.Cell class="font-medium">Test Event Zuz Feb</Table.Cell>
							<Table.Cell>9876</Table.Cell>
							<Table.Cell>01.02.2026</Table.Cell>
						</Table.Row>
						<Table.Row>
							<Table.Cell class="font-medium">Test Event Zuz Feb</Table.Cell>
							<Table.Cell>9876</Table.Cell>
							<Table.Cell>01.02.2026</Table.Cell>
						</Table.Row>
					</Table.Body>
				</Table.Root>
			</Field.Field>
		</div>
	</Dialog.Content>
</Dialog.Root>

<Dialog.Root bind:open={addOpen}>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Vytvořit seznam událostí</Dialog.Title>
		</Dialog.Header>

		<div class="flex flex-col gap-4">
			<Field.Field>
				<Field.Label for="name">Název</Field.Label>
				<Input id="name" autocomplete="off" placeholder="Název události" />
			</Field.Field>

			<Field.Field orientation="horizontal">
				<Field.Label for="active">Aktivní</Field.Label>
				<Switch id="active" />
			</Field.Field>

			<Field.Field>
				<Field.Label for="label">Štítky</Field.Label>
				<div
					class="flex min-h-9 w-full flex-wrap items-center gap-1 rounded-md border border-input px-3 py-1 text-sm shadow-sm"
				>
					{#each selectedTags as tag (tag)}
						<Badge variant="secondary" class="gap-1">
							{tag}
							<button
								type="button"
								onclick={() => (selectedTags = selectedTags.filter((t) => t !== tag))}
								class="hover:text-destructive"
							>
								<X class="size-3" />
							</button>
						</Badge>
					{/each}
					<Popover.Root bind:open={tagPopoverOpen}>
						<Popover.Trigger>
							{#snippet child({ props })}
								<Button
									{...props}
									type="button"
									variant="ghost"
									size="icon"
									class="ml-auto size-5 shrink-0"
								>
									<Plus class="size-3" />
								</Button>
							{/snippet}
						</Popover.Trigger>
						<Popover.Content class="w-48 p-0" align="end">
							<Command.Root>
								<Command.Input placeholder="Hledat štítek..." />
								<Command.List>
									<Command.Empty>Žádné výsledky.</Command.Empty>
									<Command.Group>
										{#each availableTags as tag (tag)}
											<Command.Item
												value={tag}
												onSelect={() => {
													if (!selectedTags.includes(tag)) selectedTags = [...selectedTags, tag];
													tagPopoverOpen = false;
												}}
											>
												{tag}
											</Command.Item>
										{/each}
									</Command.Group>
								</Command.List>
							</Command.Root>
						</Popover.Content>
					</Popover.Root>
				</div>
			</Field.Field>

			<Field.Field orientation="horizontal">
				<Field.Label for="ticketing">Aktualizovat podle ticketingu</Field.Label>
				<Switch id="ticketing" />
			</Field.Field>
		</div>

		<Dialog.Footer>
			<Button variant="outline" onclick={() => (editOpen = false)}>Zrušit</Button>
			<Button>Uložit</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
