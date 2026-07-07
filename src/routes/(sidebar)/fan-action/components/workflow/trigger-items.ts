import type { Component } from 'svelte';
import ShoppingCart from '@lucide/svelte/icons/shopping-cart';
import Package from '@lucide/svelte/icons/package';
import LogIn from '@lucide/svelte/icons/log-in';
import CircleMinus from '@lucide/svelte/icons/circle-minus';
import RefreshCw from '@lucide/svelte/icons/refresh-cw';
import Frown from '@lucide/svelte/icons/frown';
import UserX from '@lucide/svelte/icons/user-x';
import CircleX from '@lucide/svelte/icons/circle-x';
import ArrowLeftRight from '@lucide/svelte/icons/arrow-left-right';
import Gift from '@lucide/svelte/icons/gift';
import Wallet from '@lucide/svelte/icons/wallet';
import UserCheck from '@lucide/svelte/icons/user-check';
import Phone from '@lucide/svelte/icons/phone';
import CircleCheck from '@lucide/svelte/icons/circle-check';
import MonitorUp from '@lucide/svelte/icons/monitor-up';
import Smartphone from '@lucide/svelte/icons/smartphone';
import Star from '@lucide/svelte/icons/star';
import Award from '@lucide/svelte/icons/award';
import UserPlus from '@lucide/svelte/icons/user-plus';
import FileText from '@lucide/svelte/icons/file-text';
import UserPen from '@lucide/svelte/icons/user-pen';
import Table from '@lucide/svelte/icons/table';
import ChevronsRight from '@lucide/svelte/icons/chevrons-right';
import CalendarClock from '@lucide/svelte/icons/calendar-clock';
import CalendarDays from '@lucide/svelte/icons/calendar-days';
import type { WorkflowPaletteItem } from './types';
import * as m from '$lib/paraglide/messages.js';

export type WorkflowTriggerCategory =
	| 'common'
	| 'time'
	| 'ticketing'
	| 'eshop'
	| 'call-center'
	| 'mobile-app'
	| 'other';

export type WorkflowTriggerDefinition = {
	id: string;
	icon: Component;
	iconModifier?: string;
	label: () => string;
	description: () => string;
	drawerTitle?: () => string;
	incomplete?: boolean;
};

