<script lang="ts">
	import * as Accordion from '$lib/components/ui/accordion/index.js';
	import * as HoverCard from '$lib/components/ui/hover-card/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import GripVertical from '@lucide/svelte/icons/grip-vertical';
	import Info from '@lucide/svelte/icons/info';
	import type { WorkflowPaletteItem } from './workflow-types';
	import { WORKFLOW_DRAG_MIME } from './workflow-types';
	import { workflowItemDescription, workflowItemLabel } from './workflow-labels';
	import { workflowItemIcon, workflowItemIconModifier } from './workflow-icons';
	import { workflowPaletteSectionBgClass } from './workflow-node-colors';
	import FanActionBasicForm from '../fan-action-basic-form.svelte';
	import FanActionSettingsForm from '../fan-action-settings-form.svelte';
	import * as m from '$lib/paraglide/messages.js';

	type PaletteSectionId = 'triggers' | 'operators' | 'actions';

	type StyledPaletteItem = WorkflowPaletteItem;

	type PaletteSection = {
		id: PaletteSectionId;
		label: string;
		items: StyledPaletteItem[];
	};

	const paletteSections = $derived<PaletteSection[]>([
		{
			id: 'triggers',
			label: m.fan_action_flow_tab_triggers(),
			items: [
				{ id: 'run-now', variant: 'trigger' },
				{ id: 'schedule', variant: 'trigger' },
				{ id: 'loyalty', variant: 'trigger' },
				{ id: 'ticket', variant: 'trigger' },
				{ id: 'season-ticket', variant: 'trigger' },
				{ id: 'attended', variant: 'trigger' }
			]
		},
		{
			id: 'operators',
			label: m.fan_action_flow_section_operators(),
			items: [
				{ id: 'condition', variant: 'condition', incomplete: true },
				{ id: 'wait', variant: 'action', incomplete: true },
				{ id: 'ab-test', variant: 'action', incomplete: true },
				{ id: 'end-branch', variant: 'action', incomplete: true }
			]
		},
		{
			id: 'actions',
			label: m.fan_action_flow_tab_actions(),
			items: [
				{ id: 'email', variant: 'action', incomplete: true },
				{ id: 'sms', variant: 'action', incomplete: true },
				{ id: 'push', variant: 'action', incomplete: true },
				{ id: 'tag', variant: 'action', incomplete: true },
				{ id: 'remove-tag', variant: 'action', incomplete: true },
				{ id: 'custom-attribute', variant: 'action', incomplete: true },
				{ id: 'reward-conversion', variant: 'action', incomplete: true }
			]
		}
	]);

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

{#snippet paletteSectionsList(sections: PaletteSection[])}
	<div class="space-y-3">
		{#each sections as section (section.id)}
			{#if section.items.length > 0}
				<section class="space-y-2">
					<Label class={subheadingClass}>{section.label}</Label>

					<ul class="space-y-0.5">
						{#each section.items as item (item.id)}
							{@const Icon = workflowItemIcon(item.id, item.variant)}
							{@const iconModifier = workflowItemIconModifier(item.id, item.variant)}
							<li>
								<div
									class="flex w-full items-center gap-2 rounded-lg px-1 py-1.5 hover:bg-accent/50"
								>
									<button
										type="button"
										class="flex min-w-0 flex-1 cursor-grab items-center gap-2 text-left active:cursor-grabbing"
										draggable="true"
										ondragstart={(event) => onDragStart(event, item)}
									>
										<GripVertical
											class="size-4 shrink-0 text-muted-foreground/70"
											aria-hidden="true"
										/>
										<span
											class="flex size-7 shrink-0 items-center justify-center rounded-md {sectionIconBgClass[
												section.id
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
														class="inline-flex shrink-0 rounded-sm p-0.5 text-muted-foreground hover:text-foreground"
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
				<FanActionBasicForm />
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
				<FanActionSettingsForm />
			</Accordion.Content>
		</Accordion.Item>
	</Accordion.Root>
</aside>
