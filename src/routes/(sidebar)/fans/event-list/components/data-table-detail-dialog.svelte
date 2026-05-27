<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import type { Event } from '../columns';
	import { Check, X } from '@lucide/svelte';

	let { eventToShow = $bindable() }: { eventToShow: Event | null } = $props();

	const formattedDate = $derived(
		eventToShow?.time
			? new Date(eventToShow.time).toLocaleDateString('cs-CZ', {
				day: 'numeric',
				month: 'long',
				year: 'numeric'
			})
			: ''
	);
</script>

<Dialog.Root
	onOpenChange={(open) => { if (!open) eventToShow = null; }}
	open={eventToShow !== null}
>
	<Dialog.Content class="max-w-sm">
		<Dialog.Header>
			<Dialog.Title>{eventToShow?.event}</Dialog.Title>
		</Dialog.Header>

		<div class="grid grid-cols-[auto_1fr] gap-x-6 gap-y-5 text-sm ">
			<span class="text-muted-foreground">Vytvořil/a</span>
			<span>{eventToShow?.name}</span>

			<span class="text-muted-foreground">Štítky</span>
			<div class="flex flex-wrap gap-1">
				{#each (eventToShow?.label ?? []) as tag (tag)}
					<Badge variant="secondary">{tag}</Badge>
				{/each}
			</div>

			<span class="text-muted-foreground">Vytvořeno</span>
			<span>{formattedDate}</span>

			<span class="text-muted-foreground">Aktivní</span>
			<span>
				{#if eventToShow?.active === true}
					<Check class="text-primary size-4" />
				{:else}
					<X class="text-destructive size-4" />
				{/if}
			</span>
		</div>

		<Dialog.Footer>
			<Button onclick={() => eventToShow = null} variant="default">Zavřít</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>