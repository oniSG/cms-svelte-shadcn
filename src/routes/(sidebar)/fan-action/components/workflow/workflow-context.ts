import { getContext, setContext } from 'svelte';

export const WORKFLOW_CONFIGURE_NODE_KEY = 'workflow-configure-node';
export const WORKFLOW_EDITING_NODE_KEY = 'workflow-editing-node';

export type WorkflowConfigureNode = (nodeId: string) => void;

export type WorkflowEditingNode = {
	nodeId: string | null;
};

export function setWorkflowConfigureNode(fn: WorkflowConfigureNode) {
	setContext(WORKFLOW_CONFIGURE_NODE_KEY, fn);
}

export function getWorkflowConfigureNode(): WorkflowConfigureNode | undefined {
	return getContext<WorkflowConfigureNode | undefined>(WORKFLOW_CONFIGURE_NODE_KEY);
}

export function setWorkflowEditingNode(state: WorkflowEditingNode) {
	setContext(WORKFLOW_EDITING_NODE_KEY, state);
}

export function getWorkflowEditingNode(): WorkflowEditingNode | undefined {
	return getContext<WorkflowEditingNode | undefined>(WORKFLOW_EDITING_NODE_KEY);
}
