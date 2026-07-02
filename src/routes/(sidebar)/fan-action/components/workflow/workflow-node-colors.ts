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

type BoxNodeClasses = {
	tint: string;
	tintEditing: string;
	stroke: string;
};

const workflowNodeBoxClassBySection: Record<WorkflowPaletteSection, BoxNodeClasses> = {
	triggers: {
		tint: 'bg-[oklch(0.623_0.214_250)]/15',
		tintEditing: 'bg-[oklch(0.623_0.214_250)]/45',
		stroke: 'stroke-[oklch(0.623_0.214_250)]'
	},
	operators: {
		tint: 'bg-[oklch(0.705_0.191_55)]/15',
		tintEditing: 'bg-[oklch(0.705_0.191_55)]/40',
		stroke: 'stroke-[oklch(0.705_0.191_55)]'
	},
	actions: {
		tint: 'bg-[oklch(0.723_0.219_149.579)]/15',
		tintEditing: 'bg-[oklch(0.723_0.219_149.579)]/40',
		stroke: 'stroke-[oklch(0.723_0.219_149.579)]'
	}
};

/** Literal oklch for trigger SVG fills — same hues as chart-3/1/9. */
const workflowTriggerSvgColor = 'oklch(0.623 0.214 250)';

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
		tintFill: workflowTriggerSvgColor,
		tintOpacity: editing ? 0.45 : 0.15,
		stroke: workflowTriggerSvgColor
	};
}

export function workflowNodeIconClass(itemId: string, variant: WorkflowNodeVariant): string {
	const section = workflowPaletteSection(itemId, variant);
	if (section === 'triggers') return 'text-[oklch(0.623_0.214_250)]';
	if (section === 'operators') return 'text-[oklch(0.705_0.191_55)]';
	return 'text-[oklch(0.723_0.219_149.579)]';
}

export const workflowNodeChartColors = {
	conditionYesPort: '!bg-chart-1 !border-chart-1',
	conditionNoPort: '!bg-chart-8 !border-chart-8'
} as const;
