<script lang="ts" module>
	import CalendarDaysIcon from '@lucide/svelte/icons/calendar-days';
	import ChartBarIcon from '@lucide/svelte/icons/chart-bar';
	import ClipboardListIcon from '@lucide/svelte/icons/clipboard-list';
	import FileTextIcon from '@lucide/svelte/icons/file-text';
	import LayersIcon from '@lucide/svelte/icons/layers';
	import LayoutDashboardIcon from '@lucide/svelte/icons/layout-dashboard';
	import MonitorIcon from '@lucide/svelte/icons/monitor';
	import TargetIcon from '@lucide/svelte/icons/target';
	import TvIcon from '@lucide/svelte/icons/tv';
	import WaypointsIcon from '@lucide/svelte/icons/waypoints';
	import ZapIcon from '@lucide/svelte/icons/zap';
</script>

<script lang="ts">
	import NavMain from './navigation.svelte';
	import * as m from '$lib/paraglide/messages.js';
	import type { NavGroup } from '$lib/types/sidebar';

	const nav = $derived<NavGroup[]>([
		{
			items: [
				{ title: m.nav_dashboard(), url: '/fans', icon: TargetIcon },
				{ title: m.nav_fans_visitors(), url: '/fan', icon: ZapIcon },
				{ title: m.nav_fans_segments(), url: '/segment', icon: LayersIcon },
				{ title: m.nav_fans_templates(), url: '/template', icon: LayoutDashboardIcon },
				{ title: m.nav_fans_campaigns(), url: '/fan-action', icon: WaypointsIcon },
				{ title: m.nav_fans_surveys(), url: '/survey', icon: FileTextIcon },
				{ title: m.nav_fans_event_lists(), url: '/event-list', icon: CalendarDaysIcon },
				{ title: m.nav_fans_web_form(), url: '/custom-web-form', icon: ClipboardListIcon }
			]
		},
		{
			items: [
				{
					title: m.nav_fans_overviews(),
					url: '#',
					icon: TvIcon,
					items: [
						{ title: m.nav_fans_tickets(), url: '/ticket' },
						{ title: m.nav_fans_season_tickets(), url: '/season-ticket' },
						{ title: m.nav_fans_occasions(), url: '/events' },
						{ title: m.nav_fans_visits(), url: '/visit' },
						{ title: m.nav_fans_memberships(), url: '/fan-memberships' },
						{ title: m.nav_fans_football_schools(), url: '/football-class' },
						{ title: m.nav_fans_products(), url: '/ticketing-products' }
					]
				},
				{
					title: m.nav_reports(),
					url: '#',
					icon: ChartBarIcon,
					items: [
						{ title: m.nav_fans_analytics_global(), url: '/report-fan-general' },
						{ title: m.nav_fans_analytics_insights(), url: '/report-expert' },
						{ title: m.nav_fans_analytics_top_visitors(), url: '/report-loyalty-program' },
						{ title: m.nav_fans_analytics_history(), url: '/report-history-fan' },
						{ title: m.nav_fans_analytics_gdpr(), url: '/report-gdpr-change' },
						{ title: m.nav_fans_analytics_event_report(), url: '/report-event' },
						{ title: m.nav_manager_report(), url: '/report-management' }
					]
				}
			]
		}
	]);
</script>

{#each nav as group, i (i)}
	<NavMain label={group.label} items={group.items} />
{/each}
