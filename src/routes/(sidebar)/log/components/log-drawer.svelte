<script lang="ts">
	import { buttonVariants } from '$lib/components/ui/button/index.js';
	import * as Sheet from '$lib/components/ui/sheet/index.js';
	import Button from '$lib/components/ui/button/button.svelte';
	import CheckIcon from '@lucide/svelte/icons/check';
	import CopyIcon from '@lucide/svelte/icons/copy';
	import XIcon from '@lucide/svelte/icons/x';
	import * as m from '$lib/paraglide/messages.js';
	import type { Log } from '../log';
	import CodeBlock from './code-block.svelte';

	let { log }: { log: Log } = $props();

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

<Sheet.Header>
	<Sheet.Title>{m.log_drawer_title({ id: log.id })}</Sheet.Title>
</Sheet.Header>
<div class="no-scrollbar overflow-y-auto px-4">
	<CodeBlock code={logJson} />
</div>
<Sheet.Footer class="flex gap-2">
	<Button variant="outline" onclick={copyLog}>
		{#if copied}
			<CheckIcon class="text-emerald-500" />
			{m.log_drawer_copied()}
		{:else}
			<CopyIcon />
			{m.log_drawer_copy()}
		{/if}
	</Button>
	<Sheet.Close class={buttonVariants({ variant: 'outline' })}>
		<XIcon />
		{m.log_drawer_close()}
	</Sheet.Close>
</Sheet.Footer>
