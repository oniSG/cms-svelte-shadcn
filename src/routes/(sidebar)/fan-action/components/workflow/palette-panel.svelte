<script lang="ts">
	import * as Accordion from '$lib/components/ui/accordion/index.js';
	import * as HoverCard from '$lib/components/ui/hover-card/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
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
	const subheadingClass = 'text-sm font-medium text-muted-foreground';

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

{#snippet paletteItemRow(item: StyledPaletteItem)}
	{@const Icon = workflowItemIcon(item.id)}
	{@const iconModifier = workflowItemIconModifier(item.id)}
	{@const itemPaletteSection = workflowPaletteSection(item.id, item.variant)}
	<li>
		<div class="flex w-full items-center gap-2 rounded-lg px-1 py-1.5 hover:bg-accent/50">
			<button
				type="button"
				class="flex min-w-0 flex-1 cursor-grab items-center gap-2 text-left active:cursor-grabbing"
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
				<span class="min-w-0 flex-1 truncate text-sm">
					{workflowItemLabel(item.id)}
				</span>
			</button>

			{#if showItemHoverCard(item)}
				<HoverCard.Root openDelay={200} closeDelay={100}>
					<HoverCard.Trigger>
						{#snippet child({ props })}
							<button
								{...props}
								type="button"
								class="inline-flex shrink-0 cursor-pointer rounded-sm p-0.5 text-muted-foreground hover:text-foreground"
								onclick={(event) => event.stopPropagation()}
							>
								<Info class="size-3.5" />
								<span class="sr-only">{workflowItemLabel(item.id)}</span>
							</button>
						{/snippet}
					</HoverCard.Trigger>
					<HoverCard.Content side="right" class="w-56">
						<div class="space-y-1">
							<h4 class="text-sm font-semibold">
								{workflowItemLabel(item.id)}
							</h4>
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
		</div>
	</li>
{/snippet}

{#snippet paletteSectionsList(sections: WorkflowPaletteSectionConfig[])}
	<div class="space-y-3">
		{#each sections as section (section.id)}
			{#if section.items.length > 0}
				<section class="space-y-2">
					<Label class={subheadingClass}>{section.label}</Label>

					<ul class="space-y-0.5">
						{#each section.items as item (item.id)}
							{@render paletteItemRow(item)}
						{/each}
					</ul>
				</section>
			{/if}
		{/each}
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
				{@render paletteSectionsList(paletteSections)}
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
