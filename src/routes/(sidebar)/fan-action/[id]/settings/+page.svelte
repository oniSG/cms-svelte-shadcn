<script lang="ts">
	import { type Edge, type Node } from '@xyflow/svelte';
	import WorkflowBuilder from '../../components/workflow/workflow-builder.svelte';
	import { createInitialFlow } from '../../components/workflow/workflow-data';
	import type { WorkflowNodeData } from '../../components/workflow/workflow-types';

	const initialFlow = createInitialFlow();

	let nodes = $state.raw<Node<WorkflowNodeData>[]>(initialFlow.nodes);
	let edges = $state.raw<Edge[]>(initialFlow.edges);
</script>

<WorkflowBuilder bind:nodes bind:edges />
