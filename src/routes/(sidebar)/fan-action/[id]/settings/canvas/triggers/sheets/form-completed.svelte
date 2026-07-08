<script lang="ts">
	import type { WorkflowDrawerContentProps } from '../../../shared/types';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import { allWebForms } from '../../../../../temp/options';
	import * as m from '$lib/paraglide/messages.js';
	let _props: WorkflowDrawerContentProps = $props();

	const labelClass = 'text-sm font-medium text-muted-foreground';
	const selectTriggerClass = 'w-full border border-border bg-background';
	const inputClass = 'bg-background';

	let note = $state('');
	let webForm = $state('');

	function webFormLabel(id: string) {
		return allWebForms.find((item) => item === id) ?? id;
	}
</script>

<div class="space-y-3">
	<div class="space-y-2">
		<Label class={labelClass} for="form-completed-note">
			{m.fan_action_flow_email_note_label()}
		</Label>
		<Input
			bind:value={note}
			id="form-completed-note"
			placeholder={m.fan_action_flow_email_note_placeholder()}
			class={inputClass}
		/>
	</div>

	<div class="space-y-2">
		<Label class={labelClass}>
			{m.nav_fans_web_form()}
			<span class="text-destructive">*</span>
		</Label>
		<Select.Root type="single" bind:value={webForm}>
			<Select.Trigger class={selectTriggerClass}>
				{#if webForm}
					{webFormLabel(webForm)}
				{:else}
					<span class="text-muted-foreground">
						{m.fan_action_flow_trigger_form_completed_web_form_placeholder()}
					</span>
				{/if}
			</Select.Trigger>
			<Select.Content>
				<Select.Group>
					{#each allWebForms as item (item)}
						<Select.Item value={item} label={item}>{item}</Select.Item>
					{/each}
				</Select.Group>
			</Select.Content>
		</Select.Root>
	</div>
</div>
