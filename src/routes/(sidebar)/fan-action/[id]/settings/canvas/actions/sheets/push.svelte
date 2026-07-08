<script lang="ts">
	import type { WorkflowDrawerContentProps } from '../../types';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Textarea } from '$lib/components/ui/textarea/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as HoverCard from '$lib/components/ui/hover-card/index.js';
	import Info from '@lucide/svelte/icons/info';
	import { workflowMergeTags } from '../merge-tags';
	import * as m from '$lib/paraglide/messages.js';

	let {}: WorkflowDrawerContentProps = $props();

	const labelClass = 'text-sm font-medium text-muted-foreground';
	const sectionTitleClass = 'text-sm font-semibold text-foreground';
	const fieldClass = 'rounded-3xl border border-border bg-background';
	const uploadButtonClass =
		'flex w-full cursor-pointer flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-muted/30 px-4 py-8 text-center text-sm text-muted-foreground transition-colors hover:bg-muted/50';
	const tagButtonClass =
		'h-auto min-h-8 whitespace-normal rounded-full px-3 py-1.5 text-left text-xs font-normal';

	let note = $state('');
	let title = $state('');
	let subtitle = $state('');
	let link = $state('');
	let body = $state('');
	let smallIcon = $state('ic_icon_notification');
	let iosSound = $state('');
	let androidChannel = $state('');
	let androidGroup = $state('');
	let iosGroup = $state('');
	let previewImageName = $state('');
	let largeIconName = $state('');
	let previewImageInput = $state<HTMLInputElement | null>(null);
	let largeIconInput = $state<HTMLInputElement | null>(null);

	const mergeTags = $derived(workflowMergeTags());

	function insertToken(token: string) {
		body += token;
	}

	function releaseBrowserInteractionLocks() {
		document.body.style.removeProperty('pointer-events');
		document.body.style.removeProperty('user-select');
		document.body.style.removeProperty('-webkit-user-select');
		document.body.style.removeProperty('overflow');
	}

	function openFilePicker(input: HTMLInputElement | null) {
		input?.click();
	}

	function onFileSelected(event: Event, setName: (name: string) => void) {
		releaseBrowserInteractionLocks();
		const input = event.currentTarget as HTMLInputElement;
		setName(input.files?.[0]?.name ?? '');
	}

	function onFilePickerCancel() {
		releaseBrowserInteractionLocks();
	}
</script>

