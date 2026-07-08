<script lang="ts">
	import * as Accordion from '$lib/components/ui/accordion/index.js';
	import * as HoverCard from '$lib/components/ui/hover-card/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import GripVertical from '@lucide/svelte/icons/grip-vertical';
	import Info from '@lucide/svelte/icons/info';
	import Search from '@lucide/svelte/icons/search';
	import type { WorkflowPaletteItem } from './types';
	import { WORKFLOW_DRAG_MIME } from './types';
	import {
		workflowActionPaletteItems,
		workflowItemDescription,
		workflowItemIcon,
		workflowItemIconModifier,
		workflowItemLabel,
		workflowOperatorPaletteItems
	} from './workflow-items';
	import { workflowNodeIconClass } from './node-styles';
	import { workflowTriggerPaletteGroups, type WorkflowTriggerPaletteGroup } from './trigger-items';
	import BasicInfoForm from '../basic-info-form.svelte';
	import SettingsForm from '../settings-form.svelte';
	import type { FanAction } from '$lib/types/fan-action.js';
	import * as m from '$lib/paraglide/messages.js';

	let { action = null }: { action?: FanAction | null } = $props();

	type StyledPaletteItem = WorkflowPaletteItem;

	let searchQuery = $state('');
	let openTriggerCategories = $state<string[]>(['common']);
	let openTriggerCategoriesSnapshot = $state<string[] | null>(null);

	const accordionTriggerClass =
		'cursor-pointer px-4 py-3.5 text-base font-semibold hover:no-underline';
	const accordionContentClass = 'px-0 pt-0 pb-2';
	const accordionItemClass = 'cursor-pointer [&_[data-slot=accordion-content]]:cursor-auto';
	const triggerCategoryAccordionRootClass =
		'rounded-none border-0 bg-transparent [&_[data-slot=accordion-item]]:border-0 [&_[data-slot=accordion-item]]:bg-transparent [&_[data-slot=accordion-item][data-open]]:bg-transparent [&_[data-slot=accordion-content]]:px-0';
	const triggerCategoryAccordionTriggerClass =
		'cursor-pointer !px-0 !py-1.5 text-sm font-medium text-muted-foreground hover:no-underline';
	const triggerCategoryAccordionContentClass = '!p-0';
	const triggerCategoryAccordionItemClass = 'border-0 bg-transparent data-open:bg-transparent';
	const blocksListClass = 'min-h-[13.75rem] space-y-3 pb-1';
	const subheadingClass = 'text-sm font-medium text-muted-foreground';
	const paletteRowClass = 'flex w-full items-center gap-2 py-1.5 hover:bg-accent/50';
	const paletteItemButtonClass =
		'flex min-w-0 flex-1 cursor-grab items-center gap-2 text-left active:cursor-grabbing';

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

	function matchesSearch(item: StyledPaletteItem): boolean {
		const query = searchQuery.trim().toLowerCase();
		if (!query) return true;
		return workflowItemLabel(item.id).toLowerCase().includes(query);
	}

	function filterItems(items: StyledPaletteItem[]): StyledPaletteItem[] {
		return items.filter(matchesSearch);
	}

	const triggerGroups = $derived<WorkflowTriggerPaletteGroup[]>(
		workflowTriggerPaletteGroups()
			.map((group) => ({
				...group,
				items: filterItems(group.items)
			}))
			.filter((group) => group.items.length > 0)
	);

	$effect(() => {
		const query = searchQuery.trim();

		if (query) {
			if (openTriggerCategoriesSnapshot === null) {
				openTriggerCategoriesSnapshot = [...openTriggerCategories];
			}
			openTriggerCategories = triggerGroups.map((group) => group.id);
			return;
		}

		if (openTriggerCategoriesSnapshot !== null) {
			openTriggerCategories = [...openTriggerCategoriesSnapshot];
			openTriggerCategoriesSnapshot = null;
		}
	});

	const operatorItems = $derived(filterItems(workflowOperatorPaletteItems()));
	const actionItems = $derived(filterItems(workflowActionPaletteItems()));

	const hasBlockResults = $derived(
		triggerGroups.length > 0 || operatorItems.length > 0 || actionItems.length > 0
	);
</script>

{#snippet paletteItemRow(item: StyledPaletteItem)}
	{@const Icon = workflowItemIcon(item.id)}
	{@const iconModifier = workflowItemIconModifier(item.id)}
	{@const itemLabel = workflowItemLabel(item.id)}
	<li>
		<div class={paletteRowClass}>
			<button
				type="button"
				class={paletteItemButtonClass}
				draggable="true"
				ondragstart={(event) => onDragStart(event, item)}
			>
				<GripVertical class="size-4 shrink-0 text-muted-foreground/70" aria-hidden="true" />
				<Icon
					class="size-4 shrink-0 {workflowNodeIconClass(item.id, item.variant)} {iconModifier ??
						''}"
				/>
				<span class="min-w-0 flex-1 truncate text-sm">{itemLabel}</span>
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
		</div>
	</li>
{/snippet}

{#snippet paletteItemList(items: StyledPaletteItem[])}
	<ul class="space-y-0.5">
		{#each items as item (item.id)}
			{@render paletteItemRow(item)}
		{/each}
	</ul>
{/snippet}

{#snippet paletteBlocksList()}
	<div class={blocksListClass}>
		<div class="relative mt-3">
			<Search
				class="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
				aria-hidden="true"
			/>
			<Input
				bind:value={searchQuery}
				class="w-full bg-background pl-9"
				placeholder={m.fan_action_flow_blocks_search_placeholder()}
			/>
		</div>

		{#if !hasBlockResults}
			<p class="py-6 text-center text-sm text-muted-foreground">
				{m.fan_action_flow_blocks_no_results()}
			</p>
		{:else}
			{#if triggerGroups.length > 0}
				<Accordion.Root
					type="multiple"
					bind:value={openTriggerCategories}
					class={triggerCategoryAccordionRootClass}
				>
					{#each triggerGroups as group (group.id)}
						<Accordion.Item value={group.id} class={triggerCategoryAccordionItemClass}>
							<Accordion.Trigger class={triggerCategoryAccordionTriggerClass}>
								{group.label}
							</Accordion.Trigger>
							<Accordion.Content class={triggerCategoryAccordionContentClass}>
								{@render paletteItemList(group.items)}
							</Accordion.Content>
						</Accordion.Item>
					{/each}
				</Accordion.Root>
			{/if}

			{#if operatorItems.length > 0}
				<section class="space-y-2">
					<Label class={subheadingClass}>{m.fan_action_flow_section_operators()}</Label>
					{@render paletteItemList(operatorItems)}
				</section>
			{/if}

			{#if actionItems.length > 0}
				<section class="space-y-2">
					<Label class={subheadingClass}>{m.fan_action_flow_tab_actions()}</Label>
					{@render paletteItemList(actionItems)}
				</section>
			{/if}
		{/if}
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
				{@render paletteBlocksList()}
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
