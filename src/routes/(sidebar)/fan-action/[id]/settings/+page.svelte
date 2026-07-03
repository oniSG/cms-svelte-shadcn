<script lang="ts">
	import { page } from '$app/state';
	import WorkflowBuilder from '../../components/workflow/builder.svelte';
	import { data } from '../../data.js';

	const actionId = $derived(Number(page.params.id));
	const action = $derived(data.find((item) => item.id === actionId) ?? null);
</script>

<WorkflowBuilder {action} />
