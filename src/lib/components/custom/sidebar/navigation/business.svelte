<script lang="ts" module>
	import BookUserIcon from '@lucide/svelte/icons/book-user';
	import CalendarIcon from '@lucide/svelte/icons/calendar';
	import ChartBarIcon from '@lucide/svelte/icons/chart-bar';
	import ClipboardCheckIcon from '@lucide/svelte/icons/clipboard-check';
	import DollarSignIcon from '@lucide/svelte/icons/dollar-sign';
	import FileIcon from '@lucide/svelte/icons/file';
	import MonitorIcon from '@lucide/svelte/icons/monitor';
	import TargetIcon from '@lucide/svelte/icons/target';
</script>

<script lang="ts">
	import NavMain from './navigation.svelte';
	import * as m from '$lib/paraglide/messages.js';
	import type { NavGroup } from '$lib/types/sidebar';

	const nav = $derived<NavGroup[]>([
		{
			items: [
				{ title: m.nav_dashboard(), url: '/business', icon: TargetIcon },
				{ title: m.nav_biz_calendar(), url: '/calendar', icon: CalendarIcon }
			]
		},
		{
			items: [
				{
					title: m.nav_biz_address_book(),
					url: '#',
					icon: BookUserIcon,
					items: [
						{ title: m.nav_biz_partners(), url: '/partner' },
						{ title: m.nav_biz_contacts(), url: '/contact' }
					]
				},
				{
					title: m.nav_biz_sales(),
					url: '#',
					icon: DollarSignIcon,
					items: [
						{ title: m.nav_biz_sales_dashboard(), url: '/business-board' },
						{ title: m.nav_biz_sales_cases(), url: '/business-case' },
						{ title: m.nav_biz_ad_board(), url: '/advertising-space-board' },
						{ title: m.nav_biz_offers(), url: '/offer' },
						{ title: m.nav_biz_contracts(), url: '/contract' },
						{ title: m.nav_biz_ad_rentals(), url: '/advertising-space' },
						{ title: m.nav_biz_pricelists(), url: '/price-list' },
						{ title: m.nav_biz_bonuses(), url: '/bonus' },
						{ title: m.nav_biz_discounts(), url: '/bonus-guideline' }
					]
				},
				{
					title: m.nav_biz_visualization(),
					url: '#',
					icon: MonitorIcon,
					items: [
						{ title: m.nav_biz_viz_ad_space(), url: '/advertising-space-arena' },
						{ title: m.nav_biz_viz_led(), url: '/advertising-space-led' },
						{ title: m.nav_biz_viz_space2(), url: '/advertising-space-arena-2' },
						{ title: m.nav_biz_viz_player(), url: '/advertising-space-player' },
						{ title: m.nav_biz_viz_season_pass(), url: '/advertising-space-card' }
					]
				},
				{ title: m.nav_biz_documents(), url: '/document', icon: FileIcon }
			]
		},
		{
			items: [
				{
					title: m.nav_reports(),
					url: '#',
					icon: ChartBarIcon,
					items: [
						{ title: m.nav_biz_filter_opportunities(), url: '/report-filter-business-case' },
						{ title: m.nav_biz_filter_free_spaces(), url: '/report-free-advertising-spaces' },
						{ title: m.nav_biz_filter_occupied(), url: '/report-occupied-advertising-spaces' },
						{ title: m.nav_biz_filter_funnel(), url: '/report-sales-funnel' },
						{ title: m.nav_biz_analytics_sales_dev(), url: '/report-sales-development' },
						{ title: m.nav_biz_analytics_by_product(), url: '/report-sales-by-product' },
						{ title: m.nav_biz_analytics_by_person(), url: '/report-sales-by-merchant' },
						{ title: m.nav_biz_analytics_success(), url: '/report-success-by-merchant' },
						{ title: m.nav_biz_analytics_opp_count(), url: '/report-number-of-cases' },
						{ title: m.nav_biz_analytics_realized(), url: '/report-number-of-activities' },
						{ title: m.nav_biz_analytics_profit_opp(), url: '/report-profitability-of-cases' },
						{ title: m.nav_biz_analytics_profit_dev(), url: '/report-profit-development' },
						{ title: m.nav_biz_analytics_invoicing(), url: '/report-invoice' },
						{ title: m.nav_manager_report(), url: '/report-management' }
					]
				}
			]
		},
		{
			items: [
				{
					title: m.nav_biz_plan(),
					url: '#',
					icon: ClipboardCheckIcon,
					items: [{ title: m.nav_biz_sales_plan(), url: '/business-plan' }]
				}
			]
		}
	]);
</script>

{#each nav as group, i (i)}
	<NavMain label={group.label} items={group.items} />
{/each}
