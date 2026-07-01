<script lang="ts">
	import type { Table as TanStackTable } from '@tanstack/table-core';
	import { Checkbox } from '$lib/components/ui/checkbox/index.js';
	import * as m from '$lib/paraglide/messages.js';

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let { table }: { table: TanStackTable<any> } = $props();
</script>

<div class="flex items-center justify-center">
	<Checkbox
		checked={table.getIsAllPageRowsSelected()}
		indeterminate={table.getIsSomePageRowsSelected()}
		onCheckedChange={(v) => table.toggleAllPageRowsSelected(!!v)}
		aria-label={m.tp_select_all_rows()}
		class="scale-110"
	/>
</div>
