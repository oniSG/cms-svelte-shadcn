export type WorkflowNodeVariant = 'trigger' | 'condition' | 'action';

export type WorkflowNodeData = {
	label: string;
	variant: WorkflowNodeVariant;
	incomplete?: boolean;
};

export type WorkflowPaletteItem = {
	id: string;
	label: string;
	variant: WorkflowNodeVariant;
	incomplete?: boolean;
};

export const WORKFLOW_DRAG_MIME = 'application/fan-action-workflow-node';
