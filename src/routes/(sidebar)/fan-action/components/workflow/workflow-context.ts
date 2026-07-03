import { getContext, setContext } from 'svelte';

export const WORKFLOW_CONFIGURE_NODE_KEY = 'workflow-configure-node';
export const WORKFLOW_EDITING_NODE_KEY = 'workflow-editing-node';

export type WorkflowConfigureNode = (nodeId: string) => void;
export type WorkflowEditingNodeId = () => string | null;

export function setWorkflowConfigureNode(fn: WorkflowConfigureNode) {
	setContext(WORKFLOW_CONFIGURE_NODE_KEY, fn);
}

export function getWorkflowConfigureNode(): WorkflowConfigureNode | undefined {
	return getContext<WorkflowConfigureNode | undefined>(WORKFLOW_CONFIGURE_NODE_KEY);
}

export function setWorkflowEditingNodeId(getter: WorkflowEditingNodeId) {
	setContext(WORKFLOW_EDITING_NODE_KEY, getter);
}

export function getWorkflowEditingNodeId(): WorkflowEditingNodeId | undefined {
	return getContext<WorkflowEditingNodeId | undefined>(WORKFLOW_EDITING_NODE_KEY);
}
