<script lang="ts">
	import AppSidebar from '$lib/components/custom/sidebar/sidebar.svelte';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';

	let { children } = $props();
</script>

<Sidebar.Provider>
	<AppSidebar />
	<Sidebar.Inset class="h-svh overflow-hidden">
		<div class="flex min-h-0 flex-1 flex-col overflow-x-hidden overflow-y-auto overscroll-none">
			{@render children()}
		</div>
	</Sidebar.Inset>
</Sidebar.Provider>
