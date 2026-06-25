<script lang="ts">
	import { RangeCalendar as RangeCalendarPrimitive } from 'bits-ui';
	import * as Calendar from '$lib/components/ui/calendar/index.js';
	import { cn, type WithoutChildrenOrChild } from '$lib/utils.js';

	let {
		ref = $bindable(null),
		value = $bindable(),
		placeholder = $bindable(),
		class: className,
		weekdayFormat = 'short',
		...restProps
	}: WithoutChildrenOrChild<RangeCalendarPrimitive.RootProps> = $props();
</script>

<RangeCalendarPrimitive.Root
	bind:value
	bind:ref
	bind:placeholder
	{weekdayFormat}
	class={cn(
		'group/calendar bg-background p-3 [--cell-radius:var(--radius-4xl)] [--cell-size:--spacing(8)] in-data-[slot=popover-content]:bg-transparent',
		className
	)}
	{...restProps}
>
	{#snippet children({ months, weekdays })}
		<Calendar.Months>
			<Calendar.Nav>
				<Calendar.PrevButton />
				<Calendar.NextButton />
			</Calendar.Nav>
			{#each months as month (month)}
				<Calendar.Month>
					<Calendar.Header>
						<Calendar.Heading />
					</Calendar.Header>
					<Calendar.Grid>
						<Calendar.GridHead>
							<Calendar.GridRow class="select-none">
								{#each weekdays as weekday, i (i)}
									<Calendar.HeadCell>{weekday.slice(0, 2)}</Calendar.HeadCell>
								{/each}
							</Calendar.GridRow>
						</Calendar.GridHead>
						<Calendar.GridBody>
							{#each month.weeks as weekDates (weekDates)}
								<Calendar.GridRow class="mt-2 w-full">
									{#each weekDates as date (date)}
										<RangeCalendarPrimitive.Cell
											{date}
											month={month.value}
											class={cn(
												'relative size-(--cell-size) p-0 text-center text-sm focus-within:z-20',
												'data-[range-middle]:bg-accent'
											)}
										>
											<RangeCalendarPrimitive.Day
												class={cn(
													'relative z-[1] flex size-(--cell-size) items-center justify-center rounded-(--cell-radius) p-0 font-normal whitespace-nowrap select-none',
													'[&:not([data-selected]):not([data-range-middle]):not([data-disabled])]:hover:bg-accent/50',
													'data-[range-middle]:rounded-none',
													'data-[selected]:bg-primary data-[selected]:text-primary-foreground',
													// Start only: round left side, flat right side
													'[&[data-range-start]:not([data-range-end])]:rounded-e-none',
													// End only: flat left side, round right side
													'[&[data-range-end]:not([data-range-start])]:rounded-s-none',
													'[&[data-today]:not([data-selected]):not([data-range-middle])]:bg-accent [&[data-today]:not([data-selected]):not([data-range-middle])]:text-accent-foreground',
													'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
													'data-[unavailable]:text-muted-foreground data-[unavailable]:line-through',
													'data-[outside-visible-months]:pointer-events-none data-[outside-visible-months]:invisible'
												)}
											/>
										</RangeCalendarPrimitive.Cell>
									{/each}
								</Calendar.GridRow>
							{/each}
						</Calendar.GridBody>
					</Calendar.Grid>
				</Calendar.Month>
			{/each}
		</Calendar.Months>
	{/snippet}
</RangeCalendarPrimitive.Root>
