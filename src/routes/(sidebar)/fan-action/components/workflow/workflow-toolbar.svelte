<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import { Switch } from '$lib/components/ui/switch/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import Check from '@lucide/svelte/icons/check';
	import CloudUpload from '@lucide/svelte/icons/cloud-upload';
	import Settings from '@lucide/svelte/icons/settings';
	import * as m from '$lib/paraglide/messages.js';

	let {
		processed = 100,
		saved = true,
		scriptStopped = $bindable(true),
		testingStopped = $bindable(true),
		onSave
	}: {
		processed?: number;
		saved?: boolean;
		scriptStopped?: boolean;
		testingStopped?: boolean;
		onSave?: () => void;
	} = $props();
</script>

<div class="flex flex-wrap items-center justify-between gap-4 border-b bg-muted/30 px-4 py-3">
	<div class="min-w-[160px] flex-1 space-y-1">
		<div class="flex items-center justify-between text-xs text-muted-foreground">
			<span>{m.fan_action_flow_processed({ percent: processed })}</span>
		</div>
		<div class="h-2 overflow-hidden rounded-full bg-muted">
			<div class="h-full rounded-full bg-primary transition-all" style="width: {processed}%"></div>
		</div>
	</div>

	<div class="flex flex-wrap items-center gap-4">
		{#if saved}
			<div class="flex items-center gap-1.5 text-sm text-emerald-600">
				<Check class="size-4" />
				{m.fan_action_flow_saved()}
			</div>
		{/if}

		<div class="flex items-center gap-2">
			<Switch bind:checked={scriptStopped} id="script-stopped" />
			<Label class="text-xs font-normal text-destructive" for="script-stopped">
				{m.fan_action_flow_script_stopped()}
			</Label>
		</div>

		<div class="flex items-center gap-2">
			<Switch bind:checked={testingStopped} id="testing-stopped" />
			<Label class="text-xs font-normal text-destructive" for="testing-stopped">
				{m.fan_action_flow_testing_stopped()}
			</Label>
		</div>

		<Button onclick={() => onSave?.()}>
			<CloudUpload class="size-4" />
			{m.save()}
		</Button>

		<Button size="icon" variant="ghost">
			<Settings class="size-4" />
		</Button>
	</div>
</div>
