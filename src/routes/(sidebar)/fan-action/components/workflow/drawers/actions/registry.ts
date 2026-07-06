import type { Component } from 'svelte';
import type { WorkflowDrawerContentProps } from '../../types';
import EmailDrawerContent from './email.svelte';
import SmsDrawerContent from './sms.svelte';
import PushDrawerContent from './push.svelte';
import TagDrawerContent from './tag.svelte';
import RemoveTagDrawerContent from './remove-tag.svelte';
import CustomAttributeDrawerContent from './custom-attribute.svelte';
import RewardConversionDrawerContent from './reward-conversion.svelte';

export const actionDrawerRegistry: Record<string, Component<WorkflowDrawerContentProps>> = {
	email: EmailDrawerContent,
	sms: SmsDrawerContent,
	push: PushDrawerContent,
	tag: TagDrawerContent,
	'remove-tag': RemoveTagDrawerContent,
	'custom-attribute': CustomAttributeDrawerContent,
	'reward-conversion': RewardConversionDrawerContent
};
