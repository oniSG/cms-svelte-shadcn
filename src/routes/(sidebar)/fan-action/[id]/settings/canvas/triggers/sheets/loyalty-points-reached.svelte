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

	let dateFromOpen = $state(false);
	let dateToOpen = $state(false);
	let dateFrom = $state<DateValue | undefined>();
	let dateTo = $state<DateValue | undefined>();
	let pointsCount = $state('');

	function formatDate(value: DateValue | undefined): string | null {
		if (!value) return null;
		return value.toDate(getLocalTimeZone()).toLocaleDateString(undefined, {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric'
		});
	}
</script>

<div class="space-y-3">
	<div class="space-y-2">
		<Label class={labelClass}>
			{m.fan_action_flow_trigger_loyalty_points_reached_date_label()}
			<span class="text-destructive">*</span>
		</Label>
		<div class="grid grid-cols-2 gap-2">
			<Popover.Root bind:open={dateFromOpen}>
				<Popover.Trigger class="w-full">
					{#snippet child({ props })}
						<Button
							{...props}
							variant="outline"
							class="{selectTriggerClass} justify-between font-normal"
						>
							<span
								class:truncate={Boolean(formatDate(dateFrom))}
								class:text-muted-foreground={!dateFrom}
							>
								{formatDate(dateFrom) ??
									m.fan_action_flow_trigger_loyalty_points_reached_date_placeholder()}
							</span>
							<ChevronDown class="size-4 shrink-0 opacity-50" />
						</Button>
					{/snippet}
				</Popover.Trigger>
				<Popover.Content class="w-auto overflow-hidden p-0" align="start">
					<Calendar type="single" bind:value={dateFrom} captionLayout="dropdown" />
				</Popover.Content>
			</Popover.Root>

			<Popover.Root bind:open={dateToOpen}>
				<Popover.Trigger class="w-full">
					{#snippet child({ props })}
						<Button
							{...props}
							variant="outline"
							class="{selectTriggerClass} justify-between font-normal"
						>
							<span
								class:truncate={Boolean(formatDate(dateTo))}
								class:text-muted-foreground={!dateTo}
							>
								{formatDate(dateTo) ??
									m.fan_action_flow_trigger_loyalty_points_reached_date_placeholder()}
							</span>
							<ChevronDown class="size-4 shrink-0 opacity-50" />
						</Button>
					{/snippet}
				</Popover.Trigger>
				<Popover.Content class="w-auto overflow-hidden p-0" align="start">
					<Calendar type="single" bind:value={dateTo} captionLayout="dropdown" />
				</Popover.Content>
			</Popover.Root>
		</div>
	</div>

	<div class="space-y-2">
		<Label class={labelClass} for="loyalty-points-reached-count">
			{m.fan_action_flow_trigger_loyalty_points_reached_points_label()}
			<span class="text-destructive">*</span>
		</Label>
		<Input
			bind:value={pointsCount}
			id="loyalty-points-reached-count"
			type="number"
			min="1"
			class="bg-background"
		/>
	</div>
</div>
