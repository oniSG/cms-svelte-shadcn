<script lang="ts" generics="TData, TValue">
	import type { Column } from '@tanstack/table-core';
	import type { DateRange } from 'bits-ui';
	import type { DateValue } from '@internationalized/date';
	import { fromDate, getLocalTimeZone, toCalendarDate } from '@internationalized/date';
	import { RangeCalendar } from '$lib/components/ui/range-calendar/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import CalendarIcon from '@lucide/svelte/icons/calendar';
	import * as m from '$lib/paraglide/messages.js';

	let { column }: { column: Column<TData, TValue> } = $props();

	const tz = getLocalTimeZone();

	const filterValue = $derived(column.getFilterValue() as [Date, Date | undefined] | undefined);

	const range: DateRange | undefined = $derived(
		filterValue
			? {
					start: toCalendarDate(fromDate(filterValue[0], tz)),
					end: filterValue[1] ? toCalendarDate(fromDate(filterValue[1], tz)) : undefined
				}
			: undefined
	);

	const isActive = $derived(filterValue != null);

	function fmt(d: DateValue) {
		return d.toDate(tz).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
	}

	const label = $derived(
		!range?.start
			? m.col_created()
			: range.end
				? `${fmt(range.start)} – ${fmt(range.end)}`
				: fmt(range.start)
	);

	function applyFilter(v: DateRange | undefined) {
		if (!v?.start) {
			column.setFilterValue(undefined);
			return;
		}
		const start = v.start.toDate(tz);
		const end = v.end ? new Date(v.end.toDate(tz).setHours(23, 59, 59, 999)) : undefined;
		column.setFilterValue([start, end]);
	}

	function clear() {
		column.setFilterValue(undefined);
	}
</script>

<Popover.Root>
	<Popover.Trigger>
		{#snippet child({ props })}
			<Button {...props} variant={isActive ? 'default' : 'outline'} size="sm">
				<CalendarIcon />
				{label}
			</Button>
		{/snippet}
	</Popover.Trigger>
	<Popover.Content class="w-auto p-0" align="start">
		<RangeCalendar value={range} onValueChange={applyFilter} />
		{#if isActive}
			<div class="border-t p-2">
				<Button variant="ghost" size="sm" class="w-full" onclick={clear}>Clear dates</Button>
			</div>
		{/if}
	</Popover.Content>
</Popover.Root>
