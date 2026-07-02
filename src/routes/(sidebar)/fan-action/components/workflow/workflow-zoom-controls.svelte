<script lang="ts">
	import { Panel, useStore } from '@xyflow/svelte';
	import * as ButtonGroup from '$lib/components/ui/button-group/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import Minus from '@lucide/svelte/icons/minus';
	import Plus from '@lucide/svelte/icons/plus';
	import Scan from '@lucide/svelte/icons/scan';

	const store = useStore();

	const minZoomReached = $derived(store.viewport.zoom <= store.minZoom);
	const maxZoomReached = $derived(store.viewport.zoom >= store.maxZoom);

	function fitView() {
		store.fitView({ padding: 0.2 });
	}
</script>

<Panel position="bottom-left" class="!m-4">
	<ButtonGroup.Root>
		<Button
			type="button"
			size="icon-sm"
			variant="outline"
			class="px-2"
			onclick={() => store.zoomIn()}
			disabled={maxZoomReached}
			aria-label="Zoom in"
		>
			<Plus />
		</Button>
		<Button
			type="button"
			size="icon-sm"
			variant="outline"
			class="px-2"
			onclick={() => store.zoomOut()}
			disabled={minZoomReached}
			aria-label="Zoom out"
		>
			<Minus />
		</Button>
		<Button type="button" size="icon-sm" variant="outline" class="px-2" onclick={fitView} aria-label="Fit view">
			<Scan />
		</Button>
	</ButtonGroup.Root>
</Panel>
