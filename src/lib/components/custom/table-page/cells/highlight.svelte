<script lang="ts">
	import { getContext } from 'svelte';
	import { highlightSegments, SEARCH_CTX_KEY, type SearchContext } from './search-highlight';

	let { text }: { text: string } = $props();

	const ctx = getContext<SearchContext | undefined>(SEARCH_CTX_KEY);
	const needle = $derived(ctx?.value.trim() ?? '');
	const segments = $derived(highlightSegments(text, needle));
</script>

{#if segments.length === 1 && !segments[0].match}{text}{:else}{#each segments as seg, i (i)}{#if seg.match}<mark
				class="rounded-sm bg-yellow-300 px-0.5 text-yellow-950 dark:bg-yellow-500/50 dark:text-yellow-50"
				>{seg.text}</mark
			>{:else}{seg.text}{/if}{/each}{/if}
