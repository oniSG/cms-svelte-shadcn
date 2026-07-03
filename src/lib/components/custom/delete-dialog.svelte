<script lang="ts">
	import type { Snippet } from 'svelte';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
	import TrashIcon from '@lucide/svelte/icons/trash-2';

	let {
		open = $bindable(false),
		title = 'Delete',
		description,
		confirmLabel = 'Delete',
		cancelLabel = 'Cancel',
		onConfirm
	}: {
		open?: boolean;
		title?: string;
		description?: string | Snippet;
		confirmLabel?: string;
		cancelLabel?: string;
		onConfirm: () => void;
	} = $props();

	function handleConfirm() {
		onConfirm();
		open = false;
	}
</script>

<Dialog.Root bind:open>
	<Dialog.Content class="w-xs" showCloseButton={false}>
		<Dialog.Header>
			<div
				class="mx-auto mb-1 flex size-11 items-center justify-center rounded-full bg-destructive/10 text-destructive"
			>
				<TrashIcon class="size-5" />
			</div>
			<Dialog.Title class="text-center">{title}</Dialog.Title>
			{#if description}
				<Dialog.Description class="text-center">
					{#if typeof description === 'string'}
						{description}
					{:else}
						{@render description()}
					{/if}
				</Dialog.Description>
			{/if}
		</Dialog.Header>
		<Dialog.Footer class="flex-row justify-center gap-2 sm:justify-center">
			<Dialog.Close class={buttonVariants({ variant: 'outline' })}>{cancelLabel}</Dialog.Close>
			<Button variant="destructive" onclick={handleConfirm}>
				<TrashIcon />
				{confirmLabel}
			</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
