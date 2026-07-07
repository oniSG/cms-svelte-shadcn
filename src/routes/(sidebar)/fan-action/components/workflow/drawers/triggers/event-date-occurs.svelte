<script lang="ts">
	import TimePicker from '$lib/components/custom/time-picker.svelte';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Switch } from '$lib/components/ui/switch/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import { allEventLists } from '../../../../temp/options';
	import * as m from '$lib/paraglide/messages.js';

	type DayOffsetOperator = '+' | '-';

	const labelClass = 'text-sm font-medium text-muted-foreground';
	const selectTriggerClass = 'w-full border border-border bg-background';

	const dayOffsetOperators = [
		{ id: '+', label: m.fan_action_flow_trigger_exact_date_day_offset_after },
		{ id: '-', label: m.fan_action_flow_trigger_exact_date_day_offset_before }
	] as const satisfies ReadonlyArray<{ id: DayOffsetOperator; label: () => string }>;

	const dayValues = Array.from({ length: 31 }, (_, index) => String(index));

	let eventList = $state('');
	let dayOffsetOperator = $state<DayOffsetOperator>('+');
	let dayOffsetValue = $state('0');
	let hourOffsetValue = $state('00:00');
	let pointsEventsOnly = $state(false);

	function eventListLabel(id: string) {
		return allEventLists.find((list) => list === id) ?? id;
	}

	function dayOffsetOperatorLabel(operator: DayOffsetOperator) {
		return dayOffsetOperators.find((item) => item.id === operator)?.label() ?? operator;
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

	<div class="space-y-2">
		<Label class={labelClass}>
			{m.fan_action_flow_trigger_event_date_occurs_days_label()}
			<span class="text-destructive">*</span>
		</Label>
		<div class="flex gap-2">
			<Select.Root type="single" bind:value={dayOffsetOperator}>
				<Select.Trigger class="{selectTriggerClass} w-20 shrink-0">
					{dayOffsetOperatorLabel(dayOffsetOperator)}
				</Select.Trigger>
				<Select.Content>
					<Select.Group>
						{#each dayOffsetOperators as operator (operator.id)}
							<Select.Item value={operator.id} label={operator.label()}>
								{operator.label()}
							</Select.Item>
						{/each}
					</Select.Group>
				</Select.Content>
			</Select.Root>
			<Select.Root type="single" bind:value={dayOffsetValue}>
				<Select.Trigger class="{selectTriggerClass} min-w-0 flex-1">
					{dayOffsetValue}
				</Select.Trigger>
				<Select.Content>
					<Select.Group>
						{#each dayValues as value (value)}
							<Select.Item {value} label={value}>{value}</Select.Item>
						{/each}
					</Select.Group>
				</Select.Content>
			</Select.Root>
		</div>
	</div>

	<div class="space-y-2">
		<Label class={labelClass}>
			{m.fan_action_flow_trigger_event_date_occurs_hours_label()}
			<span class="text-destructive">*</span>
		</Label>
		<TimePicker bind:value={hourOffsetValue} />
	</div>

	<div class="flex items-center justify-between gap-2">
		<Label class={labelClass} for="event-date-occurs-points-only">
			{m.fan_action_flow_trigger_event_date_occurs_points_only()}
		</Label>
		<Switch id="event-date-occurs-points-only" bind:checked={pointsEventsOnly} class="shrink-0" />
	</div>
</div>