export const workflowTriggerDefinitions: WorkflowTriggerDefinition[] = [
	{
		id: 'start-now',
		icon: ChevronsRight,
		label: m.fan_action_flow_trigger_start_now,
		description: m.fan_action_flow_trigger_start_now_desc,
		drawerTitle: m.fan_action_flow_trigger_start_now
	},
	{
		id: 'scheduled-sending',
		icon: CalendarClock,
		label: m.fan_action_flow_trigger_scheduled_sending,
		description: m.fan_action_flow_trigger_scheduled_sending_desc,
		drawerTitle: m.fan_action_flow_trigger_scheduled_sending,
		incomplete: true
	},
	{
		id: 'exact-date',
		icon: CalendarDays,
		label: m.fan_action_flow_trigger_exact_date,
		description: m.fan_action_flow_trigger_exact_date_desc,
		drawerTitle: m.fan_action_flow_trigger_exact_date,
		incomplete: true
	},
	{
		id: 'event-date-occurs',
		icon: CalendarDays,
		label: m.fan_action_flow_trigger_event_date_occurs,
		description: m.fan_action_flow_trigger_event_date_occurs_desc,
		drawerTitle: m.fan_action_flow_trigger_event_date_occurs,
		incomplete: true
	},
	{
		id: 'ticket-purchase',
		icon: ShoppingCart,
		label: m.fan_action_flow_trigger_ticket_purchase,
		description: m.fan_action_flow_trigger_ticket_purchase_desc,
		drawerTitle: m.fan_action_flow_trigger_ticket_purchase,
		incomplete: true
	},
	{
		id: 'time-slot-purchase',
		icon: ShoppingCart,
		label: m.fan_action_flow_trigger_time_slot_purchase,
		description: m.fan_action_flow_trigger_time_slot_purchase_desc
	},
	{
		id: 'season-ticket-purchase',
		icon: ShoppingCart,
		label: m.fan_action_flow_trigger_season_ticket_purchase,
		description: m.fan_action_flow_trigger_season_ticket_purchase_desc
	},
	{
		id: 'event-entry',
		icon: LogIn,
		label: m.fan_action_flow_trigger_event_entry,
		description: m.fan_action_flow_trigger_event_entry_desc,
		drawerTitle: m.fan_action_flow_trigger_event_entry,
		incomplete: true
	},
	{
		id: 'ticket-cancellation',
		icon: CircleMinus,
		label: m.fan_action_flow_trigger_ticket_cancellation,
		description: m.fan_action_flow_trigger_ticket_cancellation_desc
	},
	{
		id: 'season-ticket-cancellation',
		icon: CircleMinus,
		label: m.fan_action_flow_trigger_season_ticket_cancellation,
		description: m.fan_action_flow_trigger_season_ticket_cancellation_desc
	},
	{
		id: 'ticket-barcode-change',
		icon: RefreshCw,
		label: m.fan_action_flow_trigger_ticket_barcode_change,
		description: m.fan_action_flow_trigger_ticket_barcode_change_desc
	},
	{
		id: 'season-ticket-barcode-change',
		icon: RefreshCw,
		label: m.fan_action_flow_trigger_season_ticket_barcode_change,
		description: m.fan_action_flow_trigger_season_ticket_barcode_change_desc
	},
	{
		id: 'cart-auto-emptied',
		icon: Frown,
		label: m.fan_action_flow_trigger_cart_auto_emptied,
		description: m.fan_action_flow_trigger_cart_auto_emptied_desc,
		drawerTitle: m.fan_action_flow_trigger_cart_auto_emptied,
		incomplete: true
	},
	{
		id: 'membership-purchased',
		icon: ShoppingCart,
		label: m.fan_action_flow_trigger_membership_purchased,
		description: m.fan_action_flow_trigger_membership_purchased_desc
	},
	{
		id: 'specific-membership-purchase',
		icon: ShoppingCart,
		label: m.fan_action_flow_trigger_specific_membership_purchase,
		description: m.fan_action_flow_trigger_specific_membership_purchase_desc,
		drawerTitle: m.fan_action_flow_trigger_specific_membership_purchase,
		incomplete: true
	},
	{
		id: 'membership-cancelled',
		icon: UserX,
		label: m.fan_action_flow_trigger_membership_cancelled,
		description: m.fan_action_flow_trigger_membership_cancelled_desc
	},
	{
		id: 'membership-payment-failed',
		icon: CircleX,
		label: m.fan_action_flow_trigger_membership_payment_failed,
		description: m.fan_action_flow_trigger_membership_payment_failed_desc
	},
	{
		id: 'season-ticket-transfer',
		icon: ArrowLeftRight,
		label: m.fan_action_flow_trigger_season_ticket_transfer,
		description: m.fan_action_flow_trigger_season_ticket_transfer_desc
	},
	{
		id: 'ticket-transfer',
		icon: ArrowLeftRight,
		label: m.fan_action_flow_trigger_ticket_transfer,
		description: m.fan_action_flow_trigger_ticket_transfer_desc,
		drawerTitle: m.fan_action_flow_trigger_ticket_transfer,
		incomplete: true
	},
	{
		id: 'membership-transfer',
		icon: ArrowLeftRight,
		label: m.fan_action_flow_trigger_membership_transfer,
		description: m.fan_action_flow_trigger_membership_transfer_desc
	},
	{
		id: 'season-ticket-release',
		icon: Gift,
		label: m.fan_action_flow_trigger_season_ticket_release,
		description: m.fan_action_flow_trigger_season_ticket_release_desc,
		drawerTitle: m.fan_action_flow_trigger_season_ticket_release,
		incomplete: true
	},
	{
		id: 'season-ticket-forward',
		icon: Gift,
		label: m.fan_action_flow_trigger_season_ticket_forward,
		description: m.fan_action_flow_trigger_season_ticket_forward_desc,
		drawerTitle: m.fan_action_flow_trigger_season_ticket_forward,
		incomplete: true
	},
	{
		id: 'membership-recurring-payment',
		icon: Wallet,
		label: m.fan_action_flow_trigger_membership_recurring_payment,
		description: m.fan_action_flow_trigger_membership_recurring_payment_desc
	},
	{
		id: 'membership-status-change',
		icon: UserCheck,
		label: m.fan_action_flow_trigger_membership_status_change,
		description: m.fan_action_flow_trigger_membership_status_change_desc,
		drawerTitle: m.fan_action_flow_trigger_membership_status_change,
		incomplete: true
	},
	{
		id: 'season-ticket-bulk-forward',
		icon: Gift,
		label: m.fan_action_flow_trigger_season_ticket_bulk_forward,
		description: m.fan_action_flow_trigger_season_ticket_bulk_forward_desc,
		drawerTitle: m.fan_action_flow_trigger_season_ticket_bulk_forward,
		incomplete: true
	},
	{
		id: 'eshop-purchase',
		icon: ShoppingCart,
		label: m.fan_action_flow_trigger_eshop_purchase,
		description: m.fan_action_flow_trigger_eshop_purchase_desc
	},
	{
		id: 'package-purchase',
		icon: Package,
		label: m.fan_action_flow_trigger_package_purchase,
		description: m.fan_action_flow_trigger_package_purchase_desc
	},
	{
		id: 'order-cancellation',
		icon: CircleMinus,
		label: m.fan_action_flow_trigger_order_cancellation,
		description: m.fan_action_flow_trigger_order_cancellation_desc
	},
	{
		id: 'support-call',
		icon: Phone,
		label: m.fan_action_flow_trigger_support_call,
		description: m.fan_action_flow_trigger_support_call_desc
	},
	{
		id: 'push-notifications-enabled',
		icon: CircleCheck,
		label: m.fan_action_flow_trigger_push_notifications_enabled,
		description: m.fan_action_flow_trigger_push_notifications_enabled_desc
	},
	{
		id: 'app-login-open',
		icon: LogIn,
		label: m.fan_action_flow_trigger_app_login_open,
		description: m.fan_action_flow_trigger_app_login_open_desc
	},
	{
		id: 'cube-message-sent',
		icon: MonitorUp,
		label: m.fan_action_flow_trigger_cube_message_sent,
		description: m.fan_action_flow_trigger_cube_message_sent_desc
	},
	{
		id: 'bulletin-opened',
		icon: Smartphone,
		label: m.fan_action_flow_trigger_bulletin_opened,
		description: m.fan_action_flow_trigger_bulletin_opened_desc
	},
	{
		id: 'credit-top-up',
		icon: Wallet,
		label: m.fan_action_flow_trigger_credit_top_up,
		description: m.fan_action_flow_trigger_credit_top_up_desc
	},
	{
		id: 'loyalty-points-added',
		icon: Star,
		iconModifier: 'fill-current',
		label: m.fan_action_flow_trigger_loyalty_points_added,
		description: m.fan_action_flow_trigger_loyalty_points_added_desc
	},
	{
		id: 'loyalty-points-by-type',
		icon: Star,
		iconModifier: 'fill-current',
		label: m.fan_action_flow_trigger_loyalty_points_by_type,
		description: m.fan_action_flow_trigger_loyalty_points_by_type_desc,
		drawerTitle: m.fan_action_flow_trigger_loyalty_points_by_type,
		incomplete: true
	},
	{
		id: 'loyalty-points-reached',
		icon: Award,
		label: m.fan_action_flow_trigger_loyalty_points_reached,
		description: m.fan_action_flow_trigger_loyalty_points_reached_desc,
		drawerTitle: m.fan_action_flow_trigger_loyalty_points_reached,
		incomplete: true
	},
	{
		id: 'id-registration',
		icon: UserPlus,
		label: m.fan_action_flow_trigger_id_registration,
		description: m.fan_action_flow_trigger_id_registration_desc
	},
	{
		id: 'newsletter-subscription',
		icon: UserPlus,
		label: m.fan_action_flow_trigger_newsletter_subscription,
		description: m.fan_action_flow_trigger_newsletter_subscription_desc
	},
	{
		id: 'questionnaire-completed',
		icon: FileText,
		label: m.fan_action_flow_trigger_questionnaire_completed,
		description: m.fan_action_flow_trigger_questionnaire_completed_desc,
		drawerTitle: m.fan_action_flow_trigger_questionnaire_completed,
		incomplete: true
	},
	{
		id: 'data-change',
		icon: UserPen,
		label: m.fan_action_flow_trigger_data_change,
		description: m.fan_action_flow_trigger_data_change_desc,
		drawerTitle: m.fan_action_flow_trigger_data_change,
		incomplete: true
	},
	{
		id: 'form-completed',
		icon: Table,
		label: m.fan_action_flow_trigger_form_completed,
		description: m.fan_action_flow_trigger_form_completed_desc,
		drawerTitle: m.fan_action_flow_trigger_form_completed,
		incomplete: true
	}
];

