<script lang="ts">
	import type { WorkflowDrawerContentProps } from '../../types';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Switch } from '$lib/components/ui/switch/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import * as m from '$lib/paraglide/messages.js';

	let {}: WorkflowDrawerContentProps = $props();

	type TransferType = 'points' | 'credit' | 'voucher';

	const labelClass = 'text-sm font-medium text-muted-foreground';
	const selectTriggerClass = 'w-full border border-border bg-background';

	const transferTypes = [
		{ id: 'points', label: m.fan_action_flow_reward_conversion_type_points },
		{ id: 'credit', label: m.fan_action_flow_reward_conversion_type_credit },
		{ id: 'voucher', label: m.fan_action_flow_reward_conversion_type_voucher }
	] as const satisfies ReadonlyArray<{ id: TransferType; label: () => string }>;

	let transferType = $state<TransferType | ''>('');
	let sendWebhook = $state(false);

	function transferTypeLabel(type: TransferType | '') {
		if (!type) return '';
		return transferTypes.find((item) => item.id === type)?.label() ?? type;
	}
</script>

<div class="space-y-3">
	<div class="space-y-2">
		<Label class={labelClass}>{m.fan_action_flow_reward_conversion_type_label()}</Label>
		<Select.Root type="single" bind:value={transferType}>
			<Select.Trigger class={selectTriggerClass}>
				{#if transferType}
					{transferTypeLabel(transferType)}
				{:else}
					<span class="text-muted-foreground">
						{m.fan_action_flow_reward_conversion_type_placeholder()}
					</span>
				{/if}
			</Select.Trigger>
			<Select.Content>
				<Select.Group>
					{#each transferTypes as type (type.id)}
						<Select.Item value={type.id} label={type.label()}>{type.label()}</Select.Item>
					{/each}
				</Select.Group>
			</Select.Content>
		</Select.Root>
	</div>

	<div class="flex items-center justify-between gap-2">
		<Label class={labelClass} for="reward-conversion-webhook">
			{m.fan_action_flow_reward_conversion_send_webhook()}
		</Label>
		<Switch bind:checked={sendWebhook} id="reward-conversion-webhook" />
	</div>
</div>
