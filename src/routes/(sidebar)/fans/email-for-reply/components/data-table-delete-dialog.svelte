<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';

	import * as m from '$lib/paraglide/messages.js';

	type Email = { id: number; email: string; isActive: string };
	let { emailToDelete = $bindable() }: { emailToDelete: Email | null; } = $props();
</script>

<Dialog.Root onOpenChange={(open) => { if (!open) emailToDelete = null; }} open={emailToDelete !== null}>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>{m.reply_email_dialog_delete_title()}</Dialog.Title>
			<Dialog.Description>
				{m.reply_email_dialog_delete_description({ email: ` ${emailToDelete?.email}` })}
			</Dialog.Description>
		</Dialog.Header>
		<Dialog.Footer>
			<Button onclick={() => emailToDelete = null} variant="outline">{m.common_cancel()}</Button>
			<Button onclick={() => { emailToDelete = null; }} variant="destructive">{m.reply_email_delete()}</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>