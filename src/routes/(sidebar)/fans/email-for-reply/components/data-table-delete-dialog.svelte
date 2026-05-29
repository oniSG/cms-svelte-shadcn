<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';

	type Email = { id: number; email: string; isActive: string };

	let { emailToDelete = $bindable() }: { emailToDelete: Email | null; } = $props();
</script>

<Dialog.Root onOpenChange={(open) => { if (!open) emailToDelete = null; }} open={emailToDelete !== null}>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Odstranit e-mail</Dialog.Title>
			<Dialog.Description>
				Opravdu chceš odstranit <strong>{emailToDelete?.email}</strong>? Tato akce je nevratná.
			</Dialog.Description>
		</Dialog.Header>
		<Dialog.Footer>
			<Button onclick={() => emailToDelete = null} variant="outline">Zrušit</Button>
			<Button onclick={() => { emailToDelete = null; }} variant="destructive">Odstranit</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>