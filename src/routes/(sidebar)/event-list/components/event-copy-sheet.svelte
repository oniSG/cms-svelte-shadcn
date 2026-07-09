<script lang="ts">
	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
	import * as Sheet from '$lib/components/ui/sheet/index.js';
	import type { Event } from '../event-list';
	import * as m from '$lib/paraglide/messages.js';

	let {
		open = $bindable(false),
		event,
		onConfirm
	}: {
		open?: boolean;
		event?: Event;
		onConfirm?: (event: Event) => void;
	} = $props();

	function handleConfirm() {
		if (!event) return;
		onConfirm?.(event);
		open = false;
	}
</script>

<Sheet.Root bind:open>
	<Sheet.Content class="gap-0">
		<Sheet.Header>
			<Sheet.Title>{m.event_dialog_copy_title()}</Sheet.Title>
			<Sheet.Description>
				{m.event_dialog_copy_description({ event: event?.event ?? '' })}
			</Sheet.Description>
		</Sheet.Header>

		<Sheet.Footer class="flex-row justify-end gap-2">
			<Sheet.Close type="button" class={buttonVariants({ variant: 'outline' })}>
				{m.common_cancel()}
			</Sheet.Close>
			<Button onclick={handleConfirm} disabled={!event}>
				{m.event_dialog_copy_submit()}
			</Button>
		</Sheet.Footer>
	</Sheet.Content>
</Sheet.Root>
