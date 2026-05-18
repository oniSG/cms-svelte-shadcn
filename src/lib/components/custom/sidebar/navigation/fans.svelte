<script lang="ts" module>
	import WaypointsIcon from '@lucide/svelte/icons/waypoints';
	import CalendarDaysIcon from '@lucide/svelte/icons/calendar-days';
	import ChartBarIcon from '@lucide/svelte/icons/chart-bar';
	import ClipboardListIcon from '@lucide/svelte/icons/clipboard-list';
	import FileTextIcon from '@lucide/svelte/icons/file-text';
	import LayersIcon from '@lucide/svelte/icons/layers';
	import LayoutDashboardIcon from '@lucide/svelte/icons/layout-dashboard';
	import TargetIcon from '@lucide/svelte/icons/target';
	import TvIcon from '@lucide/svelte/icons/tv';
	import ZapIcon from '@lucide/svelte/icons/zap';
</script>

<script lang="ts">
	import NavMain from './navigation.svelte';
	import * as m from '$lib/paraglide/messages.js';
	import type { NavGroup } from '$lib/types/sidebar';

	const nav = $derived<NavGroup[]>([
		{
			items: [{ title: m.nav_dashboard(), url: '/fans', icon: TargetIcon, isActive: true }]
		},
		{
			label: m.nav_fans_management(),
			items: [
				{ title: m.nav_fans_visitors(), url: '/fans/navstevnici', icon: ZapIcon },
				{ title: m.nav_fans_segments(), url: '/fans/segmenty', icon: LayersIcon },
				{ title: m.nav_fans_templates(), url: '/fans/sablony', icon: LayoutDashboardIcon }
			]
		},
		{
			label: m.nav_fans_communication(),
			items: [
				{ title: m.nav_fans_campaigns(), url: '/fans/akce', icon: WaypointsIcon },
				{ title: m.nav_fans_surveys(), url: '/fans/dotazniky', icon: FileTextIcon },
				{ title: m.nav_fans_web_form(), url: '/fans/webovy-formular', icon: ClipboardListIcon },
				{ title: m.nav_fans_event_lists(), url: '/fans/seznamy-udalosti', icon: CalendarDaysIcon }
			]
		},
		{
			label: m.nav_fans_data(),
			items: [
				{
					title: m.nav_fans_overviews(),
					url: '#',
					icon: TvIcon,
					items: [
						{ title: m.nav_fans_tickets(), url: '/fans/prehledy/vstupenky' },
						{ title: m.nav_fans_season_tickets(), url: '/fans/prehledy/permanentky' },
						{ title: m.nav_fans_occasions(), url: '/fans/prehledy/udalosti' },
						{ title: m.nav_fans_visits(), url: '/fans/prehledy/navstevy' },
						{ title: m.nav_fans_memberships(), url: '/fans/prehledy/clenstvi' },
						{ title: m.nav_fans_football_schools(), url: '/fans/prehledy/fotbalove-skolicky' },
						{ title: m.nav_fans_products(), url: '/fans/prehledy/produkty' }
					]
				},
				{
					title: m.nav_analytics(),
					url: '#',
					icon: ChartBarIcon,
					items: [
						{ title: m.nav_fans_analytics_global(), url: '/fans/analytika/globalni' },
						{ title: m.nav_fans_analytics_insights(), url: '/fans/analytika/postrehy-relatoo' },
						{ title: m.nav_fans_analytics_top_visitors(), url: '/fans/analytika/nejvernejsi' },
						{ title: m.nav_fans_analytics_history(), url: '/fans/analytika/historie' },
						{ title: m.nav_fans_analytics_gdpr(), url: '/fans/analytika/gdpr' },
						{ title: m.nav_fans_analytics_event_report(), url: '/fans/analytika/report-udalosti' },
						{ title: m.nav_manager_report(), url: '/fans/analytika/manazersky' }
					]
				}
			]
		}
	]);
</script>

{#each nav as group, i (i)}
	<NavMain label={group.label} items={group.items} />
{/each}
