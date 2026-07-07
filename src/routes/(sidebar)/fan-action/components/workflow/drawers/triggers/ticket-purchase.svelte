<script lang="ts">
	import { Label } from '$lib/components/ui/label/index.js';
	import { Switch } from '$lib/components/ui/switch/index.js';
	import * as HoverCard from '$lib/components/ui/hover-card/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import Info from '@lucide/svelte/icons/info';
	import { allEventLists } from '../../../../temp/options';
	import * as m from '$lib/paraglide/messages.js';

	const labelClass = 'text-sm font-medium text-muted-foreground';
	const selectTriggerClass = 'w-full border border-border bg-background';

	let eventList = $state('');
	let reseatedOnly = $state(true);

	function eventListLabel(id: string) {
		return allEventLists.find((list) => list === id) ?? id;
	}
</script>

<div class="space-y-3">
	<div class="space-y-2">
		<Label class={labelClass}>{m.fan_action_flow_trigger_ticket_purchase_event_lists_label()}</Label
		>
		<Select.Root type="single" bind:value={eventList}>
			<Select.Trigger class={selectTriggerClass}>
				{#if eventList}
					{eventListLabel(eventList)}
				{:else}
					<span class="text-muted-foreground">
						{m.fan_action_flow_trigger_ticket_purchase_event_lists_placeholder()}
					</span>
				{/if}
			</Select.Trigger>
			<Select.Content>
				<Select.Group>
					{#each allEventLists as list (list)}
						<Select.Item value={list} label={list}>{list}</Select.Item>
					{/each}
				</Select.Group>
			</Select.Content>
		</Select.Root>
	</div>

	<div class="flex items-center justify-between gap-2">
		<div class="flex min-w-0 items-center gap-1.5">
			<Label class={labelClass} for="ticket-purchase-reseated-only">
				{m.fan_action_flow_trigger_ticket_purchase_reseated_only()}
			</Label>
			<HoverCard.Root openDelay={200} closeDelay={100}>
				<HoverCard.Trigger>
					{#snippet child({ props })}
						<button
							{...props}
							type="button"
							class="inline-flex shrink-0 cursor-pointer rounded-sm p-0.5 text-muted-foreground hover:text-foreground"
						>
							<Info class="size-3.5" />
							<span class="sr-only"
								>{m.fan_action_flow_trigger_ticket_purchase_reseated_only()}</span
							>
						</button>
					{/snippet}
				</HoverCard.Trigger>
				<HoverCard.Content side="left" class="w-56">
					<p class="text-sm text-muted-foreground">
						{m.fan_action_flow_trigger_ticket_purchase_reseated_only_info()}
					</p>
				</HoverCard.Content>
			</HoverCard.Root>
		</div>
		<Switch id="ticket-purchase-reseated-only" bind:checked={reseatedOnly} class="shrink-0" />
	</div>
</div>
