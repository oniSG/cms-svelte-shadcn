<script lang="ts">
	import type { WorkflowDrawerContentProps } from '../types';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Switch } from '$lib/components/ui/switch/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import { Separator } from "$lib/components/ui/separator/index.js";
	import * as m from '$lib/paraglide/messages.js';

	let {}: WorkflowDrawerContentProps = $props();

	const labelClass = 'text-sm font-medium text-muted-foreground';
	const selectTriggerClass = 'w-full border border-border bg-background';

	const emailTemplates = ['welcome-email', 'event-reminder', 'newsletter'];

	let note = $state('');
	let senderEmail = $state('');
	let replyEmail = $state('');
	let subject = $state('');
	let emailTemplate = $state('');
	let sendCopyToVisitors = $state(false);

	const consentPreferences = $state([
		{ id: 'marketing', checked: true, label: m.fan_action_flow_email_consent_marketing },
		{ id: 'organizer', checked: true, label: m.fan_action_flow_email_consent_organizer },
		{ id: 'events', checked: true, label: m.fan_action_flow_email_consent_events },
		{ id: 'special', checked: true, label: m.fan_action_flow_email_consent_special }
	]);
</script>

<div class="space-y-3">
	<div class="space-y-2">
		<Label class={labelClass} for="email-note">{m.fan_action_flow_email_note_label()}</Label>
		<Input
			bind:value={note}
			id="email-note"
			placeholder={m.fan_action_flow_email_note_placeholder()}
		/>
	</div>

	<div class="space-y-2">
		<Label class={labelClass} for="sender-email">
			{m.fan_action_flow_email_sender_label()}
			<span class="text-destructive">*</span>
		</Label>
		<Input
			bind:value={senderEmail}
			id="sender-email"
			type="email"
			placeholder={m.fan_action_flow_email_sender_placeholder()}
			autocomplete="email"
		/>
	</div>

	<div class="space-y-2">
		<Label class={labelClass} for="email-reply">
			{m.fan_action_flow_email_reply_label()}
			<span class="text-destructive">*</span>
		</Label>
		<Input
			bind:value={replyEmail}
			id="email-reply"
			placeholder={m.fan_action_flow_email_reply_placeholder()}
		/>
	</div>

	<div class="space-y-2">
		<Label class={labelClass} for="email-subject">
			{m.fan_action_flow_email_subject_label()}
			<span class="text-destructive">*</span>
		</Label>
		<Input
			bind:value={subject}
			id="email-subject"
			placeholder={m.fan_action_flow_email_subject_placeholder()}
		/>
	</div>

	<div class="space-y-2">
		<Label class={labelClass}>
			{m.fan_action_flow_email_template_label()}
			<span class="text-destructive">*</span>
		</Label>
		<Select.Root type="single" bind:value={emailTemplate}>
			<Select.Trigger class={selectTriggerClass}>
				{#if emailTemplate}
					{emailTemplate}
				{:else}
					<span class="text-muted-foreground">{m.fan_action_flow_email_template_placeholder()}</span
					>
				{/if}
			</Select.Trigger>
			<Select.Content>
				<Select.Group>
					{#each emailTemplates as template (template)}
						<Select.Item value={template} label={template}>{template}</Select.Item>
					{/each}
				</Select.Group>
			</Select.Content>
		</Select.Root>
	</div>

	<div class="flex items-center justify-between gap-2">
		<Label class={labelClass} for="send-copy">{m.fan_action_flow_email_send_copy()}</Label>
		<Switch bind:checked={sendCopyToVisitors} id="send-copy" />
	</div>

	<div class="space-y-4">
		<Separator />
		{#each consentPreferences as pref (pref.id)}
			<div class="flex items-center justify-between gap-2">
				<Label class={labelClass} for="email-consent-{pref.id}">
					{pref.label()}
				</Label>
				<Switch id="email-consent-{pref.id}" bind:checked={pref.checked} class="shrink-0" />
			</div>
		{/each}
	</div>
</div>
