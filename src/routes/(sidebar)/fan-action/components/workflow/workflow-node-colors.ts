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

type BoxNodeClasses = {
	tint: string;
	tintEditing: string;
	stroke: string;
};

const workflowNodeBoxClassBySection: Record<WorkflowPaletteSection, BoxNodeClasses> = {
	triggers: {
		tint: 'bg-workflow-trigger/15',
		tintEditing: 'bg-workflow-trigger/45',
		stroke: 'stroke-workflow-trigger'
	},
	operators: {
		tint: 'bg-workflow-operator/15',
		tintEditing: 'bg-workflow-operator/40',
		stroke: 'stroke-workflow-operator'
	},
	actions: {
		tint: 'bg-workflow-action/15',
		tintEditing: 'bg-workflow-action/40',
		stroke: 'stroke-workflow-action'
	}
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

export function workflowNodeBoxClasses(
	itemId: string,
	variant: WorkflowNodeVariant,
	editing = false
): BoxNodeClasses & { tintClass: string } {
	const section = workflowPaletteSection(itemId, variant);
	const classes = workflowNodeBoxClassBySection[section];

	return {
		...classes,
		tintClass: editing ? classes.tintEditing : classes.tint
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
