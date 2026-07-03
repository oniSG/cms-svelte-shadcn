<script lang="ts">
	import type { Align } from '../types';
	import Highlight from './highlight.svelte';

	let { value, align = 'left' }: { value: unknown; align?: Align } = $props();

	const text = $derived(value == null ? '' : String(value));
</script>

<span class:text-right={align === 'right'} class:text-center={align === 'center'}>
	<Highlight {text} />
</span>
