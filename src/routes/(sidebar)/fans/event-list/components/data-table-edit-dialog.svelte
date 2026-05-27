<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import * as Command from '$lib/components/ui/command/index.js';
	import { type Event, tags } from '../columns';
	import { ChevronsUpDownIcon, X } from '@lucide/svelte';

	let { eventToEdit = $bindable() }: { eventToEdit: Event | null } = $props();

	let eventName = $state('');
	let selectedTags = $state<string[]>([]);
	let tagsOpen = $state(false);

	$effect(() => {
		if (eventToEdit) {
			eventName = eventToEdit.event ?? '';
			selectedTags = [...(eventToEdit.label ?? [])];
		}
	});

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

	function handleSave() {
		if (!eventToEdit) return;
		eventToEdit = null;
	}
</script>

<Dialog.Root
	onOpenChange={(open) => { if (!open) eventToEdit = null; }}
	open={eventToEdit !== null}
>
	<Dialog.Content class="max-w-lg">
		<Dialog.Header>
			<Dialog.Title>Editace události</Dialog.Title>
		</Dialog.Header>
		<div class="flex flex-col gap-5 py-2">
			<div class="flex flex-col gap-1.5">
				<Label for="event-name">
					Název <span class="text-destructive">*</span>
				</Label>
				<Input bind:value={eventName} id="event-name" placeholder="Název události" />
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
			</div>
		</div>
		<Dialog.Footer>
			<Button onclick={() => eventToEdit = null} variant="outline">Zrušit</Button>
			<Button onclick={handleSave}>Uložit a zavřít</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>