<script lang="ts">
	import type { Component } from 'svelte';
	import type { DateRange } from 'bits-ui';
	import type { DateValue } from '@internationalized/date';
	import { fromDate, getLocalTimeZone, toCalendarDate } from '@internationalized/date';
	import { RangeCalendar } from '$lib/components/ui/range-calendar/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import CalendarIcon from '@lucide/svelte/icons/calendar';
	import { cn } from '$lib/utils.js';
	import { localeState } from '$lib/i18n.svelte.js';
	import * as m from '$lib/paraglide/messages.js';

	let {
		from,
		to,
		label = 'Date',
		icon: Icon = CalendarIcon,
		onChange
	}: {
		from: Date | null;
		to: Date | null;
		label?: string;
		icon?: Component;
		onChange: (from: Date | null, to: Date | null) => void;
	} = $props();

	const tz = getLocalTimeZone();

	const range: DateRange | undefined = $derived(
		from
			? {
					start: toCalendarDate(fromDate(from, tz)),
					end: to ? toCalendarDate(fromDate(to, tz)) : undefined
				}
			: undefined
	);

	const isActive = $derived(from != null);

	function fmt(d: DateValue, locale: string) {
		return d.toDate(tz).toLocaleDateString(locale, { month: 'short', day: 'numeric' });
	}

	const triggerLabel = $derived(
		!range?.start
			? label
			: range.end
				? `${fmt(range.start, localeState.current)} – ${fmt(range.end, localeState.current)}`
				: fmt(range.start, localeState.current)
	);

	function apply(v: DateRange | undefined) {
		if (!v?.start) {
			onChange(null, null);
			return;
		}
		const start = v.start.toDate(tz);
		const end = v.end ? new Date(v.end.toDate(tz).setHours(23, 59, 59, 999)) : null;
		onChange(start, end);
	}

	function startOfDay(d: Date): Date {
		const r = new Date(d);
		r.setHours(0, 0, 0, 0);
		return r;
	}

	function endOfDay(d: Date): Date {
		const r = new Date(d);
		r.setHours(23, 59, 59, 999);
		return r;
	}

	function sameDay(a: Date | null, b: Date | null): boolean {
		if (!a || !b) return false;
		return (
			a.getFullYear() === b.getFullYear() &&
			a.getMonth() === b.getMonth() &&
			a.getDate() === b.getDate()
		);
	}

	type Preset = { id: string; label: () => string; getRange: () => [Date, Date] };

	const presets: Preset[] = [
		{
			id: 'today',
			label: () => m.tp_date_today(),
			getRange: () => {
				const t = new Date();
				return [startOfDay(t), endOfDay(t)];
			}
		},
		{
			id: 'yesterday',
			label: () => m.tp_date_yesterday(),
			getRange: () => {
				const y = new Date();
				y.setDate(y.getDate() - 1);
				return [startOfDay(y), endOfDay(y)];
			}
		},
		{
			id: 'last-7',
			label: () => m.tp_date_last_7(),
			getRange: () => {
				const e = new Date();
				const s = new Date();
				s.setDate(s.getDate() - 6);
				return [startOfDay(s), endOfDay(e)];
			}
		},
		{
			id: 'last-30',
			label: () => m.tp_date_last_30(),
			getRange: () => {
				const e = new Date();
				const s = new Date();
				s.setDate(s.getDate() - 29);
				return [startOfDay(s), endOfDay(e)];
			}
		},
		{
			id: 'this-month',
			label: () => m.tp_date_this_month(),
			getRange: () => {
				const t = new Date();
				return [new Date(t.getFullYear(), t.getMonth(), 1), endOfDay(t)];
			}
		},
		{
			id: 'last-month',
			label: () => m.tp_date_last_month(),
			getRange: () => {
				const t = new Date();
				const start = new Date(t.getFullYear(), t.getMonth() - 1, 1);
				const end = endOfDay(new Date(t.getFullYear(), t.getMonth(), 0));
				return [start, end];
			}
		},
		{
			id: 'this-quarter',
			label: () => m.tp_date_this_quarter(),
			getRange: () => {
				const t = new Date();
				const q = Math.floor(t.getMonth() / 3);
				return [new Date(t.getFullYear(), q * 3, 1), endOfDay(t)];
			}
		},
		{
			id: 'ytd',
			label: () => m.tp_date_ytd(),
			getRange: () => {
				const t = new Date();
				return [new Date(t.getFullYear(), 0, 1), endOfDay(t)];
			}
		}
	];

	const activePresetId = $derived.by(() => {
		if (!from || !to) return null;
		for (const p of presets) {
			const [pf, pt] = p.getRange();
			if (sameDay(pf, from) && sameDay(pt, to)) return p.id;
		}
		return null;
	});

	function applyPreset(p: Preset) {
		const [f, t] = p.getRange();
		onChange(f, t);
	}
</script>

<Popover.Root>
	<Popover.Trigger>
		{#snippet child({ props })}
			<Button {...props} size="sm" variant={isActive ? 'default' : 'outline'}>
				<Icon />
				{triggerLabel}
			</Button>
		{/snippet}
	</Popover.Trigger>
	<Popover.Content class="w-auto p-0" align="start">
		<div class="flex">
			<div class="flex w-40 flex-col gap-0.5 border-r p-2">
				{#each presets as p (p.id)}
					{@const isActivePreset = activePresetId === p.id}
					<Button
						variant="ghost"
						size="sm"
						class={cn(
							'justify-start font-normal',
							isActivePreset && 'bg-accent font-medium text-accent-foreground'
						)}
						onclick={() => applyPreset(p)}
					>
						{p.label()}
					</Button>
				{/each}
				{#if isActive}
					<div class="mt-1 border-t pt-1">
						<Button
							variant="ghost"
							size="sm"
							class="w-full justify-start font-normal text-muted-foreground"
							onclick={() => onChange(null, null)}
						>
							{m.tp_clear()}
						</Button>
					</div>
				{/if}
			</div>
			<RangeCalendar value={range} onValueChange={apply} />
		</div>
	</Popover.Content>
</Popover.Root>
