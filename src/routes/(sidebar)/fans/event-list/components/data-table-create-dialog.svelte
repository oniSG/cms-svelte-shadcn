<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import * as Command from '$lib/components/ui/command/index.js';
	import { tags } from '../columns';
	import { ChevronsUpDownIcon, X } from '@lucide/svelte';
	import { Switch } from '$lib/components/ui/switch/index.js';

	let { open = $bindable() }: { open: boolean } = $props();

	let eventName = $state('');

	let eventsList = [
		{ id: '2507', name: 'Udalost Lukas 2507', date: '03.01.2026' },
		{ id: '987', name: 'Test Event Zuz Feb', date: '01.02.2026' },
		{ id: '100', name: 'Udalost 100', date: '05.02.2026' },
		{ id: '102', name: 'Udalost 102', date: '05.02.2026' },
		{ id: '98765', name: 'Test Event Zuz Feb2', date: '06.02.2026' },
		{ id: '98766', name: 'Test Event Zuz Feb3', date: '06.02.2026' }
	];

	// STAV PRO ŠTÍTKY
	let selectedTags = $state<string[]>([]);
	let tagsOpen = $state(false);

	// STAV PRO UDÁLOSTI (Ukládá pole IDček)
	let selectedEvents = $state<string[]>([]);
	let eventsOpen = $state(false);

	function toggleTag(value: string) {
		if (selectedTags.includes(value)) {
			selectedTags = selectedTags.filter((t) => t !== value);
		} else {
			selectedTags = [...selectedTags, value];
		}
	}

	function removeTag(value: string) {
		selectedTags = selectedTags.filter((t) => t !== value);
	}

	// Funkce upravené pro práci s ID události
	function toggleEvent(id: string) {
		if (selectedEvents.includes(id)) {
			selectedEvents = selectedEvents.filter((e) => e !== id);
		} else {
			selectedEvents = [...selectedEvents, id];
		}
	}

	function removeEvent(id: string) {
		selectedEvents = selectedEvents.filter((e) => e !== id);
	}

	function handleSave() {
		if (!eventName.trim()) return;

		console.log('Vytvořit', {
			event: eventName,
			labels: selectedTags,
			linkedEventIds: selectedEvents
		});
		handleClose();
	}

	function handleClose() {
		open = false;
		eventName = '';
		selectedTags = [];
		selectedEvents = [];
	}
</script>

<Dialog.Root
	onOpenChange={(o) => { if (!o) handleClose(); }}
	{open}
