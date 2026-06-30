export type WorkflowNodeVariant = 'trigger' | 'condition' | 'action';

export type WorkflowNodeData = {
	itemId: string;
	variant: WorkflowNodeVariant;
	incomplete?: boolean;
};

export type WorkflowPaletteItem = {
	id: string;
	variant: WorkflowNodeVariant;
	incomplete?: boolean;
};

export const WORKFLOW_DRAG_MIME = 'application/fan-action-workflow-node';
