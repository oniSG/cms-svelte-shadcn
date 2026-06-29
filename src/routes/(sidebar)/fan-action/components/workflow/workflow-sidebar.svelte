<script lang="ts">
	import * as Tabs from '$lib/components/ui/tabs/index.js';
	import * as Accordion from '$lib/components/ui/accordion/index.js';
	import type { Component } from 'svelte';
	import Forward from '@lucide/svelte/icons/forward';
	import GitFork from '@lucide/svelte/icons/git-fork';
	import Mail from '@lucide/svelte/icons/mail';
	import MessageSquare from '@lucide/svelte/icons/message-square';
	import Smartphone from '@lucide/svelte/icons/smartphone';
	import Clock from '@lucide/svelte/icons/clock';
	import Tag from '@lucide/svelte/icons/tag';
	import Coins from '@lucide/svelte/icons/coins';
	import Gauge from '@lucide/svelte/icons/gauge';
	import List from '@lucide/svelte/icons/list';
	import Gift from '@lucide/svelte/icons/gift';
	import CircleAlert from '@lucide/svelte/icons/circle-alert';
	import type { WorkflowPaletteItem } from './workflow-types';
	import { WORKFLOW_DRAG_MIME } from './workflow-types';
	import * as m from '$lib/paraglide/messages.js';

	type PaletteIconTone = 'sky' | 'emerald' | 'orange' | 'muted' | 'destructive';

	type StyledPaletteItem = WorkflowPaletteItem & {
		iconTone: PaletteIconTone;
		iconClass?: string;
	};

	type PaletteCategory = {
		id: string;
		label: string;
		items: StyledPaletteItem[];
	};

	let { activeTab = $bindable('triggers') }: { activeTab?: string } = $props();

	const triggerCategories = $derived<PaletteCategory[]>([
		{
			id: 'common',
			label: m.fan_action_flow_category_common(),
			items: [
				{
					id: 'run-now',
					label: m.fan_action_flow_trigger_run_now(),
					variant: 'trigger',
					iconTone: 'sky'
				},
				{
					id: 'schedule',
					label: m.fan_action_flow_trigger_schedule(),
					variant: 'trigger',
					iconTone: 'sky'
				},
				{
					id: 'loyalty',
					label: m.fan_action_flow_trigger_loyalty(),
					variant: 'trigger',
					iconTone: 'sky'
				},
				{
					id: 'ticket',
					label: m.fan_action_flow_trigger_ticket(),
					variant: 'trigger',
					iconTone: 'sky'
				},
				{
					id: 'season-ticket',
					label: m.fan_action_flow_trigger_season_ticket(),
					variant: 'trigger',
					iconTone: 'sky'
				},
				{
					id: 'attended',
					label: m.fan_action_flow_trigger_attended(),
					variant: 'trigger',
					iconTone: 'sky'
				}
			]
		},
		{
			id: 'temporal',
			label: m.fan_action_flow_category_temporal(),
			items: []
		},
		{
			id: 'ticketing',
			label: m.fan_action_flow_category_ticketing(),
			items: []
		},
		{
			id: 'eshop',
			label: m.fan_action_flow_category_eshop(),
			items: []
		},
		{
			id: 'call-center',
			label: m.fan_action_flow_category_call_center(),
			items: []
		},
		{
			id: 'mobile-app',
			label: m.fan_action_flow_category_mobile_app(),
			items: []
		},
		{
			id: 'other',
			label: m.fan_action_flow_category_other(),
			items: []
		}
	]);

	const actionCategories = $derived<PaletteCategory[]>([
		{
			id: 'send',
			label: m.fan_action_flow_category_send(),
			items: [
				{
					id: 'email',
					label: m.fan_action_flow_action_email(),
					variant: 'action',
					incomplete: true,
					iconTone: 'emerald'
				},
				{
					id: 'sms',
					label: m.fan_action_flow_action_sms(),
					variant: 'action',
					incomplete: true,
					iconTone: 'emerald'
				},
				{
					id: 'push',
					label: m.fan_action_flow_action_push(),
					variant: 'action',
					incomplete: true,
					iconTone: 'emerald'
				}
			]
		},
		{
			id: 'automation',
			label: m.fan_action_flow_category_automation(),
			items: [
				{
					id: 'wait',
					label: m.fan_action_flow_action_wait(),
					variant: 'action',
					incomplete: true,
					iconTone: 'muted'
				},
				{
					id: 'condition',
					label: m.fan_action_flow_condition_add(),
					variant: 'condition',
					incomplete: true,
					iconTone: 'orange',
					iconClass: 'rotate-90'
				},
				{
					id: 'tag',
					label: m.fan_action_flow_action_tag(),
					variant: 'action',
					incomplete: true,
					iconTone: 'emerald'
				},
				{
					id: 'remove-tag',
					label: m.fan_action_flow_action_remove_tag(),
					variant: 'action',
					incomplete: true,
					iconTone: 'destructive'
				},
				{
					id: 'credit',
					label: m.fan_action_flow_action_credit(),
					variant: 'action',
					incomplete: true,
					iconTone: 'emerald'
				},
				{
					id: 'ab-test',
					label: m.fan_action_flow_action_ab_test(),
					variant: 'action',
					incomplete: true,
					iconTone: 'orange'
				},
				{
					id: 'custom-attribute',
					label: m.fan_action_flow_action_custom_attribute(),
					variant: 'action',
					incomplete: true,
					iconTone: 'emerald'
				},
				{
					id: 'reward-conversion',
					label: m.fan_action_flow_action_reward_conversion(),
					variant: 'action',
					incomplete: true,
					iconTone: 'emerald'
				}
			]
		}
	]);

	const iconToneClass: Record<PaletteIconTone, string> = {
		sky: 'text-chart-3',
		emerald: 'text-chart-1',
		orange: 'text-chart-9',
		muted: 'text-muted-foreground',
		destructive: 'text-destructive'
	};

	function onDragStart(event: DragEvent, item: WorkflowPaletteItem) {
		if (!event.dataTransfer) return;
		event.dataTransfer.setData(WORKFLOW_DRAG_MIME, JSON.stringify(item));
		event.dataTransfer.effectAllowed = 'move';
	}

	function paletteIcon(item: StyledPaletteItem): Component {
		if (item.variant === 'trigger') return Forward;
		if (item.variant === 'condition') return GitFork;
		if (item.id === 'sms') return MessageSquare;
		if (item.id === 'push') return Smartphone;
		if (item.id === 'wait') return Clock;
		if (item.id === 'tag' || item.id === 'remove-tag') return Tag;
		if (item.id === 'credit') return Coins;
		if (item.id === 'ab-test') return Gauge;
		if (item.id === 'custom-attribute') return List;
		if (item.id === 'reward-conversion') return Gift;
		return Mail;
	}
