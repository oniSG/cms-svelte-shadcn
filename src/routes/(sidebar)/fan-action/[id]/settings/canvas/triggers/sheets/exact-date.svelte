<script lang="ts">
	import TimePicker from '$lib/components/custom/time-picker.svelte';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import * as m from '$lib/paraglide/messages.js';

	type DateProperty = 'holiday' | 'birthday' | 'membership-expiry';
	type DayOffsetOperator = '+' | '-';

	const labelClass = 'text-sm font-medium text-muted-foreground';
	const selectTriggerClass = 'w-full border border-border bg-background';
	const helpTextClass = 'text-sm text-muted-foreground';

	const dateProperties = [
		{ id: 'holiday', label: m.fan_action_flow_trigger_exact_date_property_holiday },
		{ id: 'birthday', label: m.fan_action_flow_trigger_exact_date_property_birthday },
		{
			id: 'membership-expiry',
			label: m.fan_action_flow_trigger_exact_date_property_membership_expiry
		}
	] as const satisfies ReadonlyArray<{ id: DateProperty; label: () => string }>;

	const dayOffsetOperators = [
		{ id: '+', label: m.fan_action_flow_trigger_exact_date_day_offset_after },
		{ id: '-', label: m.fan_action_flow_trigger_exact_date_day_offset_before }
	] as const satisfies ReadonlyArray<{ id: DayOffsetOperator; label: () => string }>;

	let dateProperty = $state<DateProperty | ''>('');
	let dayOffsetOperator = $state<DayOffsetOperator>('+');
	let dayOffsetValue = $state('1');
	let checkTime = $state('04:00');

	function datePropertyLabel(property: DateProperty | '') {
		if (!property) return '';
		return dateProperties.find((item) => item.id === property)?.label() ?? property;
	}

	function dayOffsetOperatorLabel(operator: DayOffsetOperator) {
		return dayOffsetOperators.find((item) => item.id === operator)?.label() ?? operator;
	}
</script>

<div class="space-y-3">
	<div class="space-y-2">
		<Label class={labelClass}>
			{m.fan_action_flow_trigger_exact_date_property_label()}
			<span class="text-destructive">*</span>
		</Label>
		<Select.Root type="single" bind:value={dateProperty}>
			<Select.Trigger class={selectTriggerClass}>
				{#if dateProperty}
					{datePropertyLabel(dateProperty)}
				{:else}
					<span class="text-muted-foreground">
						{m.fan_action_flow_trigger_exact_date_property_placeholder()}
					</span>
				{/if}
			</Select.Trigger>
			<Select.Content>
				<Select.Group>
					{#each dateProperties as property (property.id)}
						<Select.Item value={property.id} label={property.label()}>
							{property.label()}
						</Select.Item>
					{/each}
				</Select.Group>
			</Select.Content>
		</Select.Root>
		{#if dateProperty === 'holiday'}
			<p class={helpTextClass}>{m.fan_action_flow_trigger_exact_date_property_holiday_help()}</p>
		{/if}
	</div>

	<div class="space-y-2">
		<Label class={labelClass}>{m.fan_action_flow_trigger_exact_date_day_offset_label()}</Label>
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
			<Input
				bind:value={dayOffsetValue}
				type="number"
				min="0"
				class="min-w-0 flex-1 bg-background"
			/>
		</div>
	</div>

	<div class="space-y-2">
		<Label class={labelClass}>
			{m.fan_action_flow_trigger_exact_date_check_time_label()}
			<span class="text-destructive">*</span>
		</Label>
		<TimePicker bind:value={checkTime} />
	</div>
</div>
