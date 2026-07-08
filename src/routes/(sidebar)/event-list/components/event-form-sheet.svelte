<script lang="ts">
	import { untrack } from 'svelte';
	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
	import * as Sheet from '$lib/components/ui/sheet/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import * as Command from '$lib/components/ui/command/index.js';
	import { Switch } from '$lib/components/ui/switch/index.js';
	import ChevronsUpDownIcon from '@lucide/svelte/icons/chevrons-up-down';
	import CheckIcon from '@lucide/svelte/icons/check';
	import XIcon from '@lucide/svelte/icons/x';
	import { eventListTags, linkedEventsCatalog, type Event } from '../event-list';
	import * as m from '$lib/paraglide/messages.js';

	let {
		open = $bindable(false),
		event
	}: {
		open?: boolean;
		event?: Event;
	} = $props();

	const isEdit = $derived(Boolean(event));

	let eventName = $state('');
	let selectedTags = $state<string[]>([]);
	let selectedEvents = $state<string[]>([]);
	let isActive = $state(true);
	let updateTicketing = $state(false);
	let tagsOpen = $state(false);
	let eventsOpen = $state(false);

	function resetForm() {
		eventName = '';
		selectedTags = [];
		selectedEvents = [];
		isActive = true;
		updateTicketing = false;
	}

	$effect(() => {
		if (!open) return;
		const current = untrack(() => event);
		if (current) {
			eventName = current.event;
			selectedTags = [...current.label];
			isActive = current.active;
			selectedEvents = [];
			updateTicketing = false;
			return;
		}
		resetForm();
	});

	function toggleTag(value: string) {
		selectedTags = selectedTags.includes(value)
			? selectedTags.filter((tag) => tag !== value)
			: [...selectedTags, value];
	}

	function removeTag(value: string) {
		selectedTags = selectedTags.filter((tag) => tag !== value);
	}

	function toggleLinkedEvent(id: string) {
		selectedEvents = selectedEvents.includes(id)
			? selectedEvents.filter((linkedId) => linkedId !== id)
			: [...selectedEvents, id];
	}

	function removeLinkedEvent(id: string) {
		selectedEvents = selectedEvents.filter((linkedId) => linkedId !== id);
	}

	function handleSave() {
		if (!eventName.trim()) return;

		console.log(isEdit ? 'Uložit' : 'Vytvořit', {
			event: eventName,
			labels: selectedTags,
			linkedEventIds: selectedEvents,
			active: isActive,
			updateTicketing
		});
		open = false;
	}
</script>

