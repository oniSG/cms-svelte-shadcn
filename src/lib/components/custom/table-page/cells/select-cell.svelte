<script lang="ts">
	import type { Row as TanStackRow } from '@tanstack/table-core';
	import { Checkbox } from '$lib/components/ui/checkbox/index.js';

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let { row }: { row: TanStackRow<any> } = $props();

	function handleClick(e: MouseEvent) {
		e.stopPropagation();
		// If the click landed on the checkbox button itself it already handled
		// the toggle via onCheckedChange — skip to avoid double-toggling.
		if (e.target !== e.currentTarget) return;
		if (row.getCanSelect()) row.toggleSelected(!row.getIsSelected());
	}
</script>

<div
	class="absolute inset-0 flex cursor-pointer items-center justify-center"
	onclick={handleClick}
	role="presentation"
>
	<Checkbox
		checked={row.getIsSelected()}
		disabled={!row.getCanSelect()}
		onCheckedChange={(v) => row.toggleSelected(!!v)}
		aria-label="Select row"
		class="scale-110"
	/>
</div>
