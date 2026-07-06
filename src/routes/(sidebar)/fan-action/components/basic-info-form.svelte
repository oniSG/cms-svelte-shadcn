<script lang="ts">
	import { Input } from '$lib/components/ui/input/index.js';
	import { Textarea } from '$lib/components/ui/textarea/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Switch } from '$lib/components/ui/switch/index.js';
	import MultiSelectCombobox from '$lib/components/custom/multi-select-combobox.svelte';
	import type { FanAction } from '$lib/types/fan-action.js';
	import { allTags as tagOptions } from '../temp/options.js';
	import * as m from '$lib/paraglide/messages.js';

	let { action = null }: { action?: FanAction | null } = $props();

	let name = $state('');
	let description = $state('');
	let transactionActions = $state(false);
	let selectedTags = $state<string[]>([]);

	$effect(() => {
		if (!action) return;

		name = action.event;
		description = action.description;
		transactionActions = false;
		selectedTags = [...action.tags];
	});
</script>

<div class="space-y-3">
	<div class="space-y-2">
		<Label class="text-sm font-medium text-muted-foreground" for="action-name">
			{m.event_name_label()} <span class="text-destructive">*</span>
		</Label>
		<Input bind:value={name} id="action-name" placeholder={m.event_name_placeholder()} />
	</div>

	<div class="space-y-2">
		<Label class="text-sm font-medium text-muted-foreground" for="action-description">
			{m.col_description()} <span class="text-destructive">*</span>
		</Label>
		<Textarea bind:value={description} id="action-description" rows={3} />
	</div>

	<div class="flex items-center justify-between space-x-2">
		<Label class="text-sm font-medium text-muted-foreground" for="transaction-actions"
			>{m.fan_action_transaction_actions()}</Label
		>
		<Switch bind:checked={transactionActions} id="transaction-actions" />
	</div>

	<div class="space-y-2">
		<Label class="text-sm font-medium text-muted-foreground" for="action-tags"
			>{m.event_tags_label()}</Label
		>
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
