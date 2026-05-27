<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import type { Event } from '../columns';

	let { eventToCopy = $bindable() }: { eventToCopy: Event | null } = $props();
</script>

<Dialog.Root
	onOpenChange={(open) => { if (!open) eventToCopy = null; }}
	open={eventToCopy !== null}
>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Duplikovat událost</Dialog.Title>
			<Dialog.Description>
				Opravdu chceš duplikovat <strong>{eventToCopy?.event}</strong>?
			</Dialog.Description>
		</Dialog.Header>
		<Dialog.Footer>
			<Button onclick={() => eventToCopy = null} variant="outline">Zrušit</Button>
			<Button onclick={() => {
                eventToCopy = null;
            }} variant="default">
				Duplikovat
			</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>