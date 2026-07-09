<script lang="ts">
	import type { WorkflowDrawerContentProps } from '../../../shared/types';
	import { Label } from '$lib/components/ui/label/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import { allQuestionnaires } from '../../../../../temp/options';
	import * as m from '$lib/paraglide/messages.js';
	let _props: WorkflowDrawerContentProps = $props();

	const labelClass = 'text-sm font-medium text-muted-foreground';
	const selectTriggerClass = 'w-full border border-border bg-background';

	let questionnaire = $state('');

	function questionnaireLabel(id: string) {
		return allQuestionnaires.find((item) => item === id) ?? id;
	}
</script>

<div class="space-y-3">
	<div class="space-y-2">
		<Label class={labelClass}>
			{m.fan_action_flow_trigger_questionnaire_completed_questionnaire_label()}
			<span class="text-destructive">*</span>
		</Label>
		<Select.Root type="single" bind:value={questionnaire}>
			<Select.Trigger class={selectTriggerClass}>
				{#if questionnaire}
					{questionnaireLabel(questionnaire)}
				{:else}
					<span class="text-muted-foreground">
						{m.fan_action_flow_trigger_questionnaire_completed_questionnaire_placeholder()}
					</span>
				{/if}
			</Select.Trigger>
			<Select.Content>
				<Select.Group>
					{#each allQuestionnaires as item (item)}
						<Select.Item value={item} label={item}>{item}</Select.Item>
					{/each}
				</Select.Group>
			</Select.Content>
		</Select.Root>
	</div>
</div>
