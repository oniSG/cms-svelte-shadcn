import GitFork from '@lucide/svelte/icons/git-fork';
import Clock from '@lucide/svelte/icons/clock';
import Gauge from '@lucide/svelte/icons/gauge';
import X from '@lucide/svelte/icons/x';
import * as m from '$lib/paraglide/messages.js';
import type { WorkflowBlockDefinition } from '../../shared/block-types';

export const operatorBlockDefinitions: WorkflowBlockDefinition[] = [
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
	}
];

const blockById = new Map(operatorBlockDefinitions.map((block) => [block.id, block]));

export function operatorBlockDefinition(itemId: string): WorkflowBlockDefinition | undefined {
	return blockById.get(itemId);
}

export const workflowOperatorItemIds = new Set(operatorBlockDefinitions.map((block) => block.id));
