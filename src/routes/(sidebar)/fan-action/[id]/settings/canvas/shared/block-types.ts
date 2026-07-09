import type { Component } from 'svelte';
import type { WorkflowNodeVariant } from '../../shared/types';
import type { WorkflowPaletteSection } from '../../shared/node-styles';

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
