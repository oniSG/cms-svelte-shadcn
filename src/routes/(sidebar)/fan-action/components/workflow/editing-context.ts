import { getContext, setContext } from 'svelte';

export const WORKFLOW_CONFIGURE_NODE_KEY = 'workflow-configure-node';
export const WORKFLOW_EDITING_NODE_KEY = 'workflow-editing-node';
export const WORKFLOW_SCENARIO_ACTIVE_KEY = 'workflow-scenario-active';

export type WorkflowConfigureNode = (nodeId: string) => void;
export type WorkflowEditingNodeId = () => string | null;
export type WorkflowScenarioActive = () => boolean;

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

export function setWorkflowScenarioActive(getter: WorkflowScenarioActive) {
	setContext(WORKFLOW_SCENARIO_ACTIVE_KEY, getter);
}

export function getWorkflowScenarioActive(): WorkflowScenarioActive | undefined {
	return getContext<WorkflowScenarioActive | undefined>(WORKFLOW_SCENARIO_ACTIVE_KEY);
}
