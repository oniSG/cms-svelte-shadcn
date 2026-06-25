<script lang="ts">
	import { page } from '$app/state';
	import NavMain from './navigation.svelte';
	import { markActive, settingsNav } from './nav-data';

	const nav = $derived(markActive(settingsNav(), page.url.pathname));
</script>

{#each nav as group, i (i)}
	<NavMain label={group.label} items={group.items} />
{/each}
