<script lang="ts">
	import { cn, type WithElementRef } from '$lib/utils.js';
	import type { HTMLThAttributes } from 'svelte/elements';

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: WithElementRef<HTMLThAttributes> = $props();
</script>

<th
	bind:this={ref}
	data-slot="table-head"
	class={cn(
		'h-12 text-left align-middle font-medium whitespace-nowrap text-foreground not-last:border-r has-[[role=checkbox]]:pr-0',
		className
	)}
	{...restProps}
>
	{@render children?.()}
</th>
