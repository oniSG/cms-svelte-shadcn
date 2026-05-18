<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { Toaster } from 'svelte-sonner';
	import { ModeWatcher } from 'mode-watcher';
	import { localeState } from '$lib/i18n.svelte.js';

	let { children } = $props();

	$effect(() => {
		document.documentElement.lang = localeState.current;
	});
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
<ModeWatcher />
<Toaster richColors />
{@render children()}
