import type { Component } from 'svelte';
import FastForward from '@lucide/svelte/icons/fast-forward';
import Calendar from '@lucide/svelte/icons/calendar';
import Star from '@lucide/svelte/icons/star';
import ShoppingCart from '@lucide/svelte/icons/shopping-cart';
import LogIn from '@lucide/svelte/icons/log-in';
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

export function workflowItemIcon(itemId: string, variant: WorkflowNodeVariant): Component {
	if (itemId === 'run-now') return FastForward;
	if (itemId === 'schedule') return Calendar;
	if (itemId === 'loyalty') return Star;
	if (itemId === 'ticket' || itemId === 'season-ticket') return ShoppingCart;
	if (itemId === 'attended') return LogIn;
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
	variant: WorkflowNodeVariant
): string | undefined {
	if (itemId === 'loyalty') return 'fill-current';
	return undefined;
}
