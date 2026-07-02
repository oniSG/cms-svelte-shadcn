<script lang="ts">
	import type { Snippet } from 'svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Drawer from '$lib/components/ui/drawer/index.js';
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

<Drawer.Root direction="right">
	<Drawer.Trigger>
		<Button variant="outline" size="icon-sm">
			<InfoIcon />
		</Button>
	</Drawer.Trigger>
	<Drawer.Content>
		<div class="flex min-h-0 flex-1 flex-col">
			<Drawer.Header class="flex flex-row items-center justify-between">
				<Drawer.Title>{title}</Drawer.Title>
				<Drawer.Close>
					<Button variant="secondary" size="icon">
						<ChevronRightIcon />
					</Button>
				</Drawer.Close>
			</Drawer.Header>
			<div class="min-h-0 flex-1 overflow-y-auto px-4 pb-6">
				{#if children}
					{@render children()}
				{/if}
			</div>
		</div>
	</Drawer.Content>
</Drawer.Root>
