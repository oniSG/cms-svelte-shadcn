<script lang="ts">
	import type { WorkflowDrawerContentProps } from '../types';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Switch } from '$lib/components/ui/switch/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import * as m from '$lib/paraglide/messages.js';

	let {}: WorkflowDrawerContentProps = $props();

	const labelClass = 'text-sm font-medium text-muted-foreground';
	const selectTriggerClass = 'w-full border border-border bg-background';

	const customFields = [
		'medicalRecords',
		'dietaryRestrictions',
		'emergencyContact',
		'tshirtSize',
		'membershipLevel',
		'vipTier',
		'preferredLanguage',
		'internalNotes'
	];

	let selectedField = $state('');

	const integrationOptions = $state([
		{
			id: 'log-changes',
			checked: false,
			label: m.fan_action_flow_custom_attribute_log_changes
		},
		{ id: 'oneid', checked: false, label: m.fan_action_flow_custom_attribute_oneid },
		{ id: 'neon', checked: false, label: m.fan_action_flow_custom_attribute_neon }
	]);
</script>

<div class="space-y-3">
	<Select.Root type="single" bind:value={selectedField}>
		<Select.Trigger class={selectTriggerClass}>
			{#if selectedField}
				{selectedField}
			{:else}
				<span class="text-muted-foreground">
					{m.fan_action_flow_custom_attribute_field_placeholder()}
				</span>
			{/if}
		</Select.Trigger>
		<Select.Content>
			<Select.Group>
				{#each customFields as field (field)}
					<Select.Item value={field} label={field}>{field}</Select.Item>
				{/each}
			</Select.Group>
		</Select.Content>
	</Select.Root>

	<div class="space-y-3">
		{#each integrationOptions as option (option.id)}
			<div class="flex items-center justify-between gap-2">
				<Label class={labelClass} for="custom-attribute-{option.id}">
					{option.label()}
				</Label>
				<Switch id="custom-attribute-{option.id}" bind:checked={option.checked} class="shrink-0" />
			</div>
		{/each}
	</div>
</div>
