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
</script>

<div class="relative flex shrink-0 items-center justify-center">
	<div
		class={cn('pointer-events-none absolute rounded-full blur-[10px]', glowClass)}
		style:background="radial-gradient(circle, color-mix(in oklch, {glowColor} 50%, transparent) 0%, color-mix(in
		oklch, {glowColor} 18%, transparent) 42%, transparent 72%)"
		aria-hidden="true"
	></div>
	<Icon class={cn('relative z-10', iconClass, iconModifier, className)} />
</div>
