import { getContext, setContext } from 'svelte';

export const WORKFLOW_CONFIGURE_NODE_KEY = 'workflow-configure-node';

export type WorkflowConfigureNode = (nodeId: string) => void;

export function setWorkflowConfigureNode(fn: WorkflowConfigureNode) {
	setContext(WORKFLOW_CONFIGURE_NODE_KEY, fn);
}

export function getWorkflowConfigureNode(): WorkflowConfigureNode | undefined {
	return getContext<WorkflowConfigureNode | undefined>(WORKFLOW_CONFIGURE_NODE_KEY);
}
