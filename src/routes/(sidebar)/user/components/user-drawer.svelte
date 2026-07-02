<script lang="ts">
	import { buttonVariants } from '$lib/components/ui/button/index.js';
	import * as Sheet from '$lib/components/ui/sheet/index.js';
	import { Badge } from '$lib/components/ui/badge';
	import XIcon from '@lucide/svelte/icons/x';
	import { tagColorClass } from '$lib/components/custom/table-page';
	import { localeState } from '$lib/i18n.svelte';
	import type { User } from '../user';

	let { user }: { user: User } = $props();

	const formatter = $derived(
		new Intl.DateTimeFormat(localeState.current, { dateStyle: 'medium', timeStyle: 'short' })
	);
</script>

<Sheet.Header>
	<Sheet.Title>{user.first_name} {user.surname}</Sheet.Title>
	<Sheet.Description>{user.email}</Sheet.Description>
</Sheet.Header>

<div class="space-y-4 px-4 text-sm">
	<dl class="grid grid-cols-[max-content_1fr] gap-x-4 gap-y-2">
		<dt class="text-muted-foreground">ID</dt>
		<dd class="font-mono">{user.id}</dd>

		<dt class="text-muted-foreground">Phone</dt>
		<dd>{user.phone ?? '—'}</dd>

		<dt class="text-muted-foreground">Active</dt>
		<dd>{user.active ? 'Yes' : 'No'}</dd>

		<dt class="text-muted-foreground">2FA</dt>
		<dd>{user.two_fa ? 'Enabled' : 'Disabled'}</dd>

		<dt class="text-muted-foreground">Last activity</dt>
		<dd class="tabular-nums">{formatter.format(user.last_activity)}</dd>
	</dl>

	{#if user.tags.length > 0}
		<div>
			<div class="mb-2 text-muted-foreground">Tags</div>
			<div class="flex flex-wrap gap-1">
				{#each user.tags as tag (tag)}
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
