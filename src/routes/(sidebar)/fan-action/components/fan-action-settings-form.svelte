<script lang="ts">
	import { page } from '$app/state';
	import { Label } from '$lib/components/ui/label/index.js';
	import * as Tooltip from '$lib/components/ui/tooltip/index.js';
	import MultiSelectCombobox from '$lib/components/custom/multi-select-combobox.svelte';
	import { data } from '../data.js';
	import CircleHelp from '@lucide/svelte/icons/circle-help';
	import * as m from '$lib/paraglide/messages.js';

	const actionId = $derived(Number(page.params.id));
	const action = $derived(data.find((item) => item.id === actionId));

	const segmentOptions = $derived([
		m.fan_action_segment_all(),
		m.fan_action_segment_vip(),
		m.fan_action_segment_new(),
		m.fan_action_segment_inactive()
	]);

	let selectedSegments = $state<string[]>([]);

	$effect(() => {
		if (!action) return;
		selectedSegments = [m.fan_action_segment_all()];
	});
</script>

<div class="space-y-2">
	<div class="flex items-center gap-2">
		<Label class="text-sm font-medium text-muted-foreground" for="action-segments">
			{m.fan_action_segment()} <span class="text-destructive">*</span>
		</Label>
		<Tooltip.Provider>
			<Tooltip.Root>
				<Tooltip.Trigger class="inline-flex text-muted-foreground">
					<CircleHelp class="size-4" />
				</Tooltip.Trigger>
				<Tooltip.Content>{m.fan_action_segment_info()}</Tooltip.Content>
			</Tooltip.Root>
		</Tooltip.Provider>
	</div>

	<MultiSelectCombobox
		id="action-segments"
		bind:value={selectedSegments}
		options={segmentOptions}
		placeholder={m.fan_action_segment()}
		searchPlaceholder={m.fan_action_segment()}
		emptyText={m.event_no_results()}
	/>
</div>
