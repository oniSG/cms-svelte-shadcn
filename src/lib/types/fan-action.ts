import type { FanActionWorkflow } from './fan-action-workflow.js';

export type {
	FanActionWorkflow,
	FanActionWorkflowNode,
	FanActionWorkflowEdge
} from './fan-action-workflow.js';

export type FanAction = {
	id: number;
	event: string;
	tags: string[];
	description: string;
	created_at: Date;
	created_by: string;
	active: boolean;
	transactionActions: boolean;
	automaticStop: boolean;
	plannedRunOut: boolean;
	workflow: FanActionWorkflow;
};