<Sheet.Root bind:open>
	<Sheet.Content class="gap-0">
		<Sheet.Header>
			<Sheet.Title
				>{isEdit ? m.event_dialog_edit_title() : m.event_dialog_create_title()}</Sheet.Title
			>
		</Sheet.Header>

		<div class="min-h-0 flex-1 space-y-5 overflow-y-auto px-6 py-2">
			<div class="space-y-1.5">
				<Label for="event-name">
					{m.event_name_label()} <span class="text-destructive">*</span>
				</Label>
				<Input bind:value={eventName} id="event-name" placeholder={m.event_name_placeholder()} />

				<div class="flex items-center justify-between pt-1">
					<Label for="event-active">{m.col_active()}</Label>
					<Switch bind:checked={isActive} id="event-active" />
				</div>
			</div>

			<div class="space-y-1.5">
				<Label>{m.event_tags_label()}</Label>
				<Popover.Root bind:open={tagsOpen}>
					<Popover.Trigger>
						{#snippet child({ props })}
							<button
								{...props}
								class="flex min-h-9 w-full flex-wrap items-center gap-1 rounded-md border border-input bg-transparent px-3 py-1.5 text-sm shadow-xs"
							>
								{#each selectedTags as tag (tag)}
									<Badge variant="secondary" class="gap-1 pr-1">
										{tag}
										<button
											type="button"
											onclick={(e) => {
												e.stopPropagation();
												removeTag(tag);
											}}
											class="hover:text-destructive"
										>
											<XIcon class="size-3" />
										</button>
									</Badge>
								{/each}
								{#if selectedTags.length === 0}
									<span class="text-muted-foreground">{m.event_tags_placeholder()}</span>
								{/if}
								<ChevronsUpDownIcon class="ml-auto size-4 shrink-0 text-muted-foreground" />
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
							<Command.Input placeholder={m.event_tags_search()} />
							<Command.List>
								<Command.Empty>{m.event_no_results()}</Command.Empty>
								<Command.Group>
									{#each eventListTags as tag (tag)}
										<Command.Item
											value={tag}
											onSelect={() => {
												toggleTag(tag);
												tagsOpen = true;
											}}
										>
											<span class="mr-2 flex size-4 shrink-0 items-center justify-center">
												<CheckIcon class="size-4 {selectedTags.includes(tag) ? '' : 'hidden'}" />
											</span>
											{tag}
										</Command.Item>
									{/each}
								</Command.Group>
							</Command.List>
						</Command.Root>
					</Popover.Content>
				</Popover.Root>

				<div class="flex items-center justify-between pt-1">
					<Label for="event-ticketing">{m.event_update_ticketing()}</Label>
					<Switch bind:checked={updateTicketing} id="event-ticketing" />
				</div>
			</div>

			<div class="space-y-1.5">
				<Label>{m.event_events_label()}</Label>
				<Popover.Root bind:open={eventsOpen}>
					<Popover.Trigger>
						{#snippet child({ props })}
							<button
								{...props}
								class="flex min-h-9 w-full flex-wrap items-center gap-1 rounded-md border border-input bg-transparent px-3 py-1.5 text-sm shadow-xs"
							>
								{#each selectedEvents as eventId (eventId)}
									{@const linkedEvent = linkedEventsCatalog.find((item) => item.id === eventId)}
									{#if linkedEvent}
										<Badge variant="secondary" class="gap-1 pr-1">
											{linkedEvent.name}
											<span class="text-xs text-muted-foreground">({linkedEvent.id})</span>
											<button
												type="button"
												onclick={(e) => {
													e.stopPropagation();
													removeLinkedEvent(eventId);
												}}
												class="hover:text-destructive"
											>
												<XIcon class="size-3" />
											</button>
										</Badge>
									{/if}
								{/each}
								{#if selectedEvents.length === 0}
									<span class="text-muted-foreground">{m.event_events_placeholder()}</span>
								{/if}
								<ChevronsUpDownIcon class="ml-auto size-4 shrink-0 text-muted-foreground" />
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
							<Command.Input placeholder={m.event_events_search()} />
							<Command.List>
								<Command.Empty>{m.event_no_results()}</Command.Empty>
								<Command.Group>
									{#each linkedEventsCatalog as linkedEvent (linkedEvent.id)}
										<Command.Item
											value={`${linkedEvent.name} ${linkedEvent.id}`}
											onSelect={() => {
												toggleLinkedEvent(linkedEvent.id);
												eventsOpen = true;
											}}
											class="flex items-start gap-2 py-2.5"
										>
											<span class="mt-0.5 mr-2 flex size-4 shrink-0 items-center justify-center">
												<CheckIcon
													class="size-4 {selectedEvents.includes(linkedEvent.id) ? '' : 'hidden'}"
												/>
											</span>
											<div class="flex flex-1 flex-col gap-0.5 text-left">
												<div class="flex w-full items-center justify-between">
													<span class="text-sm font-normal text-foreground">{linkedEvent.name}</span
													>
													<span class="text-xs text-muted-foreground">{linkedEvent.date}</span>
												</div>
												<span class="text-xs text-muted-foreground">ID: {linkedEvent.id}</span>
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

		<Sheet.Footer class="flex-row justify-end">
			<Sheet.Close type="button" class={buttonVariants({ variant: 'outline' })}>
				{m.common_cancel()}
			</Sheet.Close>
			<Button disabled={!eventName.trim()} onclick={handleSave}>
				{isEdit ? m.event_save_close() : m.event_create_submit()}
			</Button>
		</Sheet.Footer>
	</Sheet.Content>
</Sheet.Root>
