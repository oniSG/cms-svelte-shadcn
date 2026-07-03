import type { Component } from 'svelte';
import GitFork from '@lucide/svelte/icons/git-fork';
import Mail from '@lucide/svelte/icons/mail';
import MessageSquare from '@lucide/svelte/icons/message-square';
import Smartphone from '@lucide/svelte/icons/smartphone';
import Clock from '@lucide/svelte/icons/clock';
import Tag from '@lucide/svelte/icons/tag';
import TagX from '@lucide/svelte/icons/tag-x';
import Gauge from '@lucide/svelte/icons/gauge';
import List from '@lucide/svelte/icons/list';
import Gift from '@lucide/svelte/icons/gift';
import X from '@lucide/svelte/icons/x';
import type { WorkflowNodeVariant } from './types';
import { workflowTriggerDefinition } from './trigger-items';

export function workflowItemIcon(itemId: string, variant: WorkflowNodeVariant): Component {
	const trigger = workflowTriggerDefinition(itemId);
	if (trigger) return trigger.icon;
	if (variant === 'condition' || itemId === 'condition') return GitFork;
	if (itemId === 'sms') return MessageSquare;
	if (itemId === 'push') return Smartphone;
	if (itemId === 'wait') return Clock;
	if (itemId === 'tag') return Tag;
	if (itemId === 'remove-tag') return TagX;
	if (itemId === 'ab-test') return Gauge;
	if (itemId === 'custom-attribute') return List;
	if (itemId === 'reward-conversion') return Gift;
	if (itemId === 'end-branch') return X;
	return Mail;
}

export function workflowItemIconModifier(
	itemId: string,
	_variant: WorkflowNodeVariant
): string | undefined {
	return workflowTriggerDefinition(itemId)?.iconModifier;
}
