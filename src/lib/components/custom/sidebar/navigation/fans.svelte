<script lang="ts">
	import { page } from '$app/state';
	import NavMain from './navigation.svelte';
	import { fansNav, markActive } from './nav-data';

	const nav = $derived(markActive(fansNav(), page.url.pathname));
</script>

{#each nav as group, i (i)}
	<NavMain label={group.label} items={group.items} />
{/each}
