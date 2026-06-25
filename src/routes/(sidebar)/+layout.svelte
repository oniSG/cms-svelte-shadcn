<script lang="ts">
	import Px from '$lib/components/custom/px.svelte';
	import AppSidebar from '$lib/components/custom/sidebar/sidebar.svelte';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';

	let { children } = $props();
</script>

<Sidebar.Provider>
	<AppSidebar />
	<Sidebar.Inset>
		<Px>
			{@render children()}
			<div class="h-4"></div>
		</Px>
	</Sidebar.Inset>
</Sidebar.Provider>
