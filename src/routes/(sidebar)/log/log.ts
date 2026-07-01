import * as m from '$lib/paraglide/messages.js';

export type ActionType =
	| 'login'
	| 'action_test'
	| 'action_run'
	| 'action_scenario_edit'
	| 'action_edit'
	| 'action_delete'
	| 'action_duplicate'
	| 'action_archive'
	| 'action_auto_stop'
	| 'visitor_edit'
	| 'user_edit'
	| 'lock_acquired'
	| 'lock_released'
	| 'lock_force_released';

export type Log = {
	id: string;
	user_id: string;
	email: string;
	type: ActionType;
	time: Date;
	data: object;
};

export const actionTypes: ActionType[] = [
	'login',
	'action_test',
	'action_run',
	'action_scenario_edit',
	'action_edit',
	'action_delete',
	'action_duplicate',
	'action_archive',
	'action_auto_stop',
	'visitor_edit',
	'user_edit',
	'lock_acquired',
	'lock_released',
	'lock_force_released'
];

export function getTypeLabel(t: ActionType): string {
	switch (t) {
		case 'login':
			return m.log_type_login();
		case 'action_test':
			return m.log_type_action_test();
		case 'action_run':
			return m.log_type_action_run();
		case 'action_scenario_edit':
			return m.log_type_action_scenario_edit();
		case 'action_edit':
			return m.log_type_action_edit();
		case 'action_delete':
			return m.log_type_action_delete();
		case 'action_duplicate':
			return m.log_type_action_duplicate();
		case 'action_archive':
			return m.log_type_action_archive();
		case 'action_auto_stop':
			return m.log_type_action_auto_stop();
		case 'visitor_edit':
			return m.log_type_visitor_edit();
		case 'user_edit':
			return m.log_type_user_edit();
		case 'lock_acquired':
			return m.log_type_lock_acquired();
		case 'lock_released':
			return m.log_type_lock_released();
		case 'lock_force_released':
			return m.log_type_lock_force_released();
	}
}
