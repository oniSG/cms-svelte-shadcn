<script lang="ts">
	import { Label } from '$lib/components/ui/label/index.js';
	import * as HoverCard from '$lib/components/ui/hover-card/index.js';
	import Info from '@lucide/svelte/icons/info';
	import { drawerLabelClass } from './drawer-styles';

	let {
		label,
		description,
		required = false,
		forId
	}: {
		label: string;
		description: string;
		required?: boolean;
		forId?: string;
	} = $props();
</script>

<div class="flex items-center gap-1.5">
	{#if forId}
		<Label class={drawerLabelClass} for={forId}>{label}</Label>
	{:else}
		<span class={drawerLabelClass}>
			{label}
			{#if required}
				<span class="text-destructive">*</span>
			{/if}
		</span>
	{/if}
	<HoverCard.Root openDelay={200} closeDelay={100}>
		<HoverCard.Trigger>
			{#snippet child({ props })}
				<button
					{...props}
					type="button"
					class="inline-flex shrink-0 cursor-pointer rounded-sm p-0.5 text-muted-foreground hover:text-foreground"
				>
					<Info class="size-3.5" />
					<span class="sr-only">{label}</span>
				</button>
			{/snippet}
		</HoverCard.Trigger>
		<HoverCard.Content side="left" class="w-56">
			<div class="space-y-1">
				<h4 class="text-sm font-semibold">{label}</h4>
				<p class="text-sm text-muted-foreground">{description}</p>
			</div>
		</HoverCard.Content>
	</HoverCard.Root>
</div>
