import type { Edge, Node } from '@xyflow/svelte';
import type { WorkflowNodeData } from '../components/workflow/types';

export function createInitialFlow(): { nodes: Node<WorkflowNodeData>[]; edges: Edge[] } {
	const nodes: Node<WorkflowNodeData>[] = [
		{
			id: 'trigger-1',
			type: 'workflow',
			position: { x: 40, y: 30 },
			data: { itemId: 'run-now', variant: 'trigger' }
		},
		{
			id: 'condition-1',
			type: 'workflow',
			position: { x: 300, y: 170 },
			data: { itemId: 'condition', variant: 'condition', incomplete: true }
		},
		{
			id: 'condition-2',
			type: 'workflow',
			position: { x: 500, y: 30 },
			data: { itemId: 'condition', variant: 'condition', incomplete: true }
		},
		{
			id: 'condition-3',
			type: 'workflow',
			position: { x: 500, y: 170 },
			data: { itemId: 'condition', variant: 'condition', incomplete: true }
		},
		{
			id: 'condition-4',
			type: 'workflow',
			position: { x: 300, y: 320 },
			data: { itemId: 'condition', variant: 'condition', incomplete: true }
		},
		{
			id: 'action-1',
			type: 'workflow',
			position: { x: 720, y: 30 },
			data: { itemId: 'email', variant: 'action', incomplete: true }
		},
		{
			id: 'action-2',
			type: 'workflow',
			position: { x: 720, y: 170 },
			data: { itemId: 'email', variant: 'action', incomplete: true }
		},
		{
			id: 'action-3',
			type: 'workflow',
			position: { x: 720, y: 320 },
			data: { itemId: 'email', variant: 'action', incomplete: true }
		}
	];

	const edges: Edge[] = [
		{ id: 'e-trigger-condition-1', source: 'trigger-1', target: 'condition-1', type: 'workflow' },
		{
			id: 'e-condition-1-condition-4',
			source: 'condition-1',
			sourceHandle: 'no',
			target: 'condition-4',
			type: 'workflow'
		},
		{
			id: 'e-condition-2-action-1',
			source: 'condition-2',
			sourceHandle: 'yes',
			target: 'action-1',
			type: 'workflow'
		},
		{
			id: 'e-condition-3-action-2',
			source: 'condition-3',
			sourceHandle: 'yes',
			target: 'action-2',
			type: 'workflow'
		},
		{
			id: 'e-condition-4-action-3',
			source: 'condition-4',
			sourceHandle: 'yes',
			target: 'action-3',
			type: 'workflow'
		}
	];

	return { nodes, edges };
}
