<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import type { Event } from '../columns';

	import * as m from '$lib/paraglide/messages.js';

	let { eventToCopy = $bindable() }: { eventToCopy: Event | null } = $props();
</script>

<Dialog.Root
	onOpenChange={(open) => { if (!open) eventToCopy = null; }}
	open={eventToCopy !== null}
>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>{m.event_dialog_copy_title()}</Dialog.Title>
			<Dialog.Description>
				{@html m.event_dialog_copy_description({ event: `<strong>${eventToCopy?.event}</strong>` })}
			</Dialog.Description>
		</Dialog.Header>
		<Dialog.Footer>
			<Button onclick={() => eventToCopy = null} variant="outline">{m.common_cancel()}</Button>
			<Button onclick={() => { eventToCopy = null; }} variant="default">
				{m.event_dialog_copy_submit()}
			</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>