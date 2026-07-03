import type { Component } from 'svelte';
import type { WorkflowDrawerContentProps } from '../types';
import EmailDrawerContent from './email.svelte';
import SmsDrawerContent from './sms.svelte';
import PushDrawerContent from './push.svelte';
import FallbackDrawerContent from './fallback.svelte';

export const workflowDrawerRegistry: Record<string, Component<WorkflowDrawerContentProps>> = {
	email: EmailDrawerContent,
	sms: SmsDrawerContent,
	push: PushDrawerContent
};

export function workflowDrawerContent(itemId: string): Component<WorkflowDrawerContentProps> {
	return workflowDrawerRegistry[itemId] ?? FallbackDrawerContent;
}
