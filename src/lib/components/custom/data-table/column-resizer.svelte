<script lang="ts" generics="TData">
	import type { Header } from '@tanstack/table-core';

	let { header }: { header: Header<TData, unknown> } = $props();

	const canResize = $derived(header.column.getCanResize());
	const isResizing = $derived(header.column.getIsResizing());
	const resizeHandler = $derived(header.getResizeHandler());
</script>

{#if canResize}
	<div
		aria-hidden="true"
		data-resizing={isResizing}
		onmousedown={resizeHandler}
		ontouchstart={resizeHandler}
		ondblclick={() => header.column.resetSize()}
		class="absolute top-0 right-0 z-10 h-full w-1.5 cursor-col-resize touch-none bg-transparent transition-colors select-none hover:bg-border data-[resizing=true]:bg-primary"
	></div>
{/if}
