import type { Component } from 'svelte';

export type WorkflowTriggerCategory =
	| 'common'
	| 'time'
	| 'ticketing'
	| 'eshop'
	| 'call-center'
	| 'mobile-app'
	| 'other';

export type WorkflowTriggerDefinition = {
	id: string;
	icon: Component;
	iconModifier?: string;
	label: () => string;
	description: () => string;
	drawerTitle?: () => string;
	incomplete?: boolean;
	category: WorkflowTriggerCategory;
};
