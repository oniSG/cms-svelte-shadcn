<script lang="ts">
	import type { ControlAttrs } from 'formsnap';
	import Calendar from '$lib/components/ui/calendar/calendar.svelte';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import ChevronDownIcon from '@lucide/svelte/icons/chevron-down';
	import {
		fromDate,
		getLocalTimeZone,
		toCalendarDate,
		type CalendarDate
	} from '@internationalized/date';

	type Props = Partial<ControlAttrs> & { value?: Date };
	let { value = $bindable(), id, ...restProps }: Props = $props();

	const fallbackId = $props.id();
	const triggerId = $derived(id ?? `${fallbackId}-date`);

	let open = $state(false);
	let calendarValue = $state<CalendarDate | undefined>(
		value ? toCalendarDate(fromDate(value, getLocalTimeZone())) : undefined
	);
</script>

<Popover.Root bind:open>
	<Popover.Trigger id={triggerId}>
		{#snippet child({ props })}
			<Button
				{...props}
				{...restProps}
				variant="secondary"
				class="w-full justify-between font-normal"
			>
				{calendarValue
					? calendarValue.toDate(getLocalTimeZone()).toLocaleDateString()
					: 'Select date'}
				<ChevronDownIcon />
			</Button>
		{/snippet}
	</Popover.Trigger>
	<Popover.Content class="w-auto overflow-hidden p-0" align="start">
		<Calendar
			type="single"
			bind:value={calendarValue}
			captionLayout="dropdown"
			onValueChange={(v) => {
				value = v ? v.toDate(getLocalTimeZone()) : undefined;
				open = false;
			}}
		/>
	</Popover.Content>
</Popover.Root>