export const workflowTriggerCategoryOrder = [
	'common',
	'time',
	'ticketing',
	'eshop',
	'call-center',
	'mobile-app',
	'other'
] as const satisfies readonly WorkflowTriggerCategory[];

export const workflowTriggerCategories: ReadonlyArray<{
	id: WorkflowTriggerCategory;
	label: () => string;
}> = [
	{ id: 'common', label: m.fan_action_flow_trigger_category_common },
	{ id: 'time', label: m.fan_action_flow_trigger_category_time },
	{ id: 'ticketing', label: m.fan_action_flow_trigger_category_ticketing },
	{ id: 'eshop', label: m.fan_action_flow_trigger_category_eshop },
	{ id: 'call-center', label: m.fan_action_flow_trigger_category_call_center },
	{ id: 'mobile-app', label: m.fan_action_flow_trigger_category_mobile_app },
	{ id: 'other', label: m.fan_action_flow_trigger_category_other }
];

const triggerCategoryById = {
	'start-now': 'common',
	'ticket-purchase': 'common',
	'event-entry': 'common',
	'eshop-purchase': 'common',
	'newsletter-subscription': 'common',
	'id-registration': 'common',
	'scheduled-sending': 'time',
	'exact-date': 'time',
	'event-date-occurs': 'time',
	'time-slot-purchase': 'ticketing',
	'season-ticket-purchase': 'ticketing',
	'ticket-cancellation': 'ticketing',
	'season-ticket-cancellation': 'ticketing',
	'ticket-barcode-change': 'ticketing',
	'season-ticket-barcode-change': 'ticketing',
	'cart-auto-emptied': 'ticketing',
	'membership-purchased': 'ticketing',
	'specific-membership-purchase': 'ticketing',
	'membership-cancelled': 'ticketing',
	'membership-payment-failed': 'ticketing',
	'season-ticket-transfer': 'ticketing',
	'ticket-transfer': 'ticketing',
	'membership-transfer': 'ticketing',
	'season-ticket-release': 'ticketing',
	'season-ticket-forward': 'ticketing',
	'membership-recurring-payment': 'ticketing',
	'membership-status-change': 'ticketing',
	'season-ticket-bulk-forward': 'ticketing',
	'package-purchase': 'eshop',
	'order-cancellation': 'eshop',
	'support-call': 'call-center',
	'push-notifications-enabled': 'mobile-app',
	'app-login-open': 'mobile-app',
	'cube-message-sent': 'mobile-app',
	'bulletin-opened': 'mobile-app',
	'credit-top-up': 'other',
	'loyalty-points-added': 'other',
	'loyalty-points-by-type': 'other',
	'loyalty-points-reached': 'other',
	'questionnaire-completed': 'other',
	'data-change': 'other',
	'form-completed': 'other'
} as const satisfies Record<string, WorkflowTriggerCategory>;

export type WorkflowTriggerPaletteGroup = {
	id: WorkflowTriggerCategory;
	label: string;
	items: WorkflowPaletteItem[];
};

export function workflowTriggerPaletteGroups(): WorkflowTriggerPaletteGroup[] {
	const itemsByCategory = new Map<WorkflowTriggerCategory, WorkflowPaletteItem[]>(
		workflowTriggerCategoryOrder.map((category) => [category, []])
	);

	for (const trigger of workflowTriggerDefinitions) {
		const category = triggerCategoryById[trigger.id as keyof typeof triggerCategoryById];
		if (!category) continue;
		itemsByCategory.get(category)?.push({
			id: trigger.id,
			variant: 'trigger',
			incomplete: trigger.incomplete
		});
	}

	return workflowTriggerCategories
		.map((category) => ({
			id: category.id,
			label: category.label(),
			items: itemsByCategory.get(category.id) ?? []
		}))
		.filter((group) => group.items.length > 0);
}

const triggerById = new Map(workflowTriggerDefinitions.map((trigger) => [trigger.id, trigger]));

export function workflowTriggerDefinition(itemId: string): WorkflowTriggerDefinition | undefined {
	return triggerById.get(itemId);
}
