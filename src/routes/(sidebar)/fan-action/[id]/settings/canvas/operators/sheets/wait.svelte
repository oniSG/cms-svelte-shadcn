<script lang="ts">
	import type { WorkflowDrawerContentProps } from '../../../shared/types';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import * as m from '$lib/paraglide/messages.js';

	let _props: WorkflowDrawerContentProps = $props();

	type WaitIntervalUnit = 'minutes' | 'hours' | 'days' | 'weeks';

	const labelClass = 'text-sm font-medium text-muted-foreground';
	const selectTriggerClass = 'w-full border border-border bg-background';

	const intervalUnits = [
		{ id: 'minutes', label: m.fan_action_flow_wait_unit_minutes },
		{ id: 'hours', label: m.fan_action_flow_wait_unit_hours },
		{ id: 'days', label: m.fan_action_flow_wait_unit_days },
		{ id: 'weeks', label: m.fan_action_flow_wait_unit_weeks }
	] as const satisfies ReadonlyArray<{ id: WaitIntervalUnit; label: () => string }>;

	let note = $state('');
	let intervalUnit = $state<WaitIntervalUnit>('minutes');
	let intervalValue = $state('');

	function unitLabel(unit: WaitIntervalUnit) {
		return intervalUnits.find((item) => item.id === unit)?.label() ?? unit;
	}
</script>

<div class="space-y-3">
	<div class="space-y-2">
		<Label class={labelClass} for="wait-note">{m.fan_action_flow_email_note_label()}</Label>
		<Input
			bind:value={note}
			id="wait-note"
			placeholder={m.fan_action_flow_email_note_placeholder()}
		/>
	</div>

	<div class="space-y-2">
		<Label class={labelClass}>
			{m.fan_action_flow_wait_interval_unit_label()}
			<span class="text-destructive">*</span>
		</Label>
		<Select.Root type="single" bind:value={intervalUnit}>
			<Select.Trigger class={selectTriggerClass}>
				{unitLabel(intervalUnit)}
			</Select.Trigger>
			<Select.Content>
				<Select.Group>
					{#each intervalUnits as unit (unit.id)}
						<Select.Item value={unit.id} label={unit.label()}>{unit.label()}</Select.Item>
					{/each}
				</Select.Group>
			</Select.Content>
		</Select.Root>
	</div>

	<div class="space-y-2">
		<Label class={labelClass} for="wait-interval-value">
			{m.fan_action_flow_wait_interval_value_label()}
			<span class="text-destructive">*</span>
		</Label>
		<Input
			bind:value={intervalValue}
			id="wait-interval-value"
			type="number"
			min="1"
			placeholder={m.fan_action_flow_wait_interval_value_placeholder()}
		/>
	</div>
</div>
