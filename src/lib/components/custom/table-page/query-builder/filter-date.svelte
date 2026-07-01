<script lang="ts">
	import { Calendar } from '$lib/components/ui/calendar/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import CalendarIcon from '@lucide/svelte/icons/calendar';
	import {
		fromDate,
		getLocalTimeZone,
		toCalendarDate,
		type DateValue
	} from '@internationalized/date';
	import FilterShell from './filter-shell.svelte';
	import type { DateFilter, Filter } from './fields.js';
	import type { QueryFieldDef } from '../types';

	let {
		filter,
		fields,
		onChange,
		onDelete
	}: {
		filter: DateFilter;
		fields: QueryFieldDef[];
		onChange: (next: Filter) => void;
		onDelete: () => void;
	} = $props();

	const tz = getLocalTimeZone();
	let open = $state(false);

	const calendarValue = $derived<DateValue | undefined>(
		filter.value ? toCalendarDate(fromDate(filter.value, tz)) : undefined
	);

	function pick(v: DateValue | undefined) {
		onChange({ ...filter, value: v ? v.toDate(tz) : null });
		open = false;
	}
</script>

<FilterShell {filter} {fields} {onChange} {onDelete}>
	<Popover.Root bind:open>
		<Popover.Trigger>
			{#snippet child({ props })}
				<Button
					{...props}
					variant="outline"
					class="w-full justify-between border border-border bg-background font-normal"
				>
					<span class:text-muted-foreground={!filter.value}>
						{filter.value ? filter.value.toLocaleDateString() : 'Pick a date'}
					</span>
					<CalendarIcon class="size-4 opacity-50" />
				</Button>
			{/snippet}
		</Popover.Trigger>
		<Popover.Content class="w-auto overflow-hidden p-0" align="start">
			<Calendar type="single" value={calendarValue} onValueChange={pick} captionLayout="dropdown" />
		</Popover.Content>
	</Popover.Root>
</FilterShell>
