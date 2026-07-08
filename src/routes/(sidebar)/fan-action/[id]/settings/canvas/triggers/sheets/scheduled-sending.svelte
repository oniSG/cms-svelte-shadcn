<script lang="ts">
	import type { WorkflowDrawerContentProps } from '../../../shared/types';
	import { Calendar } from '$lib/components/ui/calendar/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import ChevronDown from '@lucide/svelte/icons/chevron-down';
	import { getLocalTimeZone, type DateValue } from '@internationalized/date';
	import * as m from '$lib/paraglide/messages.js';
	let _props: WorkflowDrawerContentProps = $props();

	const labelClass = 'text-sm font-medium text-muted-foreground';
	const selectTriggerClass = 'w-full border border-border bg-background';
	const timeInputClass =
		'bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none';

	let open = $state(false);
	let dateValue = $state<DateValue | undefined>();
	let timeValue = $state('');

	function formattedDateTime(): string | null {
		if (!dateValue) return null;

		const date = dateValue.toDate(getLocalTimeZone());
		if (timeValue) {
			const [hours = 0, minutes = 0] = timeValue.split(':').map(Number);
			date.setHours(hours, minutes, 0, 0);
		}

		const datePart = date.toLocaleDateString(undefined, {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric'
		});
		if (!timeValue) return datePart;

		const timePart = date.toLocaleTimeString(undefined, {
			hour: '2-digit',
			minute: '2-digit'
		});
		return `${datePart} ${timePart}`;
	}
</script>

<div class="space-y-3">
	<div class="space-y-2">
		<Label class={labelClass}>
			{m.fan_action_flow_trigger_scheduled_sending_datetime_label()}
			<span class="text-destructive">*</span>
		</Label>
		<Popover.Root bind:open>
			<Popover.Trigger class="w-full">
				{#snippet child({ props })}
					<Button
						{...props}
						variant="outline"
						class="{selectTriggerClass} justify-between font-normal"
					>
						<span
							class:truncate={Boolean(formattedDateTime())}
							class:text-muted-foreground={!dateValue}
						>
							{formattedDateTime() ?? m.fan_action_settings_end_datetime_placeholder()}
						</span>
						<ChevronDown class="size-4 shrink-0 opacity-50" />
					</Button>
				{/snippet}
			</Popover.Trigger>
			<Popover.Content class="w-auto overflow-hidden p-0" align="start">
				<Calendar type="single" bind:value={dateValue} captionLayout="dropdown" />
				<div class="border-t p-3">
					<Input type="time" bind:value={timeValue} class={timeInputClass} />
				</div>
			</Popover.Content>
		</Popover.Root>
	</div>
</div>
