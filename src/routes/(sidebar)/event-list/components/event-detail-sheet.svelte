<script lang="ts">
	import { buttonVariants } from '$lib/components/ui/button/index.js';
	import * as Sheet from '$lib/components/ui/sheet/index.js';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import CheckIcon from '@lucide/svelte/icons/check';
	import XIcon from '@lucide/svelte/icons/x';
	import { localeState } from '$lib/i18n.svelte';
	import type { Event } from '../event-list';
	import * as m from '$lib/paraglide/messages.js';

	let { event }: { event: Event } = $props();

	const formatter = $derived(new Intl.DateTimeFormat(localeState.current, { dateStyle: 'long' }));
</script>

<Sheet.Header>
	<Sheet.Title>{event.event}</Sheet.Title>
	<Sheet.Description>{event.name}</Sheet.Description>
</Sheet.Header>

<div class="space-y-4 px-4 text-sm">
	<dl class="grid grid-cols-[max-content_1fr] gap-x-6 gap-y-4">
		<dt class="text-muted-foreground">{m.col_created_by()}</dt>
		<dd>{event.name}</dd>

		<dt class="text-muted-foreground">{m.event_tags_label()}</dt>
		<dd>
			<div class="flex flex-wrap gap-1">
				{#each event.label as tag (tag)}
					<Badge variant="secondary">{tag}</Badge>
				{/each}
			</div>
		</dd>

		<dt class="text-muted-foreground">{m.event_created_at_label()}</dt>
		<dd class="tabular-nums">{formatter.format(event.time)}</dd>

		<dt class="text-muted-foreground">{m.col_active()}</dt>
		<dd>
			{#if event.active}
				<CheckIcon class="size-4 text-primary" />
			{:else}
				<XIcon class="size-4 text-destructive" />
			{/if}
		</dd>
	</dl>
</div>

<Sheet.Footer>
	<Sheet.Close class={buttonVariants({ variant: 'outline' })}>
		{m.common_close()}
	</Sheet.Close>
</Sheet.Footer>
