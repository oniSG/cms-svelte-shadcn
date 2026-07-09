<script lang="ts">
	import { afterNavigate } from '$app/navigation';
	import { untrack } from 'svelte';
	import { z } from 'zod';
	import { defaults, superForm } from 'sveltekit-superforms';
	import { zod4, zod4Client } from 'sveltekit-superforms/adapters';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Textarea } from '$lib/components/ui/textarea/index.js';
	import { Switch } from '$lib/components/ui/switch/index.js';
	import RequiredMark from '$lib/components/custom/required-mark.svelte';
	import MultiSelectCombobox from '$lib/components/custom/multi-select-combobox.svelte';
	import type { FanAction } from '$lib/types/fan-action.js';
	import { allTags as tagOptions } from '../../../temp/options.js';
	import { data as fanActions, updateFanAction } from '../../../temp/data.js';
	import { getFanActionSaveHandlers } from '../shared/editing-context.js';
	import * as m from '$lib/paraglide/messages.js';

	const basicInfoFormSchema = z.object({
		name: z
			.string()
			.trim()
			.min(2, m.fan_action_basic_info_name_min({ min: 2 }))
			.max(50, m.fan_action_basic_info_name_max({ max: 50 })),
		description: z
			.string()
			.trim()
			.min(2, m.fan_action_basic_info_description_min({ min: 2 }))
			.max(250, m.fan_action_basic_info_description_max({ max: 250 })),
		transactionActions: z.boolean(),
		tags: z.array(z.string())
	});

	let { action = null }: { action?: FanAction | null } = $props();

	const form = superForm(defaults(zod4(basicInfoFormSchema)), {
		id: 'fan-action-basic-info',
		SPA: true,
		validators: zod4Client(basicInfoFormSchema),
		resetForm: false
	});

	const { form: formData, enhance, reset, validateForm } = form;

	const saveHandlers = getFanActionSaveHandlers();
	let loadedActionId = $state<number | null>(null);

	afterNavigate(() => {
		loadedActionId = null;
	});

	$effect(() => {
		const id = action?.id;
		if (!id || id === loadedActionId) return;
		loadedActionId = id;

		const current = fanActions.find((item) => item.id === id);
		if (!current) return;

		reset({
			data: {
				name: current.event,
				description: current.description,
				transactionActions: current.transactionActions,
				tags: [...current.tags]
			}
		});
	});

	$effect(() => {
		const id = action?.id;
		if (!id) return;

		const handlers = untrack(() => saveHandlers);
		if (!handlers) return;

		handlers.basicInfo = async () => {
			const result = await validateForm({ update: true });
			if (!result.valid) return false;

			return updateFanAction(id, {
				event: result.data.name,
				description: result.data.description,
				transactionActions: result.data.transactionActions,
				tags: [...result.data.tags]
			});
		};

		return () => {
			delete handlers.basicInfo;
		};
	});
</script>

<form use:enhance novalidate onsubmit={(e) => e.preventDefault()} class="space-y-3">
	<Form.Field {form} name="name">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label class="text-sm font-medium text-muted-foreground">
					{m.event_name_label()}<RequiredMark />
				</Form.Label>
				<Input
					{...props}
					bind:value={$formData.name}
					id="action-name"
					placeholder={m.event_name_placeholder()}
					maxlength={50}
				/>
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="description">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label class="text-sm font-medium text-muted-foreground">
					{m.col_description()}<RequiredMark />
				</Form.Label>
				<Textarea
					{...props}
					bind:value={$formData.description}
					id="action-description"
					rows={3}
					maxlength={250}
				/>
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="transactionActions">
		<Form.Control>
			{#snippet children({ props })}
				<div class="flex items-center justify-between space-x-2">
					<Form.Label class="text-sm font-medium text-muted-foreground" for="transaction-actions">
						{m.fan_action_transaction_actions()}
					</Form.Label>
					<Switch {...props} bind:checked={$formData.transactionActions} id="transaction-actions" />
				</div>
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="tags">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label class="text-sm font-medium text-muted-foreground" for="action-tags">
					{m.event_tags_label()}
				</Form.Label>
				<MultiSelectCombobox
					{...props}
					id="action-tags"
					bind:value={$formData.tags}
					options={tagOptions}
					placeholder={m.fan_action_tags_placeholder()}
					searchPlaceholder={m.event_tags_search()}
					emptyText={m.event_no_results()}
				/>
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
</form>
