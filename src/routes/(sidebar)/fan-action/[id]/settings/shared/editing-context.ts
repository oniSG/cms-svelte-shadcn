import { getContext, setContext } from 'svelte';

/** Toggle manually until real-time "someone else is editing" is wired up. */
export const WORKFLOW_EDITED_BY_OTHER = false;

export const WORKFLOW_CONFIGURE_NODE_KEY = 'workflow-configure-node';
export const WORKFLOW_EDITING_NODE_KEY = 'workflow-editing-node';
export const WORKFLOW_RUNNING_KEY = 'workflow-running';

export type WorkflowConfigureNode = (nodeId: string) => void;
export type WorkflowEditingNodeId = () => string | null;
export type WorkflowRunning = () => boolean;

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

export function setWorkflowRunning(getter: WorkflowRunning) {
	setContext(WORKFLOW_RUNNING_KEY, getter);
}

export function getWorkflowRunning(): WorkflowRunning | undefined {
	return getContext<WorkflowRunning | undefined>(WORKFLOW_RUNNING_KEY);
}
