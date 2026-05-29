<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import type { Event } from '../columns';

	import * as m from '$lib/paraglide/messages.js';

	let { eventToDelete = $bindable() }: { eventToDelete: Event | null } = $props();
</script>

<Dialog.Root
	open={eventToDelete !== null}
	onOpenChange={(open) => { if (!open) eventToDelete = null; }}
>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>{m.event_dialog_delete_title()}</Dialog.Title>
			<Dialog.Description>
				{m.event_dialog_delete_description({ event: `${eventToDelete?.event}` })}
			</Dialog.Description>
		</Dialog.Header>
		<Dialog.Footer>
			<Button variant="outline" onclick={() => eventToDelete = null}>{m.common_cancel()}</Button>
			<Button variant="destructive" onclick={() => { eventToDelete = null; }}>
				{m.event_dialog_delete_submit()}
			</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>