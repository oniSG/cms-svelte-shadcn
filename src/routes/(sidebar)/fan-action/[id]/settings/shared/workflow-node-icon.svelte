<script lang="ts">
	import type { WorkflowNodeVariant } from './types';
	import { workflowItemIcon, workflowItemIconModifier } from './workflow-items';
	import { workflowNodeIconClass, workflowNodeIconGlowColor } from './node-styles';
	import { cn } from '$lib/utils.js';

	let {
		itemId,
		variant,
		class: className,
		glowClass = 'size-11'
	}: {
		itemId: string;
		variant: WorkflowNodeVariant;
		class?: string;
		glowClass?: string;
	} = $props();

	const Icon = $derived(workflowItemIcon(itemId));
	const iconModifier = $derived(workflowItemIconModifier(itemId));
	const iconClass = $derived(workflowNodeIconClass(itemId, variant));
	const glowColor = $derived(workflowNodeIconGlowColor(itemId, variant));
	const glowGradient = $derived(
		`radial-gradient(circle, color-mix(in oklch, ${glowColor} 50%, transparent) 0%, color-mix(in oklch, ${glowColor} 18%, transparent) 42%, transparent 72%)`
	);

	const glowNoiseDataUri = `data:image/svg+xml,${encodeURIComponent(
		'<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.82" numOctaves="4" stitchTiles="stitch"/></filter><rect width="100%" height="100%" filter="url(#n)"/></svg>'
	)}`;
</script>

<div class="relative flex shrink-0 items-center justify-center">
	<div
		class={cn('pointer-events-none absolute overflow-hidden rounded-full blur-[10px]', glowClass)}
		aria-hidden="true"
	>
		<div class="size-full" style:background={glowGradient}></div>
		<div
			class="absolute inset-0 opacity-[0.3] mix-blend-soft-light"
			style:background-image={`url("${glowNoiseDataUri}")`}
			style:background-size="96px 96px"
		></div>
	</div>
	<Icon class={cn('relative z-10', iconClass, iconModifier, className)} />
</div>
