import type { ColumnDef } from '@tanstack/table-core';
import { renderComponent } from '$lib/components/ui/data-table/index.js';
import DataTableColumnHeader from './components/data-table-column-header.svelte';
import TimeCell from './components/time-cell.svelte';
import TypeCell from './components/type-cell.svelte';
import { data } from './temp/data';
import * as m from '$lib/paraglide/messages.js';

export const emails: { value: string; label: string }[] = data
	.map((log) => ({ value: log.email, label: log.email }))
	.filter((item, index, self) => self.findIndex((i) => i.value === item.value) === index);

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

// Plain list of action-type values. Labels are NOT baked in here because
// they would freeze at module-init time and never update on locale change.
// Use `getTypeLabel(t)` at render time instead.
export const types: ActionType[] = [
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

export function getColumnLabel(id: string): string {
	switch (id) {
		case 'id':
			return m.log_col_id();
		case 'type':
			return m.log_col_type();
		case 'user_id':
			return m.log_col_user_id();
		case 'email':
			return m.log_col_email();
		case 'time':
			return m.log_col_time();
		default:
			return id;
	}
}

// Initial / min / max widths used by the column-resize handle.
// `size` is the starting width in pixels. `minSize` / `maxSize` cap how far
// the user can drag. Per-column overrides go on each column below.
const DEFAULT_MIN_SIZE = 150;
const DEFAULT_MAX_SIZE = 400;

export const columns: ColumnDef<Log>[] = [
	{
		accessorKey: 'id',
		size: 300,
		minSize: DEFAULT_MIN_SIZE,
		maxSize: DEFAULT_MAX_SIZE,
		header: ({ column }) =>
			renderComponent(DataTableColumnHeader, { column, title: m.log_col_id() })
	},
	{
		accessorKey: 'type',
		size: 200,
		minSize: 120,
		maxSize: DEFAULT_MAX_SIZE,
		header: ({ column }) =>
			renderComponent(DataTableColumnHeader, { column, title: m.log_col_type() }),
		cell: ({ row }) => renderComponent(TypeCell, { value: row.original.type })
	},
	{
		accessorKey: 'user_id',
		size: 300,
		minSize: DEFAULT_MIN_SIZE,
		maxSize: DEFAULT_MAX_SIZE,
		header: ({ column }) =>
			renderComponent(DataTableColumnHeader, { column, title: m.log_col_user_id() })
	},
	{
		accessorKey: 'email',
		size: 240,
		minSize: DEFAULT_MIN_SIZE,
		maxSize: DEFAULT_MAX_SIZE,
		header: ({ column }) =>
			renderComponent(DataTableColumnHeader, { column, title: m.log_col_email() })
	},
	{
		accessorKey: 'time',
		size: 200,
		minSize: DEFAULT_MIN_SIZE,
		maxSize: DEFAULT_MAX_SIZE,
		header: ({ column }) =>
			renderComponent(DataTableColumnHeader, { column, title: m.log_col_time() }),
		cell: ({ row }) => renderComponent(TimeCell, { value: row.original.time })
	}
];
