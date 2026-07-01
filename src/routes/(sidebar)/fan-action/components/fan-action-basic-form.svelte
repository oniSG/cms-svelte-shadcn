<script lang="ts">
	import { page } from '$app/state';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Textarea } from '$lib/components/ui/textarea/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import * as Tooltip from '$lib/components/ui/tooltip/index.js';
	import { Switch } from '$lib/components/ui/switch/index.js';
	import MultiSelectCombobox from '$lib/components/custom/multi-select-combobox.svelte';
	import { data } from '../data.js';
	import { allTags as tagOptions } from '../fan-action.js';
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

	let name = $state('');
	let description = $state('');
	let transactionActions = $state(false);
	let selectedSegments = $state<string[]>([]);
	let selectedTags = $state<string[]>([]);

	$effect(() => {
		if (!action) return;

		name = action.event;
		description = action.description;
		transactionActions = false;
		selectedSegments = [m.fan_action_segment_all()];
		selectedTags = [...action.tags];
	});
</script>

<div class="space-y-3">
	<div class="space-y-2">
		<Label for="action-name">
			{m.event_name_label()} <span class="text-destructive">*</span>
		</Label>
		<Input bind:value={name} id="action-name" placeholder={m.event_name_placeholder()} />
	</div>

	<div class="space-y-2">
		<Label for="action-description">
			{m.col_description()} <span class="text-destructive">*</span>
		</Label>
		<Textarea bind:value={description} id="action-description" rows={3} />
	</div>

	<div class="flex items-center justify-between space-x-2">
		<Label for="transaction-actions">{m.fan_action_transaction_actions()}</Label>
		<Switch bind:checked={transactionActions} id="transaction-actions" />
	</div>

	<div class="space-y-2">
	<!--
		<div class="flex items-center gap-2">
			<Label for="action-segments">
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
	-->
</div>

	<div class="space-y-2">
		<Label for="action-tags">{m.event_tags_label()}</Label>
		<MultiSelectCombobox
			id="action-tags"
			bind:value={selectedTags}
			options={tagOptions}
			placeholder={m.fan_action_tags_placeholder()}
			searchPlaceholder={m.event_tags_search()}
			emptyText={m.event_no_results()}
		/>
	</div>
</div>
