<script lang="ts">
	import type { WorkflowDrawerContentProps } from '../../../shared/types';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import * as m from '$lib/paraglide/messages.js';
	let _props: WorkflowDrawerContentProps = $props();

	const labelClass = 'text-sm font-medium text-muted-foreground';
	const helpTextClass = 'text-sm text-muted-foreground';

	let membershipId = $state('');
</script>

<div class="space-y-3">
	<div class="space-y-2">
		<Label class={labelClass} for="specific-membership-id">
			{m.fan_action_flow_trigger_specific_membership_purchase_id_label()}
			<span class="text-destructive">*</span>
		</Label>
		<p class={helpTextClass}>
			{m.fan_action_flow_trigger_specific_membership_purchase_id_help()}
		</p>
		<Input
			bind:value={membershipId}
			id="specific-membership-id"
			type="number"
			min="1"
			class="bg-background"
		/>
	</div>
</div>
