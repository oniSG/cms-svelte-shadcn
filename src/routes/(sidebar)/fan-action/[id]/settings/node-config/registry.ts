import type { Component } from 'svelte';
import type { WorkflowDrawerContentProps } from '../shared/types';
import { actionBlockDefinition } from '../canvas/actions/data';
import { operatorBlockDefinition } from '../canvas/operators/data';
import { workflowTriggerDefinition } from '../canvas/triggers/data';
import { actionSheetRegistry } from '../canvas/actions/sheets/registry';
import { operatorSheetRegistry } from '../canvas/operators/sheets/registry';
import { triggerSheetRegistry } from '../canvas/triggers/sheets/registry';
import InfoSheetContent from '../canvas/triggers/sheets/info.svelte';

const workflowSheetRegistry: Record<string, Component<WorkflowDrawerContentProps>> = {
	...triggerSheetRegistry,
	...operatorSheetRegistry,
	...actionSheetRegistry
};

export function workflowDrawerContent(
	itemId: string
): Component<WorkflowDrawerContentProps> | null {
	const customSheet = workflowSheetRegistry[itemId];
	if (customSheet) return customSheet;

	if (
		workflowTriggerDefinition(itemId) ||
		operatorBlockDefinition(itemId) ||
		actionBlockDefinition(itemId)
	) {
		return InfoSheetContent;
	}

	return null;
}
