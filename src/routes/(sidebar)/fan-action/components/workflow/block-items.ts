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
import type { WorkflowPaletteSection } from './node-styles';
import * as m from '$lib/paraglide/messages.js';

export type WorkflowBlockDefinition = {
	id: string;
	variant: WorkflowNodeVariant;
	paletteSection: Exclude<WorkflowPaletteSection, 'triggers'>;
	icon: Component;
	label: () => string;
	description: () => string;
	drawerTitle?: () => string;
	incomplete?: boolean;
};

export const workflowBlockDefinitions: WorkflowBlockDefinition[] = [
	{
		id: 'condition',
		variant: 'condition',
		paletteSection: 'operators',
		icon: GitFork,
		label: m.fan_action_flow_condition_add,
		description: m.fan_action_flow_condition_add_desc,
		drawerTitle: m.fan_action_flow_condition,
		incomplete: true
	},
	{
		id: 'wait',
		variant: 'action',
		paletteSection: 'operators',
		icon: Clock,
		label: m.fan_action_flow_action_wait,
		description: m.fan_action_flow_action_wait_desc,
		drawerTitle: m.fan_action_flow_wait_title,
		incomplete: true
	},
	{
		id: 'ab-test',
		variant: 'action',
		paletteSection: 'operators',
		icon: Gauge,
		label: m.fan_action_flow_action_ab_test,
		description: m.fan_action_flow_action_ab_test_desc,
		incomplete: true
	},
	{
		id: 'end-branch',
		variant: 'action',
		paletteSection: 'operators',
		icon: X,
		label: m.fan_action_flow_action_end_branch,
		description: m.fan_action_flow_action_end_branch_desc,
		incomplete: true
	},
	{
		id: 'email',
		variant: 'action',
		paletteSection: 'actions',
		icon: Mail,
		label: m.fan_action_flow_action_email,
		description: m.fan_action_flow_action_email_desc,
		incomplete: true
	},
	{
		id: 'sms',
		variant: 'action',
		paletteSection: 'actions',
		icon: MessageSquare,
		label: m.fan_action_flow_action_sms,
		description: m.fan_action_flow_action_sms_desc,
		incomplete: true
	},
	{
		id: 'push',
		variant: 'action',
		paletteSection: 'actions',
		icon: Smartphone,
		label: m.fan_action_flow_action_push,
		description: m.fan_action_flow_action_push_desc,
		incomplete: true
	},
	{
		id: 'tag',
		variant: 'action',
		paletteSection: 'actions',
		icon: Tag,
		label: m.fan_action_flow_action_tag,
		description: m.fan_action_flow_action_tag_desc,
		drawerTitle: m.fan_action_flow_tag_title,
		incomplete: true
	},
	{
		id: 'remove-tag',
		variant: 'action',
		paletteSection: 'actions',
		icon: TagX,
		label: m.fan_action_flow_action_remove_tag,
		description: m.fan_action_flow_action_remove_tag_desc,
		drawerTitle: m.fan_action_flow_tag_title,
		incomplete: true
	},
	{
		id: 'custom-attribute',
		variant: 'action',
		paletteSection: 'actions',
		icon: List,
		label: m.fan_action_flow_action_custom_attribute,
		description: m.fan_action_flow_action_custom_attribute_desc,
		drawerTitle: m.fan_action_flow_custom_attribute_title,
		incomplete: true
	},
	{
		id: 'reward-conversion',
		variant: 'action',
		paletteSection: 'actions',
		icon: Gift,
		label: m.fan_action_flow_action_reward_conversion,
		description: m.fan_action_flow_action_reward_conversion_desc,
		drawerTitle: m.fan_action_flow_reward_conversion_title,
		incomplete: true
	}
];

const blockById = new Map(workflowBlockDefinitions.map((block) => [block.id, block]));

export function workflowBlockDefinition(itemId: string): WorkflowBlockDefinition | undefined {
	return blockById.get(itemId);
}

export const workflowOperatorItemIds = new Set(
	workflowBlockDefinitions
		.filter((block) => block.paletteSection === 'operators')
		.map((block) => block.id)
);
