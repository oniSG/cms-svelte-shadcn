<script lang="ts">
	import { buttonVariants } from '$lib/components/ui/button/index.js';
	import * as Sheet from '$lib/components/ui/sheet/index.js';
	import { Badge } from '$lib/components/ui/badge';
	import XIcon from '@lucide/svelte/icons/x';
	import { tagColorClass } from '$lib/components/custom/table-page';
	import { localeState } from '$lib/i18n.svelte';
	import type { Fan } from '../fan';

	let { fan }: { fan: Fan } = $props();

	const formatter = $derived(
		new Intl.DateTimeFormat(localeState.current, { dateStyle: 'medium', timeStyle: 'short' })
	);
</script>

<Sheet.Header>
	<Sheet.Title>{fan.first_name} {fan.surname}</Sheet.Title>
	<Sheet.Description>{fan.email}</Sheet.Description>
</Sheet.Header>

<div class="space-y-4 px-4 text-sm">
	<dl class="grid grid-cols-[max-content_1fr] gap-x-4 gap-y-2">
		<dt class="text-muted-foreground">ID</dt>
		<dd class="font-mono">{fan.id}</dd>

		<dt class="text-muted-foreground">Phone</dt>
		<dd>{fan.phone ?? '—'}</dd>

		<dt class="text-muted-foreground">City</dt>
		<dd>{fan.city ?? '—'}</dd>

		<dt class="text-muted-foreground">Source</dt>
		<dd>
			<Badge variant="outline" class="font-medium uppercase">{fan.registration_source}</Badge>
		</dd>

		<dt class="text-muted-foreground">Partner</dt>
		<dd>{fan.partner ?? '—'}</dd>

		<dt class="text-muted-foreground">In segment</dt>
		<dd>{fan.segment_match ? 'Yes' : 'No'}</dd>

		<dt class="text-muted-foreground">Date added</dt>
		<dd class="tabular-nums">{formatter.format(fan.date_added)}</dd>
	</dl>

	{#if fan.tags.length > 0}
		<div>
			<div class="mb-2 text-muted-foreground">Tags</div>
			<div class="flex flex-wrap gap-1">
				{#each fan.tags as tag (tag)}
					<Badge variant="outline" class="font-medium {tagColorClass(tag)}">{tag}</Badge>
				{/each}
			</div>
		</div>
	{/if}
</div>

<Sheet.Footer>
	<Sheet.Close class={buttonVariants({ variant: 'outline' })}>
		<XIcon />
		Close
	</Sheet.Close>
</Sheet.Footer>
