<script lang="ts">
	import * as ButtonGroup from '$lib/components/ui/button-group/index.js';
	import { Button } from '$lib/components/ui/button';
	import ChevronLeftIcon from '@lucide/svelte/icons/chevron-left';
	import ChevronRightIcon from '@lucide/svelte/icons/chevron-right';
	import GotoPage from './goto-page.svelte';

	let {
		page,
		total,
		totalPages,
		loading,
		onGotoPage,
		onNext,
		onPrev
	}: {
		page: number;
		total: number;
		totalPages: number;
		loading: boolean;
		onGotoPage: (page: number) => void;
		onNext: () => void;
		onPrev: () => void;
	} = $props();

	const isFirst = $derived(page <= 1);
	const isLast = $derived(page >= totalPages);
	const initialLoad = $derived(loading && total === 0);
</script>

{#if initialLoad}
	<ButtonGroup.Root>
		<Button variant="outline" size="sm" disabled aria-label="Previous page" class="px-2">
			<ChevronLeftIcon />
		</Button>
		<Button variant="outline" size="sm" disabled class="tabular-nums">0 / 0</Button>
		<Button variant="outline" size="sm" disabled aria-label="Next page" class="px-2">
			<ChevronRightIcon />
		</Button>
	</ButtonGroup.Root>
{:else}
	<ButtonGroup.Root>
		<Button
			variant="outline"
			size="sm"
			disabled={isFirst || loading}
			aria-label="Previous page"
			onclick={onPrev}
			class="px-2"
		>
			<ChevronLeftIcon />
		</Button>
		<GotoPage currentPage={page} {totalPages} onGoto={onGotoPage} />
		<Button
			variant="outline"
			size="sm"
			disabled={isLast || loading}
			aria-label="Next page"
			onclick={onNext}
			class="px-2"
		>
			<ChevronRightIcon />
		</Button>
	</ButtonGroup.Root>
{/if}
