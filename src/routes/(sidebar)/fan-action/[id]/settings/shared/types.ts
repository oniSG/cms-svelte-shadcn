export type WorkflowNodeVariant = 'trigger' | 'condition' | 'action';

export type WorkflowNodeData = {
	itemId: string;
	variant: WorkflowNodeVariant;
	incomplete?: boolean;
	config?: Record<string, unknown>;
};

export type WorkflowPaletteItem = {
	id: string;
	variant: WorkflowNodeVariant;
	incomplete?: boolean;
};

export const WORKFLOW_DRAG_MIME = 'application/fan-action-workflow-node';

export type SyncNodeConfig = (nodeId: string, config: Record<string, unknown>) => void;

export type WorkflowDrawerContentProps = {
	actionId?: number;
	nodeId: string;
	data: WorkflowNodeData;
	syncNodeConfig?: (nodeId: string, config: Record<string, unknown>) => void;
};
