<script lang="ts">
	import type { WorkflowDrawerContentProps } from '../../../shared/types';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import * as HoverCard from '$lib/components/ui/hover-card/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import Info from '@lucide/svelte/icons/info';
	import * as m from '$lib/paraglide/messages.js';

	let _props: WorkflowDrawerContentProps = $props();

	const labelClass = 'text-sm font-medium text-muted-foreground';
	const selectTriggerClass = 'w-full border border-border bg-background';

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

	let note = $state('');
	let selectedTag = $state('');
</script>

<div class="space-y-3">
	<div class="space-y-2">
		<Label class={labelClass} for="remove-tag-note">{m.fan_action_flow_email_note_label()}</Label>
		<Input
			bind:value={note}
			id="remove-tag-note"
			placeholder={m.fan_action_flow_email_note_placeholder()}
		/>
	</div>

	<div class="space-y-2">
		<div class="flex items-center gap-1.5">
			<span class={labelClass}>
				{m.fan_action_flow_tag_select_label()}
				<span class="text-destructive">*</span>
			</span>
			<HoverCard.Root openDelay={200} closeDelay={100}>
				<HoverCard.Trigger>
					{#snippet child({ props })}
						<button
							{...props}
							type="button"
							class="inline-flex shrink-0 cursor-pointer rounded-sm p-0.5 text-muted-foreground hover:text-foreground"
						>
							<Info class="size-3.5" />
							<span class="sr-only">{m.fan_action_flow_tag_select_label()}</span>
						</button>
					{/snippet}
				</HoverCard.Trigger>
				<HoverCard.Content side="left" class="w-56">
					<div class="space-y-1">
						<h4 class="text-sm font-semibold">{m.fan_action_flow_tag_select_label()}</h4>
						<p class="text-sm text-muted-foreground">
							{m.fan_action_flow_remove_tag_description()}
						</p>
					</div>
				</HoverCard.Content>
			</HoverCard.Root>
		</div>
		<Select.Root type="single" bind:value={selectedTag}>
			<Select.Trigger class={selectTriggerClass}>
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
</div>