{#snippet fieldLabelWithInfo(label: string, description: string, forId?: string)}
	<div class="flex items-center gap-1.5">
		{#if forId}
			<Label class={labelClass} for={forId}>{label}</Label>
		{:else}
			<span class={labelClass}>{label}</span>
		{/if}
		<HoverCard.Root openDelay={200} closeDelay={100}>
			<HoverCard.Trigger>
				{#snippet child({ props })}
					<button
						{...props}
						type="button"
						class="inline-flex shrink-0 cursor-pointer rounded-sm p-0.5 text-muted-foreground hover:text-foreground"
					>
						<Info class="size-3.5" />
						<span class="sr-only">{label}</span>
					</button>
				{/snippet}
			</HoverCard.Trigger>
			<HoverCard.Content side="left" class="w-56">
				<div class="space-y-1">
					<h4 class="text-sm font-semibold">{label}</h4>
					<p class="text-sm text-muted-foreground">{description}</p>
				</div>
			</HoverCard.Content>
		</HoverCard.Root>
	</div>
{/snippet}

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

	<div class="space-y-2">
		<Label class={labelClass} for="push-note">{m.fan_action_flow_email_note_label()}</Label>
		<Input
			bind:value={note}
			id="push-note"
			class={fieldClass}
			placeholder={m.fan_action_flow_email_note_placeholder()}
		/>
	</div>

	<div class="space-y-2">
		<Label class={labelClass} for="push-title">
			{m.fan_action_flow_push_title_label()}
			<span class="text-destructive">*</span>
		</Label>
		<Input
			bind:value={title}
			id="push-title"
			class={fieldClass}
			placeholder={m.fan_action_flow_push_title_placeholder()}
		/>
	</div>

	<div class="space-y-2">
		<Label class={labelClass} for="push-subtitle">{m.fan_action_flow_push_subtitle_label()}</Label>
		<Input
			bind:value={subtitle}
			id="push-subtitle"
			class={fieldClass}
			placeholder={m.fan_action_flow_push_subtitle_placeholder()}
		/>
	</div>

	<div class="space-y-2">
		<Label class={labelClass} for="push-link">{m.fan_action_flow_push_link_label()}</Label>
		<Input
			bind:value={link}
			id="push-link"
			type="url"
			class={fieldClass}
			placeholder={m.fan_action_flow_push_link_placeholder()}
		/>
	</div>

	<div class="space-y-2">
		<Label class={labelClass} for="push-body">
			{m.fan_action_flow_push_body_label()}
			<span class="text-destructive">*</span>
		</Label>
		<Textarea
			bind:value={body}
			id="push-body"
			class="min-h-28 resize-y {fieldClass}"
			placeholder={m.fan_action_flow_push_body_placeholder()}
		/>
	</div>

	<div class="space-y-2">
		{@render fieldLabelWithInfo(
			m.fan_action_flow_push_image_label(),
			m.fan_action_flow_push_image_description()
		)}
		<input
			bind:this={previewImageInput}
			id="push-image"
			type="file"
			accept=".jpg,.jpeg,.png,.svg,image/jpeg,image/png,image/svg+xml"
			class="sr-only"
			tabindex={-1}
			onchange={(e) => onFileSelected(e, (name) => (previewImageName = name))}
			oncancel={onFilePickerCancel}
		/>
		<button
			type="button"
			class={uploadButtonClass}
			onclick={() => openFilePicker(previewImageInput)}
		>
			{#if previewImageName}
				<span class="font-medium text-foreground">{previewImageName}</span>
			{:else}
				{m.fan_action_flow_push_image_upload_hint()}
			{/if}
		</button>
	</div>

	<div class="space-y-2">
		{@render fieldLabelWithInfo(
			m.fan_action_flow_push_small_icon_label(),
			m.fan_action_flow_push_small_icon_description(),
			'push-small-icon'
		)}
		<Input
			bind:value={smallIcon}
			id="push-small-icon"
			class={fieldClass}
			placeholder={m.fan_action_flow_push_small_icon_placeholder()}
		/>
	</div>

	<div class="space-y-2">
		{@render fieldLabelWithInfo(
			m.fan_action_flow_push_large_icon_label(),
			m.fan_action_flow_push_large_icon_description()
		)}
		<input
			bind:this={largeIconInput}
			id="push-large-icon"
			type="file"
			accept=".jpg,.jpeg,.png,.svg,image/jpeg,image/png,image/svg+xml"
			class="sr-only"
			tabindex={-1}
			onchange={(e) => onFileSelected(e, (name) => (largeIconName = name))}
			oncancel={onFilePickerCancel}
		/>
		<button type="button" class={uploadButtonClass} onclick={() => openFilePicker(largeIconInput)}>
			{#if largeIconName}
				<span class="font-medium text-foreground">{largeIconName}</span>
			{:else}
				{m.fan_action_flow_push_large_icon_upload_hint()}
			{/if}
		</button>
	</div>

	<div class="space-y-2">
		{@render fieldLabelWithInfo(
			m.fan_action_flow_push_ios_sound_label(),
			m.fan_action_flow_push_ios_sound_description(),
			'push-ios-sound'
		)}
		<Input
			bind:value={iosSound}
			id="push-ios-sound"
			class={fieldClass}
			placeholder={m.fan_action_flow_push_ios_sound_placeholder()}
		/>
	</div>

	<div class="space-y-2">
		{@render fieldLabelWithInfo(
			m.fan_action_flow_push_android_channel_label(),
			m.fan_action_flow_push_android_channel_description(),
			'push-android-channel'
		)}
		<Input
			bind:value={androidChannel}
			id="push-android-channel"
			class={fieldClass}
			placeholder={m.fan_action_flow_push_android_channel_placeholder()}
		/>
	</div>

	<div class="space-y-2">
		{@render fieldLabelWithInfo(
			m.fan_action_flow_push_android_group_label(),
			m.fan_action_flow_push_android_group_description(),
			'push-android-group'
		)}
		<Input
			bind:value={androidGroup}
			id="push-android-group"
			class={fieldClass}
			placeholder={m.fan_action_flow_push_android_group_placeholder()}
		/>
	</div>

	<div class="space-y-2">
		{@render fieldLabelWithInfo(
			m.fan_action_flow_push_ios_group_label(),
			m.fan_action_flow_push_ios_group_description(),
			'push-ios-group'
		)}
		<Input
			bind:value={iosGroup}
			id="push-ios-group"
			class={fieldClass}
			placeholder={m.fan_action_flow_push_ios_group_placeholder()}
		/>
	</div>
</div>
