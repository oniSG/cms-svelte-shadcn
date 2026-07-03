<script lang="ts">
	import { Label } from '$lib/components/ui/label/index.js';
	import { Switch } from '$lib/components/ui/switch/index.js';
	import * as HoverCard from '$lib/components/ui/hover-card/index.js';
	import Info from '@lucide/svelte/icons/info';
	import * as m from '$lib/paraglide/messages.js';

	let automaticStop = $state(false);
	let plannedRunOut = $state(false);
</script>

<div class="space-y-4">
	<div class="flex items-center justify-between gap-2">
		<Label class="text-sm font-medium text-muted-foreground" for="automatic-stop">
			{m.fan_action_settings_auto_stop()}
		</Label>
		<Switch bind:checked={automaticStop} id="automatic-stop" />
	</div>

	<div class="flex items-center justify-between gap-2">
		<div class="flex min-w-0 items-center gap-2">
			<Label class="text-sm font-medium text-muted-foreground" for="planned-run-out">
				{m.fan_action_settings_planned_run_out()}
			</Label>
			<HoverCard.Root openDelay={200} closeDelay={100}>
				<HoverCard.Trigger>
					{#snippet child({ props })}
						<button
							{...props}
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
		<Switch bind:checked={plannedRunOut} id="planned-run-out" />
	</div>
</div>
