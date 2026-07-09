export type FanActionWorkflowNodeData = {
	itemId: string;
	variant: 'trigger' | 'condition' | 'action';
	incomplete?: boolean;
	config?: Record<string, unknown>;
};

export type FanActionWorkflowNode = {
	id: string;
	type: string;
	position: { x: number; y: number };
	data: FanActionWorkflowNodeData;
};

export type FanActionWorkflowEdge = {
	id: string;
	source: string;
	target: string;
	type?: string;
	sourceHandle?: string;
	targetHandle?: string;
};

export type FanActionWorkflow = {
	nodes: FanActionWorkflowNode[];
	edges: FanActionWorkflowEdge[];
};
