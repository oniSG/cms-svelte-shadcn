import type { WorkflowNodeVariant } from './workflow-types';

export type WorkflowPaletteSection = 'triggers' | 'operators' | 'actions';

const operatorItemIds = new Set(['condition', 'wait', 'ab-test', 'end-branch']);

export function workflowPaletteSection(
	itemId: string,
	variant: WorkflowNodeVariant
): WorkflowPaletteSection {
	if (variant === 'trigger') return 'triggers';
	if (variant === 'condition' || operatorItemIds.has(itemId)) return 'operators';
	return 'actions';
}

/** Solid icon backgrounds in the palette sidebar. */
export const workflowPaletteSectionBgClass: Record<WorkflowPaletteSection, string> = {
	triggers: 'bg-chart-3',
	operators: 'bg-chart-9/85',
	actions: 'bg-chart-1/85'
};

/** Bordered node surfaces on the canvas. */
const workflowNodeSurfaceClassBySection: Record<WorkflowPaletteSection, string> = {
	triggers: '',
	operators: 'border-2 border-chart-9 bg-chart-9/15',
	actions: 'border-2 border-chart-1 bg-chart-1/15'
};

const workflowNodeEditingSurfaceClassBySection: Record<WorkflowPaletteSection, string> = {
	triggers: '',
	operators: 'border-2 border-chart-9 bg-chart-9/40',
	actions: 'border-2 border-chart-1 bg-chart-1/40'
};

const workflowNodeIconClassBySection: Record<WorkflowPaletteSection, string> = {
	triggers: 'text-chart-3',
	operators: 'text-chart-9',
	actions: 'text-chart-1'
};

export function workflowNodeSurfaceClass(
	itemId: string,
	variant: WorkflowNodeVariant,
	editing = false
): string {
	const section = workflowPaletteSection(itemId, variant);
	return editing
		? workflowNodeEditingSurfaceClassBySection[section]
		: workflowNodeSurfaceClassBySection[section];
}

export function workflowNodeIconClass(itemId: string, variant: WorkflowNodeVariant): string {
	return workflowNodeIconClassBySection[workflowPaletteSection(itemId, variant)];
}

export const workflowNodeChartColors = {
	triggerSvgFill: 'fill-chart-3/15',
	triggerSvgFillEditing: 'fill-chart-3/45',
	triggerSvgStroke: 'stroke-chart-3',
	conditionYesPort: '!bg-chart-1 !border-chart-1',
	conditionNoPort: '!bg-chart-8 !border-chart-8'
} as const;
