<script lang="ts">
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import { moduleState } from '$lib/stores/module.svelte';
	import type { ComponentProps } from 'svelte';
	import ModuleSwitcher from './module-switcher.svelte';
	import NavUser from './user.svelte';
	import Fans from './navigation/fans.svelte';
	import Settings from './navigation/settings.svelte';
	import Business from './navigation/business.svelte';

	let {
		ref = $bindable(null),
		collapsible = 'icon',
		...restProps
	}: ComponentProps<typeof Sidebar.Root> = $props();
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
