<script lang="ts">
	import type { ComponentProps } from 'svelte';
	import ArrowUpDownIcon from '@lucide/svelte/icons/arrow-up-down';
	import ArrowUpIcon from '@lucide/svelte/icons/arrow-up';
	import ArrowDownIcon from '@lucide/svelte/icons/arrow-down';
	import { Button } from '$lib/components/ui/button/index.js';

	let {
		variant = 'ghost',
		sort = false,
		...restProps
	}: ComponentProps<typeof Button> & { sort?: false | 'asc' | 'desc' } = $props();
</script>

<Button {variant} {...restProps}>
	Email
	{#if sort === 'asc'}
		<ArrowUpIcon class="ms-2" />
	{:else if sort === 'desc'}
		<ArrowDownIcon class="ms-2" />
	{:else}
		<ArrowUpDownIcon class="ms-2" />
	{/if}
</Button>
