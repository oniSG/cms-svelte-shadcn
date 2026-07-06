import type { Component } from 'svelte';
import type { WorkflowDrawerContentProps } from '../types';
import { actionDrawerRegistry } from './actions/registry';
import { operatorDrawerRegistry } from './operators/registry';
import { triggerDrawerRegistry } from './triggers/registry';
import FallbackDrawerContent from './fallback.svelte';

const workflowDrawerRegistry: Record<string, Component<WorkflowDrawerContentProps>> = {
	...triggerDrawerRegistry,
	...operatorDrawerRegistry,
	...actionDrawerRegistry
};

export function workflowDrawerContent(itemId: string): Component<WorkflowDrawerContentProps> {
	return workflowDrawerRegistry[itemId] ?? FallbackDrawerContent;
}
