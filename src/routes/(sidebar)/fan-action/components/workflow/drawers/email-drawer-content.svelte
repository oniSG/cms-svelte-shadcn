<script lang="ts">
	import type { WorkflowDrawerContentProps } from '../workflow-drawer-types';

	let { data }: WorkflowDrawerContentProps = $props();
</script>

<p class="text-sm text-muted-foreground">
	E-mail settings for <span class="font-medium text-foreground">{data.itemId}</span> will go here.
</p>
