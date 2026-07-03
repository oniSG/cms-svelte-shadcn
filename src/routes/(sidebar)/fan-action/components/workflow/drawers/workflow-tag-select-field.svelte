<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import Plus from '@lucide/svelte/icons/plus';
	import SquarePen from '@lucide/svelte/icons/square-pen';
	import * as m from '$lib/paraglide/messages.js';
	import WorkflowLabelWithInfo from './workflow-label-with-info.svelte';
	import { drawerSelectTriggerClass } from './drawer-styles';

	let {
		idPrefix,
		infoDescription,
		showActions = false,
		selectedTag = $bindable('')
	}: {
		idPrefix: string;
		infoDescription: string;
		showActions?: boolean;
		selectedTag?: string;
	} = $props();

	const iconButtonClass = 'size-9 shrink-0';

	const tagOptions = [
		'VIP',
		'VIP GOLD',
		'Silver',
		'PARTNER',
		'INFLUENCER',
		'onboarding',
		'newsletter opt-in',
		'churn risk',
		'season 25/26'
	];
</script>

<div class="space-y-2">
	<WorkflowLabelWithInfo
		label={m.fan_action_flow_tag_select_label()}
		description={infoDescription}
		required
	/>
	<div class="flex items-center gap-2">
		<div class="min-w-0 flex-1">
			<Select.Root type="single" bind:value={selectedTag}>
				<Select.Trigger class={drawerSelectTriggerClass}>
					{#if selectedTag}
						{selectedTag}
					{:else}
						<span class="text-muted-foreground">
							{m.fan_action_flow_tag_select_placeholder()}
						</span>
					{/if}
				</Select.Trigger>
				<Select.Content>
					<Select.Group>
						{#each tagOptions as tag (tag)}
							<Select.Item value={tag} label={tag}>{tag}</Select.Item>
						{/each}
					</Select.Group>
				</Select.Content>
			</Select.Root>
		</div>
		{#if showActions}
			<Button
				type="button"
				variant="outline"
				size="icon"
				class={iconButtonClass}
				aria-label={m.fan_action_flow_tag_create()}
			>
				<Plus class="size-4" />
			</Button>
			<Button
				type="button"
				variant="outline"
				size="icon"
				class={iconButtonClass}
				aria-label={m.fan_action_flow_tag_edit()}
				disabled={!selectedTag}
			>
				<SquarePen class="size-4" />
			</Button>
		{/if}
	</div>
</div>
