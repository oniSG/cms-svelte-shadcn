<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import type { Event } from '../columns';
	import { Check, X } from '@lucide/svelte';

	import * as m from '$lib/paraglide/messages.js';

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
	onOpenChange={(open) => {
		if (!open) eventToShow = null;
	}}
	open={eventToShow !== null}
>
	<Dialog.Content class="max-w-sm">
		<Dialog.Header>
			<Dialog.Title>{eventToShow?.event}</Dialog.Title>
		</Dialog.Header>
		<div class="grid grid-cols-[auto_1fr] gap-x-6 gap-y-5 text-sm">
			<span class="text-muted-foreground">{m.col_created_by()}</span>
			<span>{eventToShow?.name}</span>
			<span class="text-muted-foreground">{m.event_tags_label()}</span>
			<div class="flex flex-wrap gap-1">
				{#each eventToShow?.label ?? [] as tag (tag)}
					<Badge variant="secondary">{tag}</Badge>
				{/each}
			</div>
			<span class="text-muted-foreground">{m.event_created_at_label()}</span>
			<span>{formattedDate}</span>
			<span class="text-muted-foreground">{m.col_active()}</span>
			<span>
				{#if eventToShow?.active === true}
					<Check class="size-4 text-primary" />
				{:else}
					<X class="size-4 text-destructive" />
				{/if}
			</span>
		</div>
		<Dialog.Footer>
			<Button onclick={() => (eventToShow = null)} variant="default">{m.common_close()}</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
