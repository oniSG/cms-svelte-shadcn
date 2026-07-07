<script lang="ts">
	import * as Accordion from '$lib/components/ui/accordion/index.js';
	import * as Command from '$lib/components/ui/command/index.js';
	import * as HoverCard from '$lib/components/ui/hover-card/index.js';
	import GripVertical from '@lucide/svelte/icons/grip-vertical';
	import Info from '@lucide/svelte/icons/info';
	import type { WorkflowPaletteItem } from './types';
	import { WORKFLOW_DRAG_MIME } from './types';
	import {
		workflowItemDescription,
		workflowItemIcon,
		workflowItemIconModifier,
		workflowItemLabel,
		workflowPaletteSections,
		type WorkflowPaletteSectionConfig
	} from './workflow-items';
	import { workflowPaletteSection, workflowPaletteSectionBgClass } from './node-styles';
	import BasicInfoForm from '../basic-info-form.svelte';
	import SettingsForm from '../settings-form.svelte';
	import type { FanAction } from '$lib/types/fan-action.js';
	import * as m from '$lib/paraglide/messages.js';

	let { action = null }: { action?: FanAction | null } = $props();

	type StyledPaletteItem = WorkflowPaletteItem;

	const paletteSections = $derived<WorkflowPaletteSectionConfig[]>(workflowPaletteSections());

	const sectionIconBgClass = workflowPaletteSectionBgClass;
	const accordionTriggerClass =
		'cursor-pointer px-4 py-3.5 text-base font-semibold hover:no-underline';
	const accordionContentClass = 'px-0 pt-0 pb-2';
	const accordionItemClass = 'cursor-pointer [&_[data-slot=accordion-content]]:cursor-auto';
	const commandRootClass =
		'overflow-hidden rounded-lg border border-border bg-background p-0 shadow-none';
	const commandListClass = 'min-h-[13.75rem] max-h-72 px-1';
	const commandItemClass =
		'cursor-grab gap-2 px-2 active:cursor-grabbing [&_.cn-command-item-indicator]:hidden';

	function onDragStart(event: DragEvent, item: StyledPaletteItem) {
		if (!event.dataTransfer) return;
		const payload: WorkflowPaletteItem = {
			id: item.id,
			variant: item.variant,
			incomplete: item.incomplete
		};
		event.dataTransfer.setData(WORKFLOW_DRAG_MIME, JSON.stringify(payload));
		event.dataTransfer.effectAllowed = 'move';
	}

	function itemHoverCardDescription(item: StyledPaletteItem): string | undefined {
		const description = workflowItemDescription(item.id);
		return description || undefined;
	}

	function showItemHoverCard(item: StyledPaletteItem): boolean {
		return Boolean(itemHoverCardDescription(item) || item.incomplete);
	}
</script>

{#snippet paletteCommandItem(item: StyledPaletteItem)}
	{@const Icon = workflowItemIcon(item.id)}
	{@const iconModifier = workflowItemIconModifier(item.id)}
	{@const itemPaletteSection = workflowPaletteSection(item.id, item.variant)}
	{@const itemLabel = workflowItemLabel(item.id)}
	<Command.Item
		value={itemLabel}
		class={commandItemClass}
		draggable="true"
		ondragstart={(event) => onDragStart(event, item)}
	>
		<GripVertical class="size-4 shrink-0 text-muted-foreground/70" aria-hidden="true" />
		<span
			class="flex size-7 shrink-0 items-center justify-center rounded-md {sectionIconBgClass[
				itemPaletteSection
			]}"
		>
			<Icon class="size-3.5 text-white {iconModifier ?? ''}" />
		</span>
		<span class="min-w-0 flex-1 truncate">{itemLabel}</span>

		{#if showItemHoverCard(item)}
			<HoverCard.Root openDelay={200} closeDelay={100}>
				<HoverCard.Trigger>
					{#snippet child({ props })}
						<button
							{...props}
							type="button"
							class="inline-flex shrink-0 cursor-pointer rounded-sm p-0.5 text-muted-foreground hover:text-foreground"
							onclick={(event) => event.stopPropagation()}
							onpointerdown={(event) => event.stopPropagation()}
						>
							<Info class="size-3.5" />
							<span class="sr-only">{itemLabel}</span>
						</button>
					{/snippet}
				</HoverCard.Trigger>
				<HoverCard.Content side="right" class="w-56">
					<div class="space-y-1">
						<h4 class="text-sm font-semibold">{itemLabel}</h4>
						{#if itemHoverCardDescription(item)}
							<p class="text-sm text-muted-foreground">
								{itemHoverCardDescription(item)}
							</p>
						{/if}
						{#if item.incomplete}
							<p class="text-sm text-destructive">
								{m.fan_action_flow_must_complete()}
							</p>
						{/if}
					</div>
				</HoverCard.Content>
			</HoverCard.Root>
		{/if}
	</Command.Item>
{/snippet}

{#snippet paletteBlocksCommand(sections: WorkflowPaletteSectionConfig[])}
	<div class="px-4 pb-1">
		<Command.Root class={commandRootClass}>
			<Command.Input placeholder={m.fan_action_flow_blocks_search_placeholder()} />
			<Command.List class={commandListClass}>
				<Command.Empty>{m.fan_action_flow_blocks_no_results()}</Command.Empty>
				{#each sections as section (section.id)}
					{#if section.items.length > 0}
						<Command.Group heading={section.label} value={section.id}>
							{#each section.items as item (item.id)}
								{@render paletteCommandItem(item)}
							{/each}
						</Command.Group>
					{/if}
				{/each}
			</Command.List>
		</Command.Root>
	</div>
{/snippet}

<aside class="min-h-0 w-full flex-1 overflow-y-auto bg-transparent">
	<Accordion.Root type="multiple" value={['blocks']} class="rounded-none border-0">
		<Accordion.Item value="basic-info" class={accordionItemClass}>
			<Accordion.Trigger class={accordionTriggerClass}>
				{m.fan_action_flow_accordion_basic_info()}
			</Accordion.Trigger>
			<Accordion.Content class={accordionContentClass}>
				<BasicInfoForm {action} />
			</Accordion.Content>
		</Accordion.Item>

		<Accordion.Item value="blocks" class={accordionItemClass}>
			<Accordion.Trigger class={accordionTriggerClass}>
				{m.fan_action_flow_accordion_blocks()}
			</Accordion.Trigger>
			<Accordion.Content class={accordionContentClass}>
				{@render paletteBlocksCommand(paletteSections)}
			</Accordion.Content>
		</Accordion.Item>

		<Accordion.Item value="settings" class={accordionItemClass}>
			<Accordion.Trigger class={accordionTriggerClass}>
				{m.fan_action_tab_settings()}
			</Accordion.Trigger>
			<Accordion.Content class={accordionContentClass}>
				<SettingsForm />
			</Accordion.Content>
		</Accordion.Item>
	</Accordion.Root>
</aside>