</script>

{#snippet paletteCategories(categories: PaletteCategory[], openIds: string[])}
	<Accordion.Root type="multiple" value={openIds} class="space-y-2 border-none">
		{#each categories as category (category.id)}
			<Accordion.Item value={category.id} class="overflow-hidden rounded-lg border bg-background">
				<Accordion.Trigger
					class="rounded-none bg-muted/50 px-3 py-2.5 text-sm font-medium hover:no-underline [&[data-state=open]]:border-b"
				>
					{category.label}
				</Accordion.Trigger>
				<Accordion.Content class="px-0 pb-0">
					{#if category.items.length > 0}
						<ul class="divide-y">
							{#each category.items as item (item.id)}
								{@const Icon = paletteIcon(item)}
								<li>
									<button
										type="button"
										class="flex w-full cursor-grab items-center gap-3 px-3 py-2.5 text-left text-sm hover:bg-accent/50 active:cursor-grabbing"
										draggable="true"
										ondragstart={(event) => onDragStart(event, item)}
									>
										<Icon
											class="size-4 shrink-0 {iconToneClass[item.iconTone]} {item.iconClass ?? ''}"
										/>
										<span class="min-w-0 flex-1 truncate">{item.label}</span>
										{#if item.incomplete}
											<CircleAlert class="size-4 shrink-0 text-destructive" />
										{/if}
									</button>
								</li>
							{/each}
						</ul>
					{:else}
						<p class="px-3 py-2.5 text-sm text-muted-foreground">—</p>
					{/if}
				</Accordion.Content>
			</Accordion.Item>
		{/each}
	</Accordion.Root>
{/snippet}

<aside class="flex w-72 shrink-0 flex-col border-l bg-background">
	<Tabs.Root bind:value={activeTab} class="flex min-h-0 flex-1 flex-col gap-0">
		<Tabs.List
			variant="line"
			class="h-10 w-full shrink-0 rounded-none border-b bg-transparent px-3"
		>
			<Tabs.Trigger
				class="flex-1 rounded-none text-xs font-bold tracking-wide uppercase data-[state=active]:text-emerald-600 data-[state=active]:after:bg-emerald-500"
				value="triggers"
			>
				{m.fan_action_flow_tab_triggers()}
			</Tabs.Trigger>
			<Tabs.Trigger
				class="flex-1 rounded-none text-xs font-bold tracking-wide uppercase data-[state=active]:text-emerald-600 data-[state=active]:after:bg-emerald-500"
				value="actions"
			>
				{m.fan_action_flow_tab_actions()}
			</Tabs.Trigger>
		</Tabs.List>

		<Tabs.Content class="mt-2 min-h-0 flex-1 overflow-y-auto px-3 pb-3" value="triggers">
			{@render paletteCategories(triggerCategories, ['common'])}
		</Tabs.Content>

		<Tabs.Content class="mt-2 min-h-0 flex-1 overflow-y-auto px-3 pb-3" value="actions">
			{@render paletteCategories(actionCategories, ['send', 'automation'])}
		</Tabs.Content>
	</Tabs.Root>
</aside>
