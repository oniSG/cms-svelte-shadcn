<!--
  data-table-date-filter.svelte — a date range picker for the toolbar.

  CONTROLLED component, just like the col-filter:
  - Parent passes the current `from` and `to` dates.
  - User picks a range → component calls `onChange(from, to)` with the
    new boundaries, and the parent decides what to do (in our case:
    update the URL).

  Dates inside the calendar widget use the `@internationalized/date`
  format (CalendarDate), but the rest of the app uses plain JS `Date`,
  so this component converts between the two.

  Convention: when a "to" date is picked, we set its time to 23:59:59.999
  so that filtering "up to and including" that day works intuitively
  (otherwise a 09:00 log on the chosen day would be excluded).
-->
<script lang="ts">
	import type { DateRange } from 'bits-ui';
	import type { DateValue } from '@internationalized/date';
	import { fromDate, getLocalTimeZone, toCalendarDate } from '@internationalized/date';
	import { RangeCalendar } from '$lib/components/ui/range-calendar/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import CalendarIcon from '@lucide/svelte/icons/calendar';
	import * as m from '$lib/paraglide/messages.js';
	import { localeState } from '$lib/i18n.svelte.js';

	let {
		from, // current "from" date (controlled)
		to, // current "to" date (controlled)
		onChange // called when the user picks a new range or clears it
	}: {
		from: Date | null;
		to: Date | null;
		onChange: (from: Date | null, to: Date | null) => void;
	} = $props();

	// The user's local timezone — needed to convert plain Dates to CalendarDates.
	const tz = getLocalTimeZone();

	// Convert our incoming `from`/`to` (plain Dates) into the shape
	// the calendar widget expects (CalendarDate range).
	const range: DateRange | undefined = $derived(
		from
			? {
					start: toCalendarDate(fromDate(from, tz)),
					end: to ? toCalendarDate(fromDate(to, tz)) : undefined
				}
			: undefined
	);

	// Is a filter currently active? Drives the button styling.
	const isActive = $derived(from != null);

	// "Mar 5" / "Mar 5 – Mar 12" / "Date" — what's shown on the trigger button.
	// Uses the current locale so the month abbreviation matches the UI language.
	function fmt(d: DateValue, locale: string) {
		return d.toDate(tz).toLocaleDateString(locale, { month: 'short', day: 'numeric' });
	}

	const label = $derived(
		!range?.start
			? m.log_filter_date()
			: range.end
				? `${fmt(range.start, localeState.current)} – ${fmt(range.end, localeState.current)}`
				: fmt(range.start, localeState.current)
	);

	// User picked a new range in the calendar widget. Convert back to
	// plain Date objects and tell the parent.
	function apply(v: DateRange | undefined) {
		if (!v?.start) {
			onChange(null, null);
			return;
		}
		const start = v.start.toDate(tz);
		// Push the end to the very end of the day so filtering is inclusive.
		const end = v.end ? new Date(v.end.toDate(tz).setHours(23, 59, 59, 999)) : null;
		onChange(start, end);
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
		<RangeCalendar value={range} onValueChange={apply} />
		{#if isActive}
			<!-- A dedicated "Clear" row appears beneath the calendar when a range is active. -->
			<div class="border-t p-2">
				<Button variant="ghost" size="sm" class="w-full" onclick={() => onChange(null, null)}>
					{m.log_filter_clear_dates()}
				</Button>
			</div>
		{/if}
	</Popover.Content>
</Popover.Root>
