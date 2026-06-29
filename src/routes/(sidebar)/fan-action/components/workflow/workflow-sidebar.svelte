<script lang="ts">
	import * as Tabs from '$lib/components/ui/tabs/index.js';
	import * as Accordion from '$lib/components/ui/accordion/index.js';
	import Forward from '@lucide/svelte/icons/forward';
	import GitFork from '@lucide/svelte/icons/git-fork';
	import Mail from '@lucide/svelte/icons/mail';
	import MessageSquare from '@lucide/svelte/icons/message-square';
	import Bell from '@lucide/svelte/icons/bell';
	import Clock from '@lucide/svelte/icons/clock';
	import Tag from '@lucide/svelte/icons/tag';
	import Star from '@lucide/svelte/icons/star';
	import type { WorkflowPaletteItem } from './workflow-types';
	import { WORKFLOW_DRAG_MIME } from './workflow-types';
	import * as m from '$lib/paraglide/messages.js';

	let { activeTab = $bindable('triggers') }: { activeTab?: string } = $props();

	const triggerItems = $derived<WorkflowPaletteItem[]>([
		{ id: 'run-now', label: m.fan_action_flow_trigger_run_now(), variant: 'trigger' },
		{ id: 'schedule', label: m.fan_action_flow_trigger_schedule(), variant: 'trigger' },
		{ id: 'loyalty', label: m.fan_action_flow_trigger_loyalty(), variant: 'trigger' },
		{ id: 'ticket', label: m.fan_action_flow_trigger_ticket(), variant: 'trigger' },
		{ id: 'season-ticket', label: m.fan_action_flow_trigger_season_ticket(), variant: 'trigger' },
		{ id: 'attended', label: m.fan_action_flow_trigger_attended(), variant: 'trigger' }
	]);

	const actionItems = $derived<WorkflowPaletteItem[]>([
		{ id: 'email', label: m.fan_action_flow_action_email(), variant: 'action', incomplete: true },
		{ id: 'sms', label: m.fan_action_flow_action_sms(), variant: 'action', incomplete: true },
		{ id: 'push', label: m.fan_action_flow_action_push(), variant: 'action', incomplete: true },
		{ id: 'wait', label: m.fan_action_flow_action_wait(), variant: 'action', incomplete: true },
		{ id: 'tag', label: m.fan_action_flow_action_tag(), variant: 'action', incomplete: true },
		{ id: 'points', label: m.fan_action_flow_action_points(), variant: 'action', incomplete: true },
		{
			id: 'condition',
			label: m.fan_action_flow_condition(),
			variant: 'condition',
			incomplete: true
		}
	]);

	const collapsedCategories = $derived([
		m.fan_action_flow_category_temporal(),
		m.fan_action_flow_category_ticketing(),
		m.fan_action_flow_category_eshop(),
		m.fan_action_flow_category_call_center(),
		m.fan_action_flow_category_mobile_app(),
		m.fan_action_flow_category_other()
	]);

	function onDragStart(event: DragEvent, item: WorkflowPaletteItem) {
		if (!event.dataTransfer) return;
		event.dataTransfer.setData(WORKFLOW_DRAG_MIME, JSON.stringify(item));
		event.dataTransfer.effectAllowed = 'move';
	}

	function paletteIcon(item: WorkflowPaletteItem) {
		if (item.variant === 'trigger') return Forward;
		if (item.variant === 'condition') return GitFork;
		if (item.id === 'sms') return MessageSquare;
		if (item.id === 'push') return Bell;
		if (item.id === 'wait') return Clock;
		if (item.id === 'tag') return Tag;
		if (item.id === 'points') return Star;
		return Mail;
	}
</script>

<aside class="flex w-72 shrink-0 flex-col border-l bg-background">
	<Tabs.Root bind:value={activeTab} class="flex min-h-0 flex-1 flex-col gap-0">
		<Tabs.List class="h-10 w-full shrink-0 rounded-none border-b bg-transparent">
			<Tabs.Trigger class="flex-1 rounded-none" value="triggers"
				>{m.fan_action_flow_tab_triggers()}</Tabs.Trigger
			>
			<Tabs.Trigger class="flex-1 rounded-none" value="actions"
				>{m.fan_action_flow_tab_actions()}</Tabs.Trigger
			>
		</Tabs.List>

		<Tabs.Content class="mt-0 min-h-0 flex-1 overflow-y-auto p-0" value="triggers">
			<Accordion.Root type="multiple" value={['common']} class="w-full">
				<Accordion.Item value="common" class="border-b px-3">
					<Accordion.Trigger
						class="py-3 text-xs font-semibold tracking-wide uppercase hover:no-underline"
					>
						{m.fan_action_flow_category_common()}
					</Accordion.Trigger>
					<Accordion.Content class="pb-3">
						<ul class="space-y-1">
							{#each triggerItems as item (item.id)}
								{@const Icon = paletteIcon(item)}
								<li>
									<button
										type="button"
										class="flex w-full cursor-grab items-center gap-2 rounded-md px-2 py-2 text-left text-sm hover:bg-accent active:cursor-grabbing"
										draggable="true"
										ondragstart={(event) => onDragStart(event, item)}
									>
										<span
											class="flex size-6 items-center justify-center rounded bg-sky-500/15 text-sky-600"
										>
											<Icon class="size-3.5" />
										</span>
										{item.label}
									</button>
								</li>
							{/each}
						</ul>
					</Accordion.Content>
				</Accordion.Item>

				{#each collapsedCategories as category (category)}
					<Accordion.Item value={category} class="border-b px-3">
						<Accordion.Trigger
							class="py-3 text-xs font-semibold tracking-wide uppercase hover:no-underline"
						>
							{category}
						</Accordion.Trigger>
						<Accordion.Content class="pb-3 text-sm text-muted-foreground">—</Accordion.Content>
					</Accordion.Item>
				{/each}
			</Accordion.Root>
		</Tabs.Content>

		<Tabs.Content class="mt-0 min-h-0 flex-1 overflow-y-auto p-3" value="actions">
			<ul class="space-y-1">
				{#each actionItems as item (item.id)}
					{@const Icon = paletteIcon(item)}
					<li>
						<button
							type="button"
							class="flex w-full cursor-grab items-center gap-2 rounded-md px-2 py-2 text-left text-sm hover:bg-accent active:cursor-grabbing"
							draggable="true"
							ondragstart={(event) => onDragStart(event, item)}
						>
							<span
								class="flex size-6 items-center justify-center rounded {item.variant === 'condition'
									? 'bg-orange-400/15 text-orange-600'
									: 'bg-emerald-500/15 text-emerald-600'}"
							>
								<Icon class="size-3.5 {item.variant === 'condition' ? 'rotate-90' : ''}" />
							</span>
							{item.label}
						</button>
					</li>
				{/each}
			</ul>
		</Tabs.Content>
	</Tabs.Root>
</aside>
