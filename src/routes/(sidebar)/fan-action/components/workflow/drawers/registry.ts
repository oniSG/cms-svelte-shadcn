import type { Component } from 'svelte';
import type { WorkflowDrawerContentProps } from '../workflow-drawer-types';
import EmailDrawerContent from './email-drawer-content.svelte';
import FallbackDrawerContent from './fallback-drawer-content.svelte';

export const workflowDrawerRegistry: Record<string, Component<WorkflowDrawerContentProps>> = {
	email: EmailDrawerContent
};

export function workflowDrawerContent(itemId: string): Component<WorkflowDrawerContentProps> {
	return workflowDrawerRegistry[itemId] ?? FallbackDrawerContent;
}
