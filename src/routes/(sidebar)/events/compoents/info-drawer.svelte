<script lang="ts">
	import type { Snippet } from 'svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Sheet from '$lib/components/ui/sheet/index.js';
	import InfoIcon from '@lucide/svelte/icons/info';
	import { ChevronRightIcon } from '@lucide/svelte';

	let {
		title = 'Information',
		children
	}: {
		title?: string;
		children?: Snippet;
	} = $props();
</script>

<Sheet.Root>
	<Sheet.Trigger>
		{#snippet child({ props })}
			<Button {...props} variant="outline" size="icon">
				<InfoIcon />
			</Button>
		{/snippet}
	</Sheet.Trigger>
	<Sheet.Content showCloseButton={false}>
		<div class="flex min-h-0 flex-1 flex-col">
			<Sheet.Header class="flex flex-row items-center justify-between">
				<Sheet.Title>{title}</Sheet.Title>
				<Sheet.Close>
					{#snippet child({ props })}
						<Button {...props} variant="secondary" size="icon">
							<ChevronRightIcon />
						</Button>
					{/snippet}
				</Sheet.Close>
			</Sheet.Header>
			<div class="min-h-0 flex-1 overflow-y-auto px-4 pb-6">
				{#if children}
					{@render children()}
				{/if}
			</div>
		</div>
	</Sheet.Content>
</Sheet.Root>
