<script lang="ts">
	import { page } from '$app/state';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import { moduleState } from '$lib/stores/module.svelte';
	import { untrack, type ComponentProps } from 'svelte';
	import ModuleSwitcher from './module-switcher.svelte';
	import Business from './navigation/business.svelte';
	import Fans from './navigation/fans.svelte';
	import { getModuleForPath } from './navigation/nav-data';
	import Settings from './navigation/settings.svelte';
	import NavUser from './user.svelte';

	let {
		ref = $bindable(null),
		collapsible = 'icon',
		...restProps
	}: ComponentProps<typeof Sidebar.Root> = $props();

	const initialModule = getModuleForPath(page.url.pathname);
	if (initialModule && initialModule !== moduleState.current) {
		moduleState.current = initialModule;
	}

	$effect(() => {
		const mod = getModuleForPath(page.url.pathname);
		if (mod && mod !== untrack(() => moduleState.current)) {
			moduleState.current = mod;
		}
	});
</script>

<Sidebar.Root bind:ref {collapsible} {...restProps}>
	<Sidebar.Header>
		<ModuleSwitcher />
	</Sidebar.Header>
	<Sidebar.Content>
		{#if moduleState.current === 'business'}
			<Business />
		{:else if moduleState.current === 'fans'}
			<Fans />
		{:else}
			<Settings />
		{/if}
	</Sidebar.Content>
	<Sidebar.Footer>
		<NavUser />
	</Sidebar.Footer>
	<Sidebar.Rail />
</Sidebar.Root>
