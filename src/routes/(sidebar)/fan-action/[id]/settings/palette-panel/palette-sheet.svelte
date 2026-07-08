<script lang="ts">
	import * as Sheet from '$lib/components/ui/sheet/index.js';
	import PalettePanel from './palette-panel.svelte';
	import type { FanAction } from '$lib/types/fan-action.js';

	let { action = null }: { action?: FanAction | null } = $props();
</script>

<div class="flex h-full w-80 shrink-0 flex-col [&_[data-slot=sheet-overlay]]:hidden">
	<Sheet.Root open={true}>
		<Sheet.Content
			side="left"
			showCloseButton={false}
			portalProps={{ disabled: true }}
			trapFocus={false}
			preventScroll={false}
			onInteractOutside={(e) => e.preventDefault()}
			onEscapeKeydown={(e) => e.preventDefault()}
			class="!relative inset-auto top-auto left-auto h-full !w-full w-full max-w-full shrink-0 translate-x-0 overflow-hidden border-e shadow-none data-[side=left]:!w-full data-[side=left]:!max-w-full data-[state=closed]:animate-none data-[state=open]:animate-none"
		>
			<Sheet.Header class="sr-only">
				<Sheet.Title>Workflow palette</Sheet.Title>
			</Sheet.Header>

			<PalettePanel {action} />
		</Sheet.Content>
	</Sheet.Root>
</div>
