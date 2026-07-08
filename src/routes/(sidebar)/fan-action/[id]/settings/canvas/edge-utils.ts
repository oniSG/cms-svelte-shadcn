import type { Node } from '@xyflow/svelte';
import type { WorkflowNodeData } from '../shared/types';

export function getWorkflowConditionBranch(
	source: string,
	sourceHandleId: string | null | undefined,
	getNode: (id: string) => Node | undefined
): 'yes' | 'no' | null {
	const sourceNode = getNode(source) as Node<WorkflowNodeData> | undefined;
	if (sourceNode?.data.variant !== 'condition') return null;

	if (sourceHandleId === 'yes') return 'yes';
	if (sourceHandleId === 'no') return 'no';
	return null;
}

export const workflowEdgeStrokeWidth = 1.5;

export function buildWorkflowEdgeStyle(
	style: string | undefined,
	branchStroke: string | undefined
): string {
	return [
		style,
		`stroke-width: ${workflowEdgeStrokeWidth}`,
		branchStroke ? `stroke: ${branchStroke}` : null
	]
		.filter(Boolean)
		.join('; ');
}
