<script lang="ts">
	import type { WorkflowDrawerContentProps } from '../../../shared/types';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Switch } from '$lib/components/ui/switch/index.js';
	import * as HoverCard from '$lib/components/ui/hover-card/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import ArrowRight from '@lucide/svelte/icons/arrow-right';
	import CircleAlert from '@lucide/svelte/icons/circle-alert';
	import Info from '@lucide/svelte/icons/info';
	import * as m from '$lib/paraglide/messages.js';

	type DataField = 'last-name' | 'first-name' | 'email' | 'phone' | 'city';
	let _props: WorkflowDrawerContentProps = $props();

	const labelClass = 'text-sm font-medium text-muted-foreground';
	const selectTriggerClass = 'w-full border border-border bg-background';
	const inputClass = 'bg-background';

	const fields = [
		{ id: 'last-name', label: m.fans_col_surname },
		{ id: 'first-name', label: m.fans_col_first_name },
		{ id: 'email', label: m.fans_col_email },
		{ id: 'phone', label: m.fans_col_phone },
		{ id: 'city', label: m.fans_col_city }
	] as const satisfies ReadonlyArray<{ id: DataField; label: () => string }>;

	let selectedField = $state<DataField | ''>('');
	let trackSpecificChanges = $state(true);
	let fromValue = $state('');
	let toValue = $state('');
	let toValueTouched = $state(false);

	const toValueInvalid = $derived(
		trackSpecificChanges && toValueTouched && toValue.trim().length === 0
	);

	function fieldLabel(id: DataField | '') {
		if (!id) return '';
		return fields.find((field) => field.id === id)?.label() ?? id;
	}
</script>

<div class="space-y-3">
	<div class="space-y-2">
		<Label class={labelClass}>
			{m.fan_action_flow_trigger_data_change_field_label()}
			<span class="text-destructive">*</span>
		</Label>
		<Select.Root type="single" bind:value={selectedField}>
			<Select.Trigger class={selectTriggerClass}>
				{#if selectedField}
					{fieldLabel(selectedField)}
				{:else}
					<span class="text-muted-foreground">
						{m.fan_action_flow_trigger_data_change_field_placeholder()}
					</span>
				{/if}
			</Select.Trigger>
			<Select.Content>
				<Select.Group>
					{#each fields as field (field.id)}
						<Select.Item value={field.id} label={field.label()}>{field.label()}</Select.Item>
					{/each}
				</Select.Group>
			</Select.Content>
		</Select.Root>
	</div>

	<div class="flex items-center justify-between gap-2">
		<Label class={labelClass} for="data-change-track-specific">
			{m.fan_action_flow_trigger_data_change_track_specific()}
		</Label>
		<Switch id="data-change-track-specific" bind:checked={trackSpecificChanges} class="shrink-0" />
	</div>

	{#if trackSpecificChanges}
		<div class="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-start gap-2">
			<div class="space-y-2">
				<div class="flex items-center gap-1.5">
					<Label class={labelClass} for="data-change-from-value">
						{m.fan_action_flow_trigger_data_change_from_value()}
					</Label>
					<HoverCard.Root openDelay={200} closeDelay={100}>
						<HoverCard.Trigger>
							{#snippet child({ props })}
								<button
									{...props}
									type="button"
									class="inline-flex shrink-0 cursor-pointer rounded-sm p-0.5 text-muted-foreground hover:text-foreground"
								>
									<Info class="size-3.5" />
									<span class="sr-only">{m.fan_action_flow_trigger_data_change_from_value()}</span>
								</button>
							{/snippet}
						</HoverCard.Trigger>
						<HoverCard.Content side="left" class="w-56">
							<p class="text-sm text-muted-foreground">
								{m.fan_action_flow_trigger_data_change_from_value_info()}
							</p>
						</HoverCard.Content>
					</HoverCard.Root>
				</div>
				<Input
					bind:value={fromValue}
					id="data-change-from-value"
					placeholder={m.fan_action_flow_trigger_data_change_from_value()}
					class={inputClass}
				/>
			</div>

			<ArrowRight class="mt-8 size-4 shrink-0 text-muted-foreground" aria-hidden="true" />

			<div class="space-y-2">
				<Label class={labelClass} for="data-change-to-value">
					{m.fan_action_flow_trigger_data_change_to_value()}
					<span class="text-destructive">*</span>
				</Label>
				<Input
					bind:value={toValue}
					id="data-change-to-value"
					placeholder={m.fan_action_flow_trigger_data_change_to_value()}
					class={inputClass}
					aria-invalid={toValueInvalid}
					onblur={() => {
						toValueTouched = true;
					}}
				/>
				{#if toValueInvalid}
					<p class="flex items-center gap-1 text-sm text-destructive">
						<CircleAlert class="size-3.5 shrink-0" />
						{m.fan_action_flow_trigger_data_change_required()}
					</p>
				{/if}
			</div>
		</div>
	{/if}
</div>
