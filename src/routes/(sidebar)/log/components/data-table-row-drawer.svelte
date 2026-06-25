<script lang="ts">
	import { buttonVariants } from '$lib/components/ui/button/index.js';
	import type { Snippet } from 'svelte';
	import type { Log } from '../columns';
	import CodeBlock from './code-block.svelte';
	import * as Drawer from '$lib/components/ui/drawer/index.js';
	import { cn } from 'tailwind-variants';
	import Button from '$lib/components/ui/button/button.svelte';
	import { CheckIcon, CopyIcon, XIcon } from '@lucide/svelte';
	import * as m from '$lib/paraglide/messages.js';

	const { children, log }: { children: Snippet<[Record<string, unknown>]>; log: Log } = $props();

	const logJson = $derived(JSON.stringify(log, null, 2));
	let copied = $state(false);
	let resetTimer: ReturnType<typeof setTimeout> | undefined;

	async function copyLog() {
		await navigator.clipboard.writeText(logJson);
		copied = true;
		clearTimeout(resetTimer);
		resetTimer = setTimeout(() => (copied = false), 2000);
	}
</script>

<Drawer.Root direction="right">
	<Drawer.Trigger class={cn(buttonVariants({ variant: 'outline' }), 'capitalize')}>
		{#snippet child({ props })}
			{@render children(props)}
		{/snippet}
	</Drawer.Trigger>
	<Drawer.Content>
		<Drawer.Header>
			<Drawer.Title>{m.log_drawer_title({ id: log.id })}</Drawer.Title>
		</Drawer.Header>
		<div class="no-scrollbar overflow-y-auto px-4">
			<CodeBlock code={logJson} />
		</div>
		<Drawer.Footer class="flex gap-2">
			<Button variant="outline" onclick={copyLog}>
				{#if copied}
					<CheckIcon class="text-emerald-500" />
					{m.log_drawer_copied()}
				{:else}
					<CopyIcon />
					{m.log_drawer_copy()}
				{/if}
			</Button>
			<Drawer.Close class={buttonVariants({ variant: 'outline' })}>
				<XIcon />
				{m.log_drawer_close()}
			</Drawer.Close>
		</Drawer.Footer>
	</Drawer.Content>
</Drawer.Root>
