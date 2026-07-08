<script lang="ts">
	import type { WorkflowDrawerContentProps } from '../../../shared/types';
	import { Label } from '$lib/components/ui/label/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import * as m from '$lib/paraglide/messages.js';

	type LoyaltyCreditType =
		| 'app-login'
		| 'eshop-payment'
		| 'ticket-payment'
		| 'membership'
		| 'manual'
		| 'event';
	let _props: WorkflowDrawerContentProps = $props();

	const labelClass = 'text-sm font-medium text-muted-foreground';
	const selectTriggerClass = 'w-full border border-border bg-background';

	const creditTypes = [
		{ id: 'app-login', label: m.fan_action_flow_loyalty_credit_type_app_login },
		{
			id: 'eshop-payment',
			label: m.fan_action_flow_loyalty_credit_type_eshop_payment
		},
		{
			id: 'ticket-payment',
			label: m.fan_action_flow_loyalty_credit_type_ticket_payment
		},
		{ id: 'membership', label: m.fan_action_flow_loyalty_credit_type_membership },
		{ id: 'manual', label: m.fan_action_flow_loyalty_credit_type_manual },
		{ id: 'event', label: m.fan_action_flow_loyalty_credit_type_event }
	] as const satisfies ReadonlyArray<{ id: LoyaltyCreditType; label: () => string }>;

	let creditType = $state<LoyaltyCreditType | ''>('');

	function creditTypeLabel(type: LoyaltyCreditType | '') {
		if (!type) return '';
		return creditTypes.find((item) => item.id === type)?.label() ?? type;
	}
</script>

<div class="space-y-3">
	<div class="space-y-2">
		<Label class={labelClass}>
			{m.fan_action_flow_trigger_loyalty_points_by_type_credit_type_label()}
			<span class="text-destructive">*</span>
		</Label>
		<Select.Root type="single" bind:value={creditType}>
			<Select.Trigger class={selectTriggerClass}>
				{#if creditType}
					{creditTypeLabel(creditType)}
				{:else}
					<span class="text-muted-foreground">
						{m.fan_action_flow_trigger_loyalty_points_by_type_credit_type_placeholder()}
					</span>
				{/if}
			</Select.Trigger>
			<Select.Content>
				<Select.Group>
					{#each creditTypes as type (type.id)}
						<Select.Item value={type.id} label={type.label()}>{type.label()}</Select.Item>
					{/each}
				</Select.Group>
			</Select.Content>
		</Select.Root>
	</div>
</div>
