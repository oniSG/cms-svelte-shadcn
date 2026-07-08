<script lang="ts">
	import { Label } from '$lib/components/ui/label/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import { allMembershipStatuses } from '../../../../temp/options';
	import * as m from '$lib/paraglide/messages.js';

	const labelClass = 'text-sm font-medium text-muted-foreground';
	const selectTriggerClass = 'w-full border border-border bg-background';

	let membershipStatus = $state('');

	function membershipStatusLabel(status: string) {
		return allMembershipStatuses.find((item) => item === status) ?? status;
	}
</script>

<div class="space-y-3">
	<div class="space-y-2">
		<Label class={labelClass}>
			{m.fan_action_flow_trigger_membership_status_change()}
			<span class="text-destructive">*</span>
		</Label>
		<Select.Root type="single" bind:value={membershipStatus}>
			<Select.Trigger class={selectTriggerClass}>
				{#if membershipStatus}
					{membershipStatusLabel(membershipStatus)}
				{:else}
					<span class="text-muted-foreground">
						{m.fan_action_flow_trigger_membership_status_change_status_placeholder()}
					</span>
				{/if}
			</Select.Trigger>
			<Select.Content>
				<Select.Group>
					{#each allMembershipStatuses as status (status)}
						<Select.Item value={status} label={status}>{status}</Select.Item>
					{/each}
				</Select.Group>
			</Select.Content>
		</Select.Root>
	</div>
</div>
