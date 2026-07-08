import Mail from '@lucide/svelte/icons/mail';
import MessageSquare from '@lucide/svelte/icons/message-square';
import Smartphone from '@lucide/svelte/icons/smartphone';
import Tag from '@lucide/svelte/icons/tag';
import TagX from '@lucide/svelte/icons/tag-x';
import List from '@lucide/svelte/icons/list';
import Gift from '@lucide/svelte/icons/gift';
import * as m from '$lib/paraglide/messages.js';
import type { WorkflowBlockDefinition } from '../../shared/block-types';

export const actionBlockDefinitions: WorkflowBlockDefinition[] = [
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

const blockById = new Map(actionBlockDefinitions.map((block) => [block.id, block]));

export function actionBlockDefinition(itemId: string): WorkflowBlockDefinition | undefined {
	return blockById.get(itemId);
}
