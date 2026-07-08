<script lang="ts">
	import { EdgeLabel } from '@xyflow/svelte';
	import X from '@lucide/svelte/icons/x';
	import UserIcon from '@lucide/svelte/icons/user';
	import { Button } from '$lib/components/ui/button';
	import * as ButtonGroup from '$lib/components/ui/button-group';
	import type { WorkflowConditionBranch } from '../../../shared/condition-branch-styles';
	import { workflowConditionBranchStyles } from '../../../shared/condition-branch-styles';

	let {
		labelX,
		labelY,
		branchStyle,
		onDelete
	}: {
		labelX: number;
		labelY: number;
		branchStyle: (typeof workflowConditionBranchStyles)[WorkflowConditionBranch] | null;
		onDelete: (event: MouseEvent) => void;
	} = $props();
</script>

<EdgeLabel x={labelX} y={labelY} transparent class="workflow-edge-label relative z-10 !p-0">
	<ButtonGroup.Root class="overflow-hidden rounded-4xl bg-workflow-canvas-base">
		<Button variant="outline" size="sm" class={branchStyle?.button}>
			<UserIcon />
			225
		</Button>
		<Button variant="outline" size="icon-sm" aria-label="Delete connection" onclick={onDelete}>
			<X />
		</Button>
	</ButtonGroup.Root>
</EdgeLabel>
