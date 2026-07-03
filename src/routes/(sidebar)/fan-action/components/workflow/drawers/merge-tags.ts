import * as m from '$lib/paraglide/messages.js';

export type WorkflowMergeTag = {
	token: string;
	label: string;
};

export function workflowMergeTags(): WorkflowMergeTag[] {
	return [
		{ token: '{{visitor_email}}', label: m.fan_action_flow_sms_merge_visitor_email() },
		{ token: '{{visitor_title}}', label: m.fan_action_flow_sms_merge_visitor_title() },
		{ token: '{{first_name}}', label: m.fan_action_flow_sms_merge_first_name() },
		{ token: '{{last_name}}', label: m.fan_action_flow_sms_merge_last_name() },
		{
			token: '{{salutation_first_name}}',
			label: m.fan_action_flow_sms_merge_salutation_first_name()
		},
		{
			token: '{{salutation_last_name}}',
			label: m.fan_action_flow_sms_merge_salutation_last_name()
		},
		{
			token: '{{salutation_informal}}',
			label: m.fan_action_flow_sms_merge_salutation_informal()
		},
		{
			token: '{{salutation_formal}}',
			label: m.fan_action_flow_sms_merge_salutation_formal()
		},
		{ token: '{{company_name}}', label: m.fan_action_flow_sms_merge_company_name() },
		{ token: '{{company_address}}', label: m.fan_action_flow_sms_merge_company_address() },
		{ token: '{{company_id}}', label: m.fan_action_flow_sms_merge_company_id() },
		{
			token: '{{next_home_event_date}}',
			label: m.fan_action_flow_sms_merge_next_home_event_date()
		},
		{
			token: '{{next_home_event_time}}',
			label: m.fan_action_flow_sms_merge_next_home_event_time()
		},
		{
			token: '{{next_home_event_name}}',
			label: m.fan_action_flow_sms_merge_next_home_event_name()
		},
		{ token: '{{current_points}}', label: m.fan_action_flow_sms_merge_current_points() },
		{ token: '{{credited_points}}', label: m.fan_action_flow_sms_merge_credited_points() }
	];
}
