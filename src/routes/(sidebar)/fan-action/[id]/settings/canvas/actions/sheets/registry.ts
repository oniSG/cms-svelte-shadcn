import type { Component } from 'svelte';
import type { WorkflowDrawerContentProps } from '../../../shared/types';
import EmailSheetContent from './email.svelte';
import SmsSheetContent from './sms.svelte';
import PushSheetContent from './push.svelte';
import TagSheetContent from './tag.svelte';
import RemoveTagSheetContent from './remove-tag.svelte';
import CustomAttributeSheetContent from './custom-attribute.svelte';
import RewardConversionSheetContent from './reward-conversion.svelte';

export const actionSheetRegistry: Record<string, Component<WorkflowDrawerContentProps>> = {
	email: EmailSheetContent,
	sms: SmsSheetContent,
	push: PushSheetContent,
	tag: TagSheetContent,
	'remove-tag': RemoveTagSheetContent,
	'custom-attribute': CustomAttributeSheetContent,
	'reward-conversion': RewardConversionSheetContent
};
