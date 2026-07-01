<script lang="ts">
	import { MinusIcon, XIcon } from '@lucide/svelte';
	import CheckIcon from '@lucide/svelte/icons/check';

	let { value }: { value: unknown } = $props();
</script>

{#if value === true}
	<CheckIcon class="size-4 text-emerald-500" />
{:else if value === false}
	<XIcon class="size-4 text-destructive" />
{:else}
	<MinusIcon class="size-4 text-muted-foreground/50" />
{/if}
