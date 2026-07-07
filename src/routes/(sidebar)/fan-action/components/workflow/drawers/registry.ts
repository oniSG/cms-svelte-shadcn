import type { Component } from 'svelte';
import type { WorkflowDrawerContentProps } from '../types';
import { workflowBlockDefinition } from '../block-items';
import { actionDrawerRegistry } from './actions/registry';
import { operatorDrawerRegistry } from './operators/registry';
import { triggerDrawerRegistry } from './triggers/registry';
import InfoDrawerContent from './triggers/info.svelte';
import { workflowTriggerDefinition } from '../trigger-items';

const workflowDrawerRegistry: Record<string, Component<WorkflowDrawerContentProps>> = {
	...triggerDrawerRegistry,
	...operatorDrawerRegistry,
	...actionDrawerRegistry
};

export function workflowDrawerContent(
	itemId: string
): Component<WorkflowDrawerContentProps> | null {
	const customDrawer = workflowDrawerRegistry[itemId];
	if (customDrawer) return customDrawer;

	if (workflowTriggerDefinition(itemId) || workflowBlockDefinition(itemId)) {
		return InfoDrawerContent;
	}

	return null;
}
