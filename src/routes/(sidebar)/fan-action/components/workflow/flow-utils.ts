import type { Edge, Node } from '@xyflow/svelte';
import type { WorkflowNodeData } from './types';

function inferConditionSourceHandle(
	sourceNode: Node<WorkflowNodeData>,
	targetNode: Node<WorkflowNodeData>
): 'yes' | 'no' {
	if (targetNode.position.y < sourceNode.position.y) return 'yes';
	if (targetNode.position.y > sourceNode.position.y) return 'no';
	return 'yes';
}

export function normalizeWorkflowEdges(nodes: Node<WorkflowNodeData>[], edges: Edge[]): Edge[] {
	const nodeById = new Map(nodes.map((node) => [node.id, node]));

	return edges.map((edge) => {
		if (edge.sourceHandle) return edge;

		const sourceNode = nodeById.get(edge.source);
		if (sourceNode?.data.variant !== 'condition') return edge;

		const targetNode = nodeById.get(edge.target);
		if (!targetNode) return edge;

		return {
			...edge,
			sourceHandle: inferConditionSourceHandle(sourceNode, targetNode)
		};
	});
}

export function createNodeId() {
	return `node-${crypto.randomUUID().slice(0, 8)}`;
}
