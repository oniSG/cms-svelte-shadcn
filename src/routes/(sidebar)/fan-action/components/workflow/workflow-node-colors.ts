import type { WorkflowNodeVariant } from './workflow-types';

type WorkflowNodeColorSet = {
	surface: string;
	icon: string;
};

export const workflowNodeChartColors: Record<WorkflowNodeVariant, WorkflowNodeColorSet> & {
	conditionYesPort: string;
	conditionNoPort: string;
	triggerSvgFill: string;
	triggerSvgStroke: string;
} = {
	trigger: {
		surface: '',
		icon: 'text-chart-3'
	},
	condition: {
		surface: 'border-2 border-chart-9 bg-chart-9/15',
		icon: 'text-chart-9'
	},
	action: {
		surface: 'border-2 border-chart-1 bg-chart-1/15',
		icon: 'text-chart-1'
	},
	triggerSvgFill: 'fill-chart-3/15',
	triggerSvgStroke: 'stroke-chart-3',
	conditionYesPort: '!bg-chart-1 !border-chart-1',
	conditionNoPort: '!bg-chart-8 !border-chart-8'
};
