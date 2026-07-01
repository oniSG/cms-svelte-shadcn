<script lang="ts">
	import ShapesIcon from '@lucide/svelte/icons/shapes';
	import UserIcon from '@lucide/svelte/icons/user';
	import { TablePage, type Shortcut, type TableColumn } from '$lib/components/custom/table-page';
	import * as m from '$lib/paraglide/messages.js';
	import { actionTypes, getTypeLabel, type Log } from './log';
	import { data as seed } from './temp/data';
	import { fetchLogs } from './temp/api';
	import LogDrawer from './components/log-drawer.svelte';
	import PageHeader from '$lib/components/custom/sidebar/page-header.svelte';

	const breadcrumbs = $derived([
		{ title: m.log_breadcrumb_home(), url: '/' as const },
		{ title: m.log_breadcrumb_settings() },
		{ title: m.log_breadcrumb_logs() }
	]);

	const typeOptions = $derived(actionTypes.map((value) => ({ value, label: getTypeLabel(value) })));

	const emailOptions = $derived(
		seed
			.map((l) => ({ value: l.email, label: l.email }))
			.filter((o, i, arr) => arr.findIndex((x) => x.value === o.value) === i)
	);

	const columns = $derived<TableColumn<Log>[]>([
		{ id: 'id', label: m.log_col_id(), type: 'text', width: 300 },
		{
			id: 'type',
			label: m.log_col_type(),
			type: 'select',
			options: typeOptions,
			width: 200,
			minWidth: 120
		},
		{ id: 'user_id', label: m.log_col_user_id(), type: 'text', width: 300 },
		{ id: 'email', label: m.log_col_email(), type: 'text', width: 240 },
		{ id: 'time', label: m.log_col_time(), type: 'date', width: 200 }
	]);

	const shortcuts = $derived<Shortcut[]>([
		{
			kind: 'multi-select',
			id: 'types',
			label: m.log_filter_type(),
			icon: ShapesIcon,
			field: 'type',
			options: typeOptions
		},
		{
			kind: 'multi-select',
			id: 'emails',
			label: m.log_filter_user(),
			icon: UserIcon,
			field: 'email',
			options: emailOptions
		},
		{ kind: 'date-range', id: 'dates', label: m.log_filter_date(), field: 'time' }
	]);
</script>

<PageHeader separator {breadcrumbs} />

<TablePage
	queryKey="logs"
	{columns}
	{shortcuts}
	fetcher={fetchLogs}
	search={{
		placeholder: 'Search logs',
		fields: ['id', 'user_id', 'email']
	}}
	defaultSort={{ id: 'time', desc: true }}
	click={{ drawer: rowDrawer }}
/>

{#snippet rowDrawer(log: Log)}
	<LogDrawer {log} />
{/snippet}
