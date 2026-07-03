<script lang="ts">
	import type { WorkflowDrawerContentProps } from '../types';

	let { data }: WorkflowDrawerContentProps = $props();
</script>

<p class="text-sm text-muted-foreground">
	Settings for <span class="font-medium text-foreground">{data.itemId}</span> will go here.
</p>
