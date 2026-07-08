import type { Component } from 'svelte';
import type { WorkflowNodeVariant } from '../../../../components/workflow/types';
import type { WorkflowPaletteSection } from '../../../../components/workflow/node-styles';

export type WorkflowBlockDefinition = {
	id: string;
	variant: WorkflowNodeVariant;
	paletteSection: Exclude<WorkflowPaletteSection, 'triggers'>;
	icon: Component;
	label: () => string;
	description: () => string;
	drawerTitle?: () => string;
	incomplete?: boolean;
};
