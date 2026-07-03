import type { Component } from 'svelte';
import type { WorkflowDrawerContentProps } from '../types';
import EmailDrawerContent from './email.svelte';
import SmsDrawerContent from './sms.svelte';
import PushDrawerContent from './push.svelte';
import ConditionDrawerContent from './condition.svelte';
import WaitDrawerContent from './wait.svelte';
import RewardConversionDrawerContent from './reward-conversion.svelte';
import TagDrawerContent from './tag.svelte';
import RemoveTagDrawerContent from './remove-tag.svelte';
import CustomAttributeDrawerContent from './custom-attribute.svelte';
import FallbackDrawerContent from './fallback.svelte';

export const workflowDrawerRegistry: Record<string, Component<WorkflowDrawerContentProps>> = {
	email: EmailDrawerContent,
	sms: SmsDrawerContent,
	push: PushDrawerContent,
	condition: ConditionDrawerContent,
	wait: WaitDrawerContent,
	tag: TagDrawerContent,
	'remove-tag': RemoveTagDrawerContent,
	'custom-attribute': CustomAttributeDrawerContent,
	'reward-conversion': RewardConversionDrawerContent
};

export function workflowDrawerContent(itemId: string): Component<WorkflowDrawerContentProps> {
	return workflowDrawerRegistry[itemId] ?? FallbackDrawerContent;
}
