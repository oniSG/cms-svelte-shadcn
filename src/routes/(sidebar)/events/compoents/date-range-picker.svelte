<script lang="ts">
	import type { DateRange } from 'bits-ui';
	import type { DateValue } from '@internationalized/date';
	import { getLocalTimeZone } from '@internationalized/date';
	import { RangeCalendar } from '$lib/components/ui/range-calendar/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import CalendarIcon from '@lucide/svelte/icons/calendar';

	let {
		value = $bindable<DateRange | undefined>(undefined),
		onchange
	}: {
		value?: DateRange | undefined;
		onchange?: (v: DateRange | undefined) => void;
	} = $props();

	const tz = getLocalTimeZone();

	function fmt(d: DateValue): string {
		return d.toDate(tz).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
	}

	const isActive = $derived(value?.start != null);

	const label = $derived(
		!value?.start
			? 'Date range'
			: value.end
				? `${fmt(value.start)} – ${fmt(value.end)}`
				: fmt(value.start)
	);

	function handleChange(v: DateRange | undefined) {
		value = v;
		onchange?.(v);
	}

	function clear() {
		value = undefined;
		onchange?.(undefined);
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
	<Popover.Content class="w-auto p-0" align="end">
		<RangeCalendar {value} onValueChange={handleChange} />
		{#if isActive}
			<div class="border-t p-2">
				<Button variant="ghost" size="sm" class="w-full" onclick={clear}>Clear dates</Button>
			</div>
		{/if}
	</Popover.Content>
</Popover.Root>
