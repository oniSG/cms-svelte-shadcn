<script lang="ts" module>
	import BookUserIcon from '@lucide/svelte/icons/book-user';
	import CalendarIcon from '@lucide/svelte/icons/calendar';
	import ChartBarIcon from '@lucide/svelte/icons/chart-bar';
	import ClipboardCheckIcon from '@lucide/svelte/icons/clipboard-check';
	import DollarSignIcon from '@lucide/svelte/icons/dollar-sign';
	import FileIcon from '@lucide/svelte/icons/file';
	import FunnelIcon from '@lucide/svelte/icons/funnel';
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
				{ title: m.nav_dashboard(), url: '/business', icon: TargetIcon, isActive: true },
				{ title: m.nav_biz_calendar(), url: '/business/kalendar', icon: CalendarIcon }
			]
		},
		{
			items: [
				{
					title: m.nav_biz_address_book(),
					url: '#',
					icon: BookUserIcon,
					items: [
						{ title: m.nav_biz_partners(), url: '/business/adresar/partneri' },
						{ title: m.nav_biz_contacts(), url: '/business/adresar/kontaktni-osoby' }
					]
				},
				{
					title: m.nav_biz_sales(),
					url: '#',
					icon: DollarSignIcon,
					items: [
						{ title: m.nav_biz_sales_dashboard(), url: '/business/obchod/nastenka' },
						{ title: m.nav_biz_sales_cases(), url: '/business/obchod/pripady' },
						{ title: m.nav_biz_ad_board(), url: '/business/obchod/reklamni-nastenka' },
						{ title: m.nav_biz_offers(), url: '/business/obchod/nabidky' },
						{ title: m.nav_biz_contracts(), url: '/business/obchod/smlouvy' },
						{ title: m.nav_biz_ad_rentals(), url: '/business/obchod/reklama-pronajmy' },
						{ title: m.nav_biz_pricelists(), url: '/business/obchod/ceniky' },
						{ title: m.nav_biz_bonuses(), url: '/business/obchod/bonusy' },
						{ title: m.nav_biz_discounts(), url: '/business/obchod/slevy' }
					]
				},
				{
					title: m.nav_biz_visualization(),
					url: '#',
					icon: MonitorIcon,
					items: [
						{ title: m.nav_biz_viz_ad_space(), url: '/business/vizualizace/plocha' },
						{ title: m.nav_biz_viz_led(), url: '/business/vizualizace/led' },
						{ title: m.nav_biz_viz_space2(), url: '/business/vizualizace/plocha-2' },
						{ title: m.nav_biz_viz_player(), url: '/business/vizualizace/hrac' },
						{ title: m.nav_biz_viz_season_pass(), url: '/business/vizualizace/permanentka' }
					]
				},
				{ title: m.nav_biz_documents(), url: '/business/dokumenty', icon: FileIcon }
			]
		},
		{
			label: m.nav_biz_reporting(),
			items: [
				{
					title: m.nav_biz_filter(),
					url: '#',
					icon: FunnelIcon,
					items: [
						{ title: m.nav_biz_filter_opportunities(), url: '/business/filtrace/prilezitosti' },
						{ title: m.nav_biz_filter_free_spaces(), url: '/business/filtrace/volne-plochy' },
						{ title: m.nav_biz_filter_occupied(), url: '/business/filtrace/obsazene-plochy' },
						{ title: m.nav_biz_filter_funnel(), url: '/business/filtrace/trychtyr' }
					]
				},
				{
					title: m.nav_analytics(),
					url: '#',
					icon: ChartBarIcon,
					items: [
						{ title: m.nav_biz_analytics_sales_dev(), url: '/business/analytika/vyvoj-prodeje' },
						{ title: m.nav_biz_analytics_by_product(), url: '/business/analytika/dle-produktu' },
						{ title: m.nav_biz_analytics_by_person(), url: '/business/analytika/dle-osob' },
						{ title: m.nav_biz_analytics_success(), url: '/business/analytika/uspesnost' },
						{
							title: m.nav_biz_analytics_opp_count(),
							url: '/business/analytika/pocet-prilezitosti'
						},
						{ title: m.nav_biz_analytics_realized(), url: '/business/analytika/realizovane-akce' },
						{ title: m.nav_biz_analytics_profit_opp(), url: '/business/analytika/zisk' },
						{ title: m.nav_biz_analytics_profit_dev(), url: '/business/analytika/vyvoj-zisku' },
						{ title: m.nav_biz_analytics_invoicing(), url: '/business/analytika/fakturace' },
						{ title: m.nav_manager_report(), url: '/business/analytika/manazersky' }
					]
				}
			]
		},
		{
			items: [
				{ title: m.nav_biz_sales_plan(), url: '/business/obchodni-plan', icon: ClipboardCheckIcon }
			]
		}
	]);
</script>

{#each nav as group, i (i)}
	<NavMain label={group.label} items={group.items} />
{/each}
