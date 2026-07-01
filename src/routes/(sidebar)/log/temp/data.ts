import type { Log } from '../log';

export const data: Log[] = [
	{
		id: 'log-001',
		user_id: 'usr-1',
		email: 'alice@example.com',
		type: 'login',
		time: new Date('2026-05-17T08:02:11'),
		data: { ip: '192.168.1.10', browser: 'Chrome 124', os: 'Windows 11', mfa: true }
	},
	{
		id: 'log-002',
		user_id: 'usr-2',
		email: 'bob@example.com',
		type: 'action_edit',
		time: new Date('2026-05-17T08:15:44'),
		data: {
			entity: 'campaign',
			entity_id: 'cmp-88',
			field: 'title',
			from: 'Summer Sale',
			to: 'Summer Sale 2026'
		}
	},
	{
		id: 'log-003',
		user_id: 'usr-3',
		email: 'carol@example.com',
		type: 'visitor_edit',
		time: new Date('2026-05-17T08:31:09'),
		data: { visitor_id: 'vis-204', fields_changed: ['email', 'phone'], source: 'manual' }
	},
	{
		id: 'log-004',
		user_id: 'usr-1',
		email: 'alice@example.com',
		type: 'action_run',
		time: new Date('2026-05-17T08:47:55'),
		data: { action_id: 'act-17', trigger: 'manual', recipients: 512 }
	},
	{
		id: 'log-005',
		user_id: 'usr-4',
		email: 'david@example.com',
		type: 'lock_acquired',
		time: new Date('2026-05-17T09:03:22'),
		data: { resource: 'segment', resource_id: 'seg-3', ttl_seconds: 300 }
	},
	{
		id: 'log-006',
		user_id: 'usr-4',
		email: 'david@example.com',
		type: 'lock_released',
		time: new Date('2026-05-17T09:04:01'),
		data: { resource: 'segment', resource_id: 'seg-3', held_for_ms: 39000 }
	},
	{
		id: 'log-007',
		user_id: 'usr-2',
		email: 'bob@example.com',
		type: 'action_delete',
		time: new Date('2026-05-17T09:18:37'),
		data: {
			entity: 'template',
			entity_id: 'tpl-55',
			name: 'Old Welcome Email',
			soft_delete: false
		}
	},
	{
		id: 'log-008',
		user_id: 'usr-5',
		email: 'eve@example.com',
		type: 'action_test',
		time: new Date('2026-05-17T09:33:14'),
		data: { action_id: 'act-22', test_recipients: ['eve@example.com'], status: 'delivered' }
	},
	{
		id: 'log-009',
		user_id: 'usr-3',
		email: 'carol@example.com',
		type: 'action_scenario_edit',
		time: new Date('2026-05-17T09:51:48'),
		data: { scenario_id: 'scn-9', change: 'added_step', step_type: 'email', position: 3 }
	},
	{
		id: 'log-010',
		user_id: 'usr-1',
		email: 'alice@example.com',
		type: 'action_duplicate',
		time: new Date('2026-05-17T10:07:29'),
		data: { source_id: 'act-5', new_id: 'act-31', name_suffix: ' (copy)' }
	},
	{
		id: 'log-011',
		user_id: 'usr-6',
		email: 'frank@example.com',
		type: 'login',
		time: new Date('2026-05-17T10:22:03'),
		data: { ip: '10.0.0.42', browser: 'Firefox 125', os: 'macOS 15', mfa: false }
	},
	{
		id: 'log-012',
		user_id: 'usr-5',
		email: 'eve@example.com',
		type: 'action_archive',
		time: new Date('2026-05-17T10:39:57'),
		data: { entity: 'campaign', entity_id: 'cmp-12', reason: 'season_ended' }
	},
	{
		id: 'log-013',
		user_id: 'usr-6',
		email: 'frank@example.com',
		type: 'user_edit',
		time: new Date('2026-05-17T10:55:41'),
		data: { target_user_id: 'usr-9', fields_changed: ['role'], from: 'viewer', to: 'editor' }
	},
	{
		id: 'log-014',
		user_id: 'usr-2',
		email: 'bob@example.com',
		type: 'action_auto_stop',
		time: new Date('2026-05-17T11:12:16'),
		data: { action_id: 'act-8', reason: 'error_threshold_exceeded', errors: 47, threshold: 40 }
	},
	{
		id: 'log-015',
		user_id: 'usr-7',
		email: 'grace@example.com',
		type: 'lock_force_released',
		time: new Date('2026-05-17T11:28:50'),
		data: {
			resource: 'template',
			resource_id: 'tpl-7',
			previous_holder: 'usr-3',
			reason: 'stale_lock'
		}
	},
	{
		id: 'log-016',
		user_id: 'usr-3',
		email: 'carol@example.com',
		type: 'action_run',
		time: new Date('2026-05-17T11:44:33'),
		data: { action_id: 'act-19', trigger: 'scheduled', recipients: 1240 }
	},
	{
		id: 'log-017',
		user_id: 'usr-7',
		email: 'grace@example.com',
		type: 'action_edit',
		time: new Date('2026-05-17T12:01:07'),
		data: {
			entity: 'template',
			entity_id: 'tpl-11',
			field: 'subject',
			from: 'Hello!',
			to: 'Welcome back!'
		}
	},
	{
		id: 'log-018',
		user_id: 'usr-1',
		email: 'alice@example.com',
		type: 'visitor_edit',
		time: new Date('2026-05-17T12:17:42'),
		data: { visitor_id: 'vis-77', fields_changed: ['consent_marketing'], source: 'import' }
	},
	{
		id: 'log-019',
		user_id: 'usr-4',
		email: 'david@example.com',
		type: 'action_test',
		time: new Date('2026-05-17T12:33:19'),
		data: {
			action_id: 'act-33',
			test_recipients: ['david@example.com', 'qa@example.com'],
			status: 'bounced'
		}
	},
	{
		id: 'log-020',
		user_id: 'usr-8',
		email: 'henry@example.com',
		type: 'login',
		time: new Date('2026-05-17T12:48:55'),
		data: { ip: '172.16.5.99', browser: 'Safari 17', os: 'iOS 18', mfa: true }
	},
	{
		id: 'log-021',
		user_id: 'usr-8',
		email: 'henry@example.com',
		type: 'action_scenario_edit',
		time: new Date('2026-05-17T13:04:28'),
		data: { scenario_id: 'scn-14', change: 'removed_step', step_type: 'sms', position: 2 }
	},
	{
		id: 'log-022',
		user_id: 'usr-5',
		email: 'eve@example.com',
		type: 'lock_acquired',
		time: new Date('2026-05-17T13:20:11'),
		data: { resource: 'campaign', resource_id: 'cmp-21', ttl_seconds: 600 }
	},
	{
		id: 'log-023',
		user_id: 'usr-5',
		email: 'eve@example.com',
		type: 'lock_released',
		time: new Date('2026-05-17T13:21:04'),
		data: { resource: 'campaign', resource_id: 'cmp-21', held_for_ms: 53000 }
	},
	{
		id: 'log-024',
		user_id: 'usr-6',
		email: 'frank@example.com',
		type: 'action_delete',
		time: new Date('2026-05-17T13:37:39'),
		data: { entity: 'segment', entity_id: 'seg-18', name: 'Inactive 90d', soft_delete: true }
	},
	{
		id: 'log-025',
		user_id: 'usr-9',
		email: 'iris@example.com',
		type: 'login',
		time: new Date('2026-05-17T13:53:22'),
		data: { ip: '203.0.113.7', browser: 'Edge 124', os: 'Windows 10', mfa: true }
	},
	{
		id: 'log-026',
		user_id: 'usr-9',
		email: 'iris@example.com',
		type: 'action_duplicate',
		time: new Date('2026-05-17T14:09:47'),
		data: { source_id: 'scn-9', new_id: 'scn-15', name_suffix: ' (copy)' }
	},
	{
		id: 'log-027',
		user_id: 'usr-7',
		email: 'grace@example.com',
		type: 'action_archive',
		time: new Date('2026-05-17T14:26:15'),
		data: { entity: 'action', entity_id: 'act-3', reason: 'deprecated' }
	},
	{
		id: 'log-028',
		user_id: 'usr-2',
		email: 'bob@example.com',
		type: 'user_edit',
		time: new Date('2026-05-17T14:41:58'),
		data: {
			target_user_id: 'usr-10',
			fields_changed: ['email', 'name'],
			new_email: 'jack.new@example.com'
		}
	},
	{
		id: 'log-029',
		user_id: 'usr-10',
		email: 'jack@example.com',
		type: 'login',
		time: new Date('2026-05-17T14:57:34'),
		data: { ip: '198.51.100.4', browser: 'Chrome 124', os: 'Ubuntu 24', mfa: false }
	},
	{
		id: 'log-030',
		user_id: 'usr-3',
		email: 'carol@example.com',
		type: 'action_auto_stop',
		time: new Date('2026-05-17T15:13:09'),
		data: { action_id: 'act-19', reason: 'daily_limit_reached', sent: 5000, limit: 5000 }
	},
	{
		id: 'log-031',
		user_id: 'usr-10',
		email: 'jack@example.com',
		type: 'action_edit',
		time: new Date('2026-05-17T15:28:44'),
		data: {
			entity: 'campaign',
			entity_id: 'cmp-40',
			field: 'send_date',
			from: '2026-06-01',
			to: '2026-06-15'
		}
	},
	{
		id: 'log-032',
		user_id: 'usr-8',
		email: 'henry@example.com',
		type: 'lock_force_released',
		time: new Date('2026-05-17T15:44:21'),
		data: {
			resource: 'segment',
			resource_id: 'seg-5',
			previous_holder: 'usr-1',
			reason: 'admin_override'
		}
	},
	{
		id: 'log-033',
		user_id: 'usr-1',
		email: 'alice@example.com',
		type: 'action_run',
		time: new Date('2026-05-17T16:00:05'),
		data: { action_id: 'act-41', trigger: 'api', recipients: 88, api_key_id: 'key-7' }
	},
	{
		id: 'log-034',
		user_id: 'usr-9',
		email: 'iris@example.com',
		type: 'visitor_edit',
		time: new Date('2026-05-17T16:15:48'),
		data: { visitor_id: 'vis-310', fields_changed: ['city', 'country'], source: 'webhook' }
	},
	{
		id: 'log-035',
		user_id: 'usr-4',
		email: 'david@example.com',
		type: 'action_scenario_edit',
		time: new Date('2026-05-17T16:31:27'),
		data: { scenario_id: 'scn-2', change: 'reordered_steps', positions: [3, 1, 2, 4] }
	},
	{
		id: 'log-036',
		user_id: 'usr-6',
		email: 'frank@example.com',
		type: 'action_test',
		time: new Date('2026-05-17T16:47:03'),
		data: { action_id: 'act-27', test_recipients: ['frank@example.com'], status: 'delivered' }
	},
	{
		id: 'log-037',
		user_id: 'usr-10',
		email: 'jack@example.com',
		type: 'action_duplicate',
		time: new Date('2026-05-17T17:02:39'),
		data: { source_id: 'tpl-3', new_id: 'tpl-62', name_suffix: ' v2' }
	},
	{
		id: 'log-038',
		user_id: 'usr-7',
		email: 'grace@example.com',
		type: 'lock_acquired',
		time: new Date('2026-05-17T17:18:14'),
		data: { resource: 'action', resource_id: 'act-14', ttl_seconds: 180 }
	},
	{
		id: 'log-039',
		user_id: 'usr-7',
		email: 'grace@example.com',
		type: 'lock_released',
		time: new Date('2026-05-17T17:18:52'),
		data: { resource: 'action', resource_id: 'act-14', held_for_ms: 38000 }
	},
	{
		id: 'log-040',
		user_id: 'usr-5',
		email: 'eve@example.com',
		type: 'action_delete',
		time: new Date('2026-05-17T17:34:30'),
		data: {
			entity: 'campaign',
			entity_id: 'cmp-7',
			name: 'Black Friday 2025',
			soft_delete: false
		}
	},
	{
		id: 'log-041',
		user_id: 'usr-5',
		email: 'eve@example.com',
		type: 'action_delete',
		time: new Date('2026-05-17T17:36:30'),
		data: {
			entity: 'campaign',
			entity_id: 'cmp-7',
			name: 'Black Friday 2025',
			soft_delete: false
		}
	}
];
