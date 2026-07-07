import type { Component } from 'svelte';
import type { WorkflowDrawerContentProps } from '../types';
import { actionDrawerRegistry } from './actions/registry';
import { operatorDrawerRegistry } from './operators/registry';
import { triggerDrawerRegistry } from './triggers/registry';
import TriggerInfoDrawerContent from './triggers/info.svelte';
import FallbackDrawerContent from './fallback.svelte';
import { workflowTriggerDefinition } from '../trigger-items';

const workflowDrawerRegistry: Record<string, Component<WorkflowDrawerContentProps>> = {
	...triggerDrawerRegistry,
	...operatorDrawerRegistry,
	...actionDrawerRegistry
};

export function workflowDrawerContent(itemId: string): Component<WorkflowDrawerContentProps> {
	const customDrawer = workflowDrawerRegistry[itemId];
	if (customDrawer) return customDrawer;
	if (workflowTriggerDefinition(itemId)) return TriggerInfoDrawerContent;
	return FallbackDrawerContent;
}
