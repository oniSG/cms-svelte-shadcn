<script lang="ts">
	import { browser } from '$app/environment';
	import { SvelteFlowProvider, type Edge, type Node } from '@xyflow/svelte';
	import '@xyflow/svelte/dist/style.css';
	import WorkflowCanvas from './workflow-canvas.svelte';
	import WorkflowToolbar from './workflow-toolbar.svelte';
	import WorkflowSidebar from './workflow-sidebar.svelte';
	import { createInitialFlow } from './workflow-data';
	import type { WorkflowNodeData } from './workflow-types';
	import * as m from '$lib/paraglide/messages.js';

	const initial = createInitialFlow({
		runNow: m.fan_action_flow_trigger_run_now(),
		condition: m.fan_action_flow_condition(),
		sendEmail: m.fan_action_flow_action_email()
	});

	let nodes = $state.raw<Node<WorkflowNodeData>[]>(initial.nodes);
	let edges = $state.raw<Edge[]>(initial.edges);
	let scriptStopped = $state(true);
	let testingStopped = $state(true);
	let sidebarTab = $state('triggers');

	function handleSave() {
		scriptStopped = true;
		testingStopped = true;
	}
</script>

{#if browser}
	<SvelteFlowProvider>
		<div class="overflow-hidden rounded-lg border bg-background">
			<WorkflowToolbar bind:scriptStopped bind:testingStopped onSave={handleSave} />

			<div class="flex min-h-[640px]">
				<WorkflowCanvas bind:nodes bind:edges />
				<WorkflowSidebar bind:activeTab={sidebarTab} />
			</div>
		</div>
	</SvelteFlowProvider>
{:else}
	<div class="min-h-[640px] rounded-lg border bg-muted/20"></div>
{/if}
