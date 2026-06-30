<script lang="ts">
	import { browser } from '$app/environment';
	import { SvelteFlowProvider, type Edge, type Node } from '@xyflow/svelte';
	import '@xyflow/svelte/dist/style.css';
	import WorkflowCanvas from './workflow-canvas.svelte';
	import WorkflowToolbar from './workflow-toolbar.svelte';
	import WorkflowSidebar from './workflow-sidebar.svelte';
	import { createInitialFlow } from './workflow-data';
	import type { WorkflowNodeData } from './workflow-types';

	const initialFlow = createInitialFlow();

	let {
		nodes = $bindable(initialFlow.nodes),
		edges = $bindable(initialFlow.edges),
		scriptStopped = $bindable(true),
		testingStopped = $bindable(true),
		sidebarTab = $bindable('triggers')
	}: {
		nodes?: Node<WorkflowNodeData>[];
		edges?: Edge[];
		scriptStopped?: boolean;
		testingStopped?: boolean;
		sidebarTab?: string;
	} = $props();

	const overlayPanelClass =
		'overflow-hidden rounded-xl border bg-background/95 shadow-lg backdrop-blur-sm supports-backdrop-filter:bg-background/80';

	function handleSave() {
		scriptStopped = true;
		testingStopped = true;
	}
</script>

{#if browser}
	<SvelteFlowProvider>
		<div class="relative h-full w-full overflow-hidden">
			<WorkflowCanvas bind:nodes bind:edges />

			<div class="pointer-events-none absolute inset-0 z-20 p-3">
				<div
					class="pointer-events-auto absolute top-3 right-[calc(18rem+1.5rem)] left-3 {overlayPanelClass}"
				>
					<WorkflowToolbar bind:scriptStopped bind:testingStopped onSave={handleSave} />
				</div>

				<div class="pointer-events-auto absolute top-3 right-3 bottom-3 w-72 {overlayPanelClass}">
					<WorkflowSidebar bind:activeTab={sidebarTab} />
				</div>
			</div>
		</div>
	</SvelteFlowProvider>
{:else}
	<div class="relative h-full w-full bg-muted/20"></div>
{/if}
