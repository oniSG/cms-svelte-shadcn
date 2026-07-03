import * as m from '$lib/paraglide/messages.js';

export function workflowDrawerTitle(itemId: string): string {
	if (itemId === 'condition') return m.fan_action_flow_condition();
	return workflowItemLabel(itemId);
}

export function workflowItemLabel(itemId: string): string {
	switch (itemId) {
		case 'run-now':
			return m.fan_action_flow_trigger_run_now();
		case 'schedule':
			return m.fan_action_flow_trigger_schedule();
		case 'loyalty':
			return m.fan_action_flow_trigger_loyalty();
		case 'ticket':
			return m.fan_action_flow_trigger_ticket();
		case 'season-ticket':
			return m.fan_action_flow_trigger_season_ticket();
		case 'attended':
			return m.fan_action_flow_trigger_attended();
		case 'email':
			return m.fan_action_flow_action_email();
		case 'sms':
			return m.fan_action_flow_action_sms();
		case 'push':
			return m.fan_action_flow_action_push();
		case 'wait':
			return m.fan_action_flow_action_wait();
		case 'condition':
			return m.fan_action_flow_condition_add();
		case 'tag':
			return m.fan_action_flow_action_tag();
		case 'remove-tag':
			return m.fan_action_flow_action_remove_tag();
		case 'credit':
			return m.fan_action_flow_action_credit();
		case 'ab-test':
			return m.fan_action_flow_action_ab_test();
		case 'custom-attribute':
			return m.fan_action_flow_action_custom_attribute();
		case 'reward-conversion':
			return m.fan_action_flow_action_reward_conversion();
		case 'end-branch':
			return m.fan_action_flow_action_end_branch();
		default:
			return itemId;
	}
}

export function workflowItemDescription(itemId: string): string {
	switch (itemId) {
		case 'run-now':
			return m.fan_action_flow_trigger_run_now_desc();
		case 'schedule':
			return m.fan_action_flow_trigger_schedule_desc();
		case 'loyalty':
			return m.fan_action_flow_trigger_loyalty_desc();
		case 'ticket':
			return m.fan_action_flow_trigger_ticket_desc();
		case 'season-ticket':
			return m.fan_action_flow_trigger_season_ticket_desc();
		case 'attended':
			return m.fan_action_flow_trigger_attended_desc();
		case 'email':
			return m.fan_action_flow_action_email_desc();
		case 'sms':
			return m.fan_action_flow_action_sms_desc();
		case 'push':
			return m.fan_action_flow_action_push_desc();
		case 'wait':
			return m.fan_action_flow_action_wait_desc();
		case 'condition':
			return m.fan_action_flow_condition_add_desc();
		case 'tag':
			return m.fan_action_flow_action_tag_desc();
		case 'remove-tag':
			return m.fan_action_flow_action_remove_tag_desc();
		case 'credit':
			return m.fan_action_flow_action_credit_desc();
		case 'ab-test':
			return m.fan_action_flow_action_ab_test_desc();
		case 'custom-attribute':
			return m.fan_action_flow_action_custom_attribute_desc();
		case 'reward-conversion':
			return m.fan_action_flow_action_reward_conversion_desc();
		case 'end-branch':
			return m.fan_action_flow_action_end_branch_desc();
		default:
			return '';
	}
}
