<script lang="ts">
	import { page } from '$app/state';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import * as Command from '$lib/components/ui/command/index.js';
	import * as Tooltip from '$lib/components/ui/tooltip/index.js';
	import { Switch } from '$lib/components/ui/switch/index.js';
	import { data } from '../data.js';
	import { tags as tagOptions } from '../columns.js';
	import CircleHelp from '@lucide/svelte/icons/circle-help';
	import ChevronsUpDownIcon from '@lucide/svelte/icons/chevrons-up-down';
	import X from '@lucide/svelte/icons/x';
	import Check from '@lucide/svelte/icons/check';
	import * as m from '$lib/paraglide/messages.js';

	const actionId = $derived(Number(page.params.id));
	const action = $derived(data.find((item) => item.id === actionId));

	const segmentOptions = $derived([
		m.fan_action_segment_all(),
		m.fan_action_segment_vip(),
		m.fan_action_segment_new(),
		m.fan_action_segment_inactive()
	]);

	let name = $state('');
	let description = $state('');
	let transactionActions = $state(false);
	let selectedSegments = $state<string[]>([]);
	let selectedTags = $state<string[]>([]);
	let segmentsOpen = $state(false);
	let tagsOpen = $state(false);

	$effect(() => {
		if (!action) return;

		name = action.event;
		description = action.description;
		transactionActions = false;
		selectedSegments = [m.fan_action_segment_all()];
		selectedTags = [...action.tags];
	});

	function toggleSegment(value: string) {
		if (selectedSegments.includes(value)) {
			selectedSegments = selectedSegments.filter((segment) => segment !== value);
		} else {
			selectedSegments = [...selectedSegments, value];
		}
	}

	function removeSegment(value: string) {
		selectedSegments = selectedSegments.filter((segment) => segment !== value);
	}

	function toggleTag(value: string) {
		if (selectedTags.includes(value)) {
			selectedTags = selectedTags.filter((tag) => tag !== value);
		} else {
			selectedTags = [...selectedTags, value];
		}
	}

	function removeTag(value: string) {
		selectedTags = selectedTags.filter((tag) => tag !== value);
	}
</script>

<div class="space-y-3">
	<div class="space-y-2">
		<Label for="action-name">
			{m.event_name_label()} <span class="text-destructive">*</span>
		</Label>
		<Input bind:value={name} id="action-name" placeholder={m.event_name_placeholder()} />
	</div>

	<div class="space-y-2">
		<Label for="action-description">
			{m.col_description()} <span class="text-destructive">*</span>
		</Label>
		<Input bind:value={description} id="action-description" />
	</div>

	<div class="flex items-center justify-between space-x-2">
		<Label for="transaction-actions">{m.fan_action_transaction_actions()}</Label>
		<Switch bind:checked={transactionActions} id="transaction-actions" />
	</div>

	<div class="space-y-2">
		<div class="flex items-center gap-2">
			<Label>
				{m.fan_action_segment()} <span class="text-destructive">*</span>
			</Label>
			<Tooltip.Provider>
				<Tooltip.Root>
					<Tooltip.Trigger class="inline-flex text-muted-foreground">
						<CircleHelp class="size-4" />
					</Tooltip.Trigger>
					<Tooltip.Content>{m.fan_action_segment_info()}</Tooltip.Content>
				</Tooltip.Root>
			</Tooltip.Provider>
		</div>

		<Popover.Root bind:open={segmentsOpen}>
			<Popover.Trigger>
				{#snippet child({ props })}
					<button
						{...props}
						type="button"
						class="flex min-h-9 w-full flex-wrap items-center gap-1 rounded-md border border-input bg-transparent px-3 py-1.5 text-sm shadow-xs"
					>
						{#each selectedSegments as segment (segment)}
							<Badge variant="secondary" class="gap-1 pr-1">
								{segment}
								<button
									type="button"
									onclick={(event) => {
										event.stopPropagation();
										removeSegment(segment);
									}}
									class="hover:text-destructive"
								>
									<X class="size-3" />
								</button>
							</Badge>
						{/each}
						{#if selectedSegments.length === 0}
							<span class="text-muted-foreground">{m.fan_action_segment()}</span>
						{/if}
						<ChevronsUpDownIcon class="ml-auto size-4 shrink-0 text-muted-foreground" />
					</button>
				{/snippet}
			</Popover.Trigger>
			<Popover.Content align="start" class="w-[var(--bits-popover-anchor-width)] p-0">
				<Command.Root>
					<Command.Input placeholder={m.fan_action_segment()} />
					<Command.List>
						<Command.Empty>{m.event_no_results()}</Command.Empty>
						<Command.Group>
							{#each segmentOptions as segment (segment)}
								<Command.Item
									value={segment}
									onSelect={() => {
										toggleSegment(segment);
										segmentsOpen = true;
									}}
								>
									<span class="mr-2 flex size-4 items-center justify-center">
										<Check class="size-4 {selectedSegments.includes(segment) ? '' : 'hidden'}" />
									</span>
									{segment}
								</Command.Item>
							{/each}
						</Command.Group>
					</Command.List>
				</Command.Root>
			</Popover.Content>
		</Popover.Root>
	</div>

	<div class="space-y-2">
		<Label>{m.event_tags_label()}</Label>
		<Popover.Root bind:open={tagsOpen}>
			<Popover.Trigger>
				{#snippet child({ props })}
					<button
						{...props}
						type="button"
						class="flex min-h-9 w-full flex-wrap items-center gap-1 rounded-md border border-input bg-transparent px-3 py-1.5 text-sm shadow-xs"
					>
						{#each selectedTags as tag (tag)}
							<Badge variant="secondary" class="gap-1 pr-1">
								{tag}
								<button
									type="button"
									onclick={(event) => {
										event.stopPropagation();
										removeTag(tag);
									}}
									class="hover:text-destructive"
								>
									<X class="size-3" />
								</button>
							</Badge>
						{/each}
						{#if selectedTags.length === 0}
							<span class="text-muted-foreground">{m.fan_action_tags_placeholder()}</span>
						{/if}
						<ChevronsUpDownIcon class="ml-auto size-4 shrink-0 text-muted-foreground" />
					</button>
				{/snippet}
			</Popover.Trigger>
			<Popover.Content align="start" class="w-[var(--bits-popover-anchor-width)] p-0">
				<Command.Root>
					<Command.Input placeholder={m.event_tags_search()} />
					<Command.List>
						<Command.Empty>{m.event_no_results()}</Command.Empty>
						<Command.Group>
							{#each tagOptions as tag (tag)}
								<Command.Item
									value={tag}
									onSelect={() => {
										toggleTag(tag);
										tagsOpen = true;
									}}
								>
									<span class="mr-2 flex size-4 items-center justify-center">
										<Check class="size-4 {selectedTags.includes(tag) ? '' : 'hidden'}" />
									</span>
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