>
	<Dialog.Content class="max-w-lg">
		<Dialog.Header>
			<Dialog.Title>Nová událost</Dialog.Title>
		</Dialog.Header>

		<div class="flex flex-col gap-5 py-2">
			<div class="flex flex-col gap-1.5">
				<Label for="event-name">
					Název <span class="text-destructive">*</span>
				</Label>
				<Input bind:value={eventName} id="event-name" placeholder="Název události" />

				<div class="flex items-center mt-2 justify-between">
					<Label for="active">Aktivní</Label>
					<Switch id="active" />
				</div>
			</div>

			<div class="flex flex-col gap-1.5">

				<Label>Štítky</Label>

				<Popover.Root bind:open={tagsOpen}>
					<Popover.Trigger>
						{#snippet child({ props })}
							<button
								{...props}
								class="border-input flex min-h-9 w-full flex-wrap items-center gap-1 rounded-md border bg-transparent px-3 py-1.5 text-sm shadow-xs"
							>
								{#each selectedTags as tag (tag)}
									<Badge variant="secondary" class="gap-1 pr-1">
										{tag}
										<button
											onclick={(e) => { e.stopPropagation(); removeTag(tag); }}
											class="hover:text-destructive"
										>
											<X class="size-3" />
										</button>
									</Badge>
								{/each}
								{#if selectedTags.length === 0}
									<span class="text-muted-foreground">Vyberte štítky</span>
								{/if}
								<ChevronsUpDownIcon class="text-muted-foreground ml-auto size-4 shrink-0" />
							</button>
						{/snippet}
					</Popover.Trigger>
					<Popover.Content
						align="start"
						class="p-0"
						sideOffset={4}
						style="width: var(--bits-popover-anchor-width)"
					>
						<Command.Root>
							<Command.Input placeholder="Hledat štítek..." />
							<Command.List>
								<Command.Empty>Žádné výsledky.</Command.Empty>
								<Command.Group>
									{#each tags as tag (tag)}
										<Command.Item
											value={tag}
											onSelect={() => {
                                                toggleTag(tag);
                                                tagsOpen = true;
                                            }}
										>
											<span class="mr-2 w-4">{selectedTags.includes(tag) ? '✓' : ''}</span>
											{tag}
										</Command.Item>
									{/each}
								</Command.Group>
							</Command.List>
						</Command.Root>
					</Popover.Content>
				</Popover.Root>
				<div class="flex items-center mt-2 justify-between">
					<Label for="update">Aktualizovat podle ticketingu</Label>
					<Switch id="update" />
				</div>

			</div>

			<div class="flex flex-col gap-1.5">
				<Label>Události</Label>
				<Popover.Root bind:open={eventsOpen}>
					<Popover.Trigger>
						{#snippet child({ props })}
							<button
								{...props}
								class="border-input flex min-h-9 w-full flex-wrap items-center gap-1 rounded-md border bg-transparent px-3 py-1.5 text-sm shadow-xs"
							>
								{#each selectedEvents as eventId (eventId)}
									{@const ev = eventsList.find(e => e.id === eventId)}
									{#if ev}
										<Badge variant="secondary" class="gap-1 pr-1">
											{ev.name} <span class="text-muted-foreground text-xs">({ev.id})</span>
											<button
												onclick={(e) => { e.stopPropagation(); removeEvent(eventId); }}
												class="hover:text-destructive"
											>
												<X class="size-3" />
											</button>
										</Badge>
									{/if}
								{/each}
								{#if selectedEvents.length === 0}
									<span class="text-muted-foreground">Vyberte události</span>
								{/if}
								<ChevronsUpDownIcon class="text-muted-foreground ml-auto size-4 shrink-0" />
							</button>
						{/snippet}
					</Popover.Trigger>
					<Popover.Content
						align="start"
						class="p-0"
						sideOffset={4}
						style="width: var(--bits-popover-anchor-width)"
					>
						<Command.Root>
							<Command.Input placeholder="Hledat událost podle názvu nebo ID..." />
							<Command.List>
								<Command.Empty>Žádné výsledky.</Command.Empty>
								<Command.Group>
									{#each eventsList as ev (ev.id)}
										<Command.Item
											value={`${ev.name} ${ev.id}`} onSelect={() => {
                                                toggleEvent(ev.id);
                                                eventsOpen = true;
                                            }}
											class="flex items-start gap-2 py-2.5"
										>
                                            <span class="mt-0.5 w-4 shrink-0 text-sm">
                                                {selectedEvents.includes(ev.id) ? '✓' : ''}
                                            </span>

											<div class="flex flex-1 flex-col gap-0.5 text-left">
												<div class="flex items-center justify-between w-full">
													<span class="font-normal text-sm text-foreground">{ev.name}</span>
													<span class="text-muted-foreground text-xs">{ev.date}</span>
												</div>
												<span class="text-muted-foreground text-xs">ID: {ev.id}</span>
											</div>
										</Command.Item>
									{/each}
								</Command.Group>
							</Command.List>
						</Command.Root>
					</Popover.Content>
				</Popover.Root>
			</div>
		</div>

		<Dialog.Footer>
			<Button onclick={handleClose} variant="outline">Zrušit</Button>
			<Button disabled={!eventName.trim()} onclick={handleSave}>Vytvořit</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>