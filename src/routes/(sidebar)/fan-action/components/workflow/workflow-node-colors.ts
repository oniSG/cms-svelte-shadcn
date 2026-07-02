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
	triggers: 'bg-workflow-trigger',
	operators: 'bg-workflow-operator/85',
	actions: 'bg-workflow-action/85'
};

const workflowColorVarBySection: Record<WorkflowPaletteSection, string> = {
	triggers: 'var(--workflow-color-trigger)',
	operators: 'var(--workflow-color-operator)',
	actions: 'var(--workflow-color-action)'
};

const workflowIconClassBySection: Record<WorkflowPaletteSection, string> = {
	triggers: 'text-workflow-trigger',
	operators: 'text-workflow-operator',
	actions: 'text-workflow-action'
};

export type TriggerShapeStyles = {
	backgroundFill: string;
	tintFill: string;
	tintOpacity: number;
	stroke: string;
};

export const workflowNodeEditingBorderClass = 'workflow-node-editing-border';

export function workflowNodeBoxShapeStyles(
	itemId: string,
	variant: WorkflowNodeVariant,
	editing = false
): TriggerShapeStyles {
	const section = workflowPaletteSection(itemId, variant);
	const opacity = editing ? (section === 'triggers' ? 0.45 : 0.4) : 0.15;

	return {
		backgroundFill: 'var(--background)',
		tintFill: workflowColorVarBySection[section],
		tintOpacity: opacity,
		stroke: workflowColorVarBySection[section]
	};
}

export const workflowNodeStroke = 2.5;

export const workflowConditionNodeBox = {
	size: 70,
	radius: 8,
	stroke: workflowNodeStroke
} as const;

export function workflowConditionNodeBounds(size: number = workflowConditionNodeBox.size): number {
	return Math.ceil(size * Math.SQRT2);
}
export const workflowActionNodeBox = { size: 80, radius: 10, stroke: workflowNodeStroke } as const;
export const workflowTriggerNodeBox = {
	height: 70,
	width: 95,
	stroke: workflowNodeStroke
} as const;

export function workflowNodeBoxRect(size: number, stroke: number) {
	const inset = stroke / 2;
	return {
		x: inset,
		y: inset,
		width: size - stroke,
		height: size - stroke
	};
}

export function workflowTriggerShapeStyles(editing = false): TriggerShapeStyles {
	return {
		backgroundFill: 'var(--background)',
		tintFill: workflowColorVarBySection.triggers,
		tintOpacity: editing ? 0.45 : 0.15,
		stroke: workflowColorVarBySection.triggers
	};
}

export function workflowNodeIconClass(itemId: string, variant: WorkflowNodeVariant): string {
	return workflowIconClassBySection[workflowPaletteSection(itemId, variant)];
}

export const workflowNodeChartColors = {
	conditionYesPort: '!bg-chart-1 !border-chart-1',
	conditionNoPort: '!bg-chart-8 !border-chart-8'
} as const;
