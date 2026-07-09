<script lang="ts">
	import type { WorkflowDrawerContentProps } from '../../../shared/types';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Textarea } from '$lib/components/ui/textarea/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { workflowMergeTags } from '../merge-tags';
	import * as m from '$lib/paraglide/messages.js';

	let _props: WorkflowDrawerContentProps = $props();

	const labelClass = 'text-sm font-medium text-muted-foreground';
	const sectionTitleClass = 'text-sm font-semibold text-foreground';
	const fieldClass = 'rounded-3xl border border-border bg-background';
	const tagButtonClass =
		'h-auto min-h-8 whitespace-normal rounded-full px-3 py-1.5 text-left text-xs font-normal';

	const smsCharLimit = 255;

	let note = $state('');
	let sender = $state('');
	let messageText = $state('');

	const messageLength = $derived(messageText.length);

	const mergeTags = $derived(workflowMergeTags());

	const specialLinks = $derived([
		{ token: '{{unsubscribe_link}}', label: m.fan_action_flow_sms_unsubscribe_link() }
	]);

	function insertToken(token: string) {
		if (messageLength >= smsCharLimit) return;
		const remaining = smsCharLimit - messageLength;
		messageText += token.slice(0, remaining);
	}
</script>

<div class="space-y-6">
	<section class="space-y-3">
		<h3 class={sectionTitleClass}>{m.fan_action_flow_sms_merge_tags_title()}</h3>
		<div class="flex flex-wrap gap-2">
			{#each mergeTags as tag (tag.token)}
				<Button
					type="button"
					variant="outline"
					size="sm"
					class={tagButtonClass}
					onclick={() => insertToken(tag.token)}
				>
					{tag.label}
				</Button>
			{/each}
		</div>
	</section>

	<section class="space-y-3">
		<h3 class={sectionTitleClass}>{m.fan_action_flow_sms_special_links_title()}</h3>
		<div class="flex flex-wrap gap-2">
			{#each specialLinks as link (link.token)}
				<Button
					type="button"
					variant="outline"
					size="sm"
					class={tagButtonClass}
					onclick={() => insertToken(link.token)}
				>
					{link.label}
				</Button>
			{/each}
		</div>
	</section>

	<div class="space-y-2">
		<Label class={labelClass} for="sms-note">{m.fan_action_flow_email_note_label()}</Label>
		<Input
			bind:value={note}
			id="sms-note"
			class={fieldClass}
			placeholder={m.fan_action_flow_email_note_placeholder()}
		/>
	</div>

	<div class="space-y-2">
		<Label class={labelClass} for="sms-sender">{m.fan_action_flow_sms_sender_label()}</Label>
		<Input
			bind:value={sender}
			id="sms-sender"
			class={fieldClass}
			placeholder={m.fan_action_flow_sms_sender_placeholder()}
		/>
	</div>

	<div class="space-y-2">
		<div class="flex items-center justify-between gap-2">
			<Label class={labelClass} for="sms-message">
				{m.fan_action_flow_sms_message_label()}
				<span class="text-destructive">*</span>
			</Label>
			<span
				class="text-xs tabular-nums {messageLength > smsCharLimit
					? 'text-destructive'
					: 'text-muted-foreground'}"
			>
				{messageLength} / {smsCharLimit}
			</span>
		</div>
		<Textarea
			bind:value={messageText}
			id="sms-message"
			class="min-h-28 {fieldClass}"
			maxlength={smsCharLimit}
			placeholder={m.fan_action_flow_sms_message_placeholder()}
		/>
	</div>
</div>
