import * as m from '$lib/paraglide/messages.js';
import type { Module, NavGroup } from '$lib/types/sidebar';
import BookUserIcon from '@lucide/svelte/icons/book-user';
import BriefcaseIcon from '@lucide/svelte/icons/briefcase';
import CalendarIcon from '@lucide/svelte/icons/calendar';
import CalendarDaysIcon from '@lucide/svelte/icons/calendar-days';
import ChartBarIcon from '@lucide/svelte/icons/chart-bar';
import ClipboardCheckIcon from '@lucide/svelte/icons/clipboard-check';
import ClipboardListIcon from '@lucide/svelte/icons/clipboard-list';
import DollarSignIcon from '@lucide/svelte/icons/dollar-sign';
import FileIcon from '@lucide/svelte/icons/file';
import FileTextIcon from '@lucide/svelte/icons/file-text';
import LayersIcon from '@lucide/svelte/icons/layers';
import LayoutDashboardIcon from '@lucide/svelte/icons/layout-dashboard';
import MonitorIcon from '@lucide/svelte/icons/monitor';
import Settings2Icon from '@lucide/svelte/icons/settings-2';
import ShieldIcon from '@lucide/svelte/icons/shield';
import StarIcon from '@lucide/svelte/icons/star';
import TargetIcon from '@lucide/svelte/icons/target';
import TvIcon from '@lucide/svelte/icons/tv';
import UsersIcon from '@lucide/svelte/icons/users';
import WaypointsIcon from '@lucide/svelte/icons/waypoints';
import ZapIcon from '@lucide/svelte/icons/zap';

export function fansNav(): NavGroup[] {
	return [
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
	];
}

export function businessNav(): NavGroup[] {
	return [
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
	];
}

export function settingsNav(): NavGroup[] {
	return [
		{
			items: [
				{
					title: m.nav_set_general(),
					url: '#',
					icon: Settings2Icon,
					items: [
						{ title: m.nav_set_tags(), url: '/tag' },
						{ title: m.nav_set_currencies(), url: '/currency' },
						{ title: m.nav_set_companies(), url: '/company' },
						{ title: m.nav_set_seasons(), url: '/season' }
					]
				},
				{
					title: m.nav_set_biz_group(),
					url: '#',
					icon: BriefcaseIcon,
					items: [
						{ title: m.nav_set_biz_opp_states(), url: '/business-case-state' },
						{ title: m.nav_set_biz_opp_types(), url: '/business-case-type' },
						{ title: m.nav_set_biz_offer_states(), url: '/offer-state' },
						{ title: m.nav_set_biz_ad_states(), url: '/advertising-space-item-state' },
						{ title: m.nav_set_biz_settings(), url: '/business-settings' },
						{ title: m.nav_set_biz_email_assistant(), url: '/mail-assistant' },
						{ title: m.nav_set_biz_contact_types(), url: '/contact-person-types' }
					]
				},
				{
					title: m.nav_set_fans_settings(),
					url: '#',
					icon: StarIcon,
					items: [
						{ title: m.nav_set_fans_newsletter_form(), url: '/newsletter' },
						{ title: m.nav_set_fans_loyalty(), url: '/touchpoint' },
						{ title: m.nav_set_fans_custom_font(), url: '/custom-font' },
						{ title: m.nav_set_fans_custom_block(), url: '/custom-block' },
						{ title: m.nav_set_fans_sending_domains(), url: '/sending-domain' },
						{ title: m.nav_set_fans_domain_prefix(), url: '/sending-domain-prefix' },
						{ title: m.nav_set_fans_reply_email(), url: '/email-for-reply' },
						{ title: m.nav_set_fans_custom_visitor_field(), url: '/custom-attribute' },
						{ title: m.nav_set_fans_waitlist(), url: '/waiting-list' },
						{ title: m.nav_set_fans_gdpr_texts(), url: '/gdpr-texts' },
						{ title: m.nav_set_fans_send_frequency(), url: '/frequency-cap' }
					]
				},
				{
					title: m.nav_set_users_access(),
					url: '#',
					icon: UsersIcon,
					items: [
						{ title: m.nav_set_user_masks(), url: '/privilege' },
						{ title: m.nav_set_user_groups(), url: '/user-group' },
						{ title: m.nav_set_users(), url: '/user' }
					]
				},
				{
					title: m.nav_set_security_logs(),
					url: '#',
					icon: ShieldIcon,
					items: [
						{ title: m.nav_set_security(), url: '/settings/security' },
						{ title: m.nav_set_logs(), url: '/log' }
					]
				}
			]
		}
	];
}

function pathMatches(itemUrl: string, currentPath: string): boolean {
	if (!itemUrl || itemUrl === '#') return false;
	if (itemUrl === currentPath) return true;
	return currentPath.startsWith(itemUrl + '/');
}

const moduleNavBuilders: Record<Module, () => NavGroup[]> = {
	fans: fansNav,
	business: businessNav,
	settings: settingsNav
};

export function getModuleForPath(pathname: string): Module | null {
	for (const moduleId of Object.keys(moduleNavBuilders) as Module[]) {
		const groups = moduleNavBuilders[moduleId]();
		for (const group of groups) {
			for (const item of group.items) {
				if (pathMatches(item.url, pathname)) return moduleId;
				if (item.items?.some((sub) => pathMatches(sub.url, pathname))) return moduleId;
			}
		}
	}
	return null;
}

export function markActive(groups: NavGroup[], pathname: string): NavGroup[] {
	return groups.map((group) => ({
		...group,
		items: group.items.map((item) => {
			if (item.items && item.items.length > 0) {
				const markedSubs = item.items.map((sub) => ({
					...sub,
					isActive: pathMatches(sub.url, pathname)
				}));
				return {
					...item,
					items: markedSubs,
					isActive: markedSubs.some((s) => s.isActive)
				};
			}
			return { ...item, isActive: pathMatches(item.url, pathname) };
		})
	}));
}
