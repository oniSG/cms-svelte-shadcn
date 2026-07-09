<script lang="ts">
	import { untrack } from 'svelte';
	import { z } from 'zod';
	import { defaults, superForm } from 'sveltekit-superforms';
	import { zod4, zod4Client } from 'sveltekit-superforms/adapters';
	import * as Form from '$lib/components/ui/form';
	import { Switch } from '$lib/components/ui/switch/index.js';
	import * as HoverCard from '$lib/components/ui/hover-card/index.js';
	import Info from '@lucide/svelte/icons/info';
	import type { FanAction } from '$lib/types/fan-action.js';
	import { getFanActionSaveHandlers } from '../shared/editing-context.js';
	import * as m from '$lib/paraglide/messages.js';

	const settingsFormSchema = z.object({
		automaticStop: z.boolean(),
		plannedRunOut: z.boolean()
	});

	let { action = null }: { action?: FanAction | null } = $props();

	const form = superForm(defaults(zod4(settingsFormSchema)), {
		id: 'fan-action-settings',
		SPA: true,
		validators: zod4Client(settingsFormSchema),
		resetForm: false
	});

	const { form: formData, enhance, reset, validateForm } = form;

	const saveHandlers = getFanActionSaveHandlers();

	$effect(() => {
		const current = untrack(() => action);
		if (!current) return;

		reset({
			data: {
				automaticStop: current.automaticStop,
				plannedRunOut: current.plannedRunOut
			}
		});
	});

	$effect(() => {
		const current = action;
		if (!saveHandlers || !current) return;

		saveHandlers.settings = async () => {
			const result = await validateForm({ update: true });
			if (!result.valid) return false;

			current.automaticStop = result.data.automaticStop;
			current.plannedRunOut = result.data.plannedRunOut;
			return true;
		};

		return () => {
			delete saveHandlers.settings;
		};
	});
</script>

<form use:enhance novalidate onsubmit={(e) => e.preventDefault()} class="space-y-4">
	<Form.Field {form} name="automaticStop">
		<Form.Control>
			{#snippet children({ props })}
				<div class="flex items-center justify-between gap-2">
					<Form.Label class="text-sm font-medium text-muted-foreground" for="automatic-stop">
						{m.fan_action_settings_auto_stop()}
					</Form.Label>
					<Switch {...props} bind:checked={$formData.automaticStop} id="automatic-stop" />
				</div>
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="plannedRunOut">
		<Form.Control>
			{#snippet children({ props })}
				<div class="flex items-center justify-between gap-2">
					<div class="flex min-w-0 items-center gap-2">
						<Form.Label class="text-sm font-medium text-muted-foreground" for="planned-run-out">
							{m.fan_action_settings_planned_run_out()}
						</Form.Label>
						<HoverCard.Root openDelay={200} closeDelay={100}>
							<HoverCard.Trigger>
								{#snippet child({ props: triggerProps })}
									<button
										{...triggerProps}
										type="button"
										class="inline-flex shrink-0 cursor-pointer rounded-sm p-0.5 text-muted-foreground hover:text-foreground"
									>
										<Info class="size-3.5" />
										<span class="sr-only">{m.fan_action_settings_planned_run_out()}</span>
									</button>
								{/snippet}
							</HoverCard.Trigger>
							<HoverCard.Content side="right" class="w-56">
								<div class="space-y-1">
									<h4 class="text-sm font-semibold">{m.fan_action_settings_planned_run_out()}</h4>
									<p class="text-sm text-muted-foreground">
										{m.fan_action_settings_planned_run_out_info()}
									</p>
								</div>
							</HoverCard.Content>
						</HoverCard.Root>
					</div>
					<Switch {...props} bind:checked={$formData.plannedRunOut} id="planned-run-out" />
				</div>
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
</form>
