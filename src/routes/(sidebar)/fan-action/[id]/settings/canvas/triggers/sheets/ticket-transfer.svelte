<script lang="ts">
	import { Label } from '$lib/components/ui/label/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import { allEventLists } from '../../../../temp/options';
	import * as m from '$lib/paraglide/messages.js';

	const labelClass = 'text-sm font-medium text-muted-foreground';
	const selectTriggerClass = 'w-full border border-border bg-background';

	let eventList = $state('');

	function eventListLabel(id: string) {
		return allEventLists.find((list) => list === id) ?? id;
	}
</script>

<div class="space-y-3">
	<div class="space-y-2">
		<Label class={labelClass}>{m.fan_action_flow_trigger_ticket_purchase_event_lists_label()}</Label>
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
</div>
