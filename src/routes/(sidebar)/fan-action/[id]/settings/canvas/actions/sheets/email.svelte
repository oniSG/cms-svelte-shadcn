<script lang="ts">
	import { untrack } from 'svelte';
	import { z } from 'zod';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Switch } from '$lib/components/ui/switch/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import type { WorkflowDrawerContentProps } from '../../../shared/types';
	import { getFanActionSaveHandlers } from '../../../shared/editing-context';
	import { saveFanActionDrawer } from '../../../../../temp/data.js';
	import * as m from '$lib/paraglide/messages.js';

	let { actionId, nodeId, data, syncNodeConfig }: WorkflowDrawerContentProps = $props();

	const labelClass = 'text-sm font-medium text-muted-foreground';
	const selectTriggerClass = 'w-full border border-border bg-background';
	const emailTemplates = ['welcome-email', 'event-reminder', 'newsletter'];

	const emailFormSchema = z.object({
		note: z.string().trim().max(250),
		senderEmail: z.string().trim().min(1).email(),
		replyEmail: z.string().trim().min(1).email(),
		subject: z.string().trim().min(1).max(250),
		emailTemplate: z.string().trim().min(1),
		sendCopyToVisitors: z.boolean(),
		consentPreferences: z.object({
			marketing: z.boolean(),
			organizer: z.boolean(),
			events: z.boolean(),
			special: z.boolean()
		})
	});

	let note = $state('');
	let senderEmail = $state('');
	let replyEmail = $state('');
	let subject = $state('');
	let emailTemplate = $state('');
	let sendCopyToVisitors = $state(false);
	let consentMarketing = $state(true);
	let consentOrganizer = $state(true);
	let consentEvents = $state(true);
	let consentSpecial = $state(true);
	let errors = $state<Record<string, string>>({});
	let loadedNodeId = $state<string | null>(null);

	function loadFromConfig(config: Record<string, unknown> | undefined) {
		note = typeof config?.note === 'string' ? config.note : '';
		senderEmail = typeof config?.senderEmail === 'string' ? config.senderEmail : '';
		replyEmail = typeof config?.replyEmail === 'string' ? config.replyEmail : '';
		subject = typeof config?.subject === 'string' ? config.subject : '';
		emailTemplate = typeof config?.emailTemplate === 'string' ? config.emailTemplate : '';
		sendCopyToVisitors = config?.sendCopyToVisitors === true;

		const prefs = config?.consentPreferences as Record<string, boolean> | undefined;
		consentMarketing = prefs?.marketing ?? true;
		consentOrganizer = prefs?.organizer ?? true;
		consentEvents = prefs?.events ?? true;
		consentSpecial = prefs?.special ?? true;
		errors = {};
	}

	const consentIds = ['marketing', 'organizer', 'events', 'special'] as const;
	const consentLabels: Record<(typeof consentIds)[number], () => string> = {
		marketing: m.fan_action_flow_email_consent_marketing,
		organizer: m.fan_action_flow_email_consent_organizer,
		events: m.fan_action_flow_email_consent_events,
		special: m.fan_action_flow_email_consent_special
	};

	$effect(() => {
		const id = nodeId;
		if (id === loadedNodeId) return;

		loadedNodeId = id;
		loadFromConfig(untrack(() => data.config));
	});

	$effect(() => {
		const id = nodeId;
		const handlers = untrack(() => getFanActionSaveHandlers());
		const actId = untrack(() => actionId);
		const sync = untrack(() => syncNodeConfig);
		if (!handlers || !actId) return;

		handlers.nodeConfig = async () => {
			const payload = {
				note,
				senderEmail,
				replyEmail,
				subject,
				emailTemplate,
				sendCopyToVisitors,
				consentPreferences: {
					marketing: consentMarketing,
					organizer: consentOrganizer,
					events: consentEvents,
					special: consentSpecial
				}
			};

			const result = emailFormSchema.safeParse(payload);
			if (!result.success) {
				errors = Object.fromEntries(
					result.error.issues.map((issue) => [issue.path.join('.'), issue.message])
				);
				return false;
			}

			errors = {};
			const saved = saveFanActionDrawer(actId, id, result.data);
			if (!saved) return false;

			sync?.(id, result.data);
			return true;
		};

		return () => {
			delete handlers.nodeConfig;
		};
	});
</script>

<div class="space-y-3">
	<div class="space-y-2">
		<Label class={labelClass} for="email-note">{m.fan_action_flow_email_note_label()}</Label>
		<Input
			bind:value={note}
			id="email-note"
			placeholder={m.fan_action_flow_email_note_placeholder()}
			maxlength={250}
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
		{#if errors.senderEmail}
			<p class="text-sm text-destructive">{errors.senderEmail}</p>
		{/if}
	</div>

	<div class="space-y-2">
		<Label class={labelClass} for="email-reply">
			{m.fan_action_flow_email_reply_label()}
			<span class="text-destructive">*</span>
		</Label>
		<Input
			bind:value={replyEmail}
			id="email-reply"
			type="email"
			placeholder={m.fan_action_flow_email_reply_placeholder()}
		/>
		{#if errors.replyEmail}
			<p class="text-sm text-destructive">{errors.replyEmail}</p>
		{/if}
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
			maxlength={250}
		/>
		{#if errors.subject}
			<p class="text-sm text-destructive">{errors.subject}</p>
		{/if}
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
					<span class="text-muted-foreground">{m.fan_action_flow_email_template_placeholder()}</span>
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
		{#if errors.emailTemplate}
			<p class="text-sm text-destructive">{errors.emailTemplate}</p>
		{/if}
	</div>

	<div class="flex items-center justify-between gap-2">
		<Label class={labelClass} for="send-copy">{m.fan_action_flow_email_send_copy()}</Label>
		<Switch bind:checked={sendCopyToVisitors} id="send-copy" />
	</div>

	<div class="space-y-4">
		<Separator />
		{#each consentIds as consentId (consentId)}
			<div class="flex items-center justify-between gap-2">
				<Label class={labelClass} for="email-consent-{consentId}">
					{consentLabels[consentId]()}
				</Label>
				{#if consentId === 'marketing'}
					<Switch id="email-consent-{consentId}" bind:checked={consentMarketing} class="shrink-0" />
				{:else if consentId === 'organizer'}
					<Switch id="email-consent-{consentId}" bind:checked={consentOrganizer} class="shrink-0" />
				{:else if consentId === 'events'}
					<Switch id="email-consent-{consentId}" bind:checked={consentEvents} class="shrink-0" />
				{:else}
					<Switch id="email-consent-{consentId}" bind:checked={consentSpecial} class="shrink-0" />
				{/if}
			</div>
		{/each}
	</div>
</div>
