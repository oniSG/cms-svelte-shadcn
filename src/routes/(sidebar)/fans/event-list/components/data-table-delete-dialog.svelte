<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import type { Event } from '../columns';

	let { eventToDelete = $bindable() }: { eventToDelete: Event | null } = $props();
</script>

<Dialog.Root
	open={eventToDelete !== null}
	onOpenChange={(open) => { if (!open) eventToDelete = null; }}
>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Smazat událost</Dialog.Title>
			<Dialog.Description>
				Opravdu chceš smazat <strong>{eventToDelete?.event}</strong>? Tato akce je nevratná.
			</Dialog.Description>
		</Dialog.Header>
		<Dialog.Footer>
			<Button variant="outline" onclick={() => eventToDelete = null}>Zrušit</Button>
			<Button variant="destructive" onclick={() => {
                eventToDelete = null;
            }}>
				Smazat
			</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>