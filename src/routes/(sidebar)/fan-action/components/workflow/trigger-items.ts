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
import * as m from '$lib/paraglide/messages.js';

export type WorkflowTriggerCategory = 'ticketing' | 'eshop' | 'call-center' | 'mobile-app' | 'other';

export type WorkflowTriggerDefinition = {
	id: string;
	category: WorkflowTriggerCategory;
	icon: Component;
	iconModifier?: string;
	label: () => string;
	description: () => string;
};

export const workflowTriggerCategories: ReadonlyArray<{
	id: WorkflowTriggerCategory;
	label: () => string;
}> = [
	{ id: 'ticketing', label: m.fan_action_flow_category_ticketing },
	{ id: 'eshop', label: m.fan_action_flow_category_eshop },
	{ id: 'call-center', label: m.fan_action_flow_category_call_center },
	{ id: 'mobile-app', label: m.fan_action_flow_category_mobile_app },
	{ id: 'other', label: m.fan_action_flow_category_other }
];

export const workflowTriggerDefinitions: WorkflowTriggerDefinition[] = [
	{
		id: 'ticket-purchase',
		category: 'ticketing',
		icon: ShoppingCart,
		label: m.fan_action_flow_trigger_ticket_purchase,
		description: m.fan_action_flow_trigger_ticket_purchase_desc
	},
	{
		id: 'time-slot-purchase',
		category: 'ticketing',
		icon: ShoppingCart,
		label: m.fan_action_flow_trigger_time_slot_purchase,
		description: m.fan_action_flow_trigger_time_slot_purchase_desc
	},
	{
		id: 'season-ticket-purchase',
		category: 'ticketing',
		icon: ShoppingCart,
		label: m.fan_action_flow_trigger_season_ticket_purchase,
		description: m.fan_action_flow_trigger_season_ticket_purchase_desc
	},
	{
		id: 'event-entry',
		category: 'ticketing',
		icon: LogIn,
		label: m.fan_action_flow_trigger_event_entry,
		description: m.fan_action_flow_trigger_event_entry_desc
	},
	{
		id: 'ticket-cancellation',
		category: 'ticketing',
		icon: CircleMinus,
		label: m.fan_action_flow_trigger_ticket_cancellation,
		description: m.fan_action_flow_trigger_ticket_cancellation_desc
	},
	{
		id: 'season-ticket-cancellation',
		category: 'ticketing',
		icon: CircleMinus,
		label: m.fan_action_flow_trigger_season_ticket_cancellation,
		description: m.fan_action_flow_trigger_season_ticket_cancellation_desc
	},
	{
		id: 'ticket-barcode-change',
		category: 'ticketing',
		icon: RefreshCw,
		label: m.fan_action_flow_trigger_ticket_barcode_change,
		description: m.fan_action_flow_trigger_ticket_barcode_change_desc
	},
	{
		id: 'season-ticket-barcode-change',
		category: 'ticketing',
		icon: RefreshCw,
		label: m.fan_action_flow_trigger_season_ticket_barcode_change,
		description: m.fan_action_flow_trigger_season_ticket_barcode_change_desc
	},
	{
		id: 'cart-auto-emptied',
		category: 'ticketing',
		icon: Frown,
		label: m.fan_action_flow_trigger_cart_auto_emptied,
		description: m.fan_action_flow_trigger_cart_auto_emptied_desc
	},
	{
		id: 'membership-purchased',
		category: 'ticketing',
		icon: ShoppingCart,
		label: m.fan_action_flow_trigger_membership_purchased,
		description: m.fan_action_flow_trigger_membership_purchased_desc
	},
	{
		id: 'specific-membership-purchase',
		category: 'ticketing',
		icon: ShoppingCart,
		label: m.fan_action_flow_trigger_specific_membership_purchase,
		description: m.fan_action_flow_trigger_specific_membership_purchase_desc
	},
	{
		id: 'membership-cancelled',
		category: 'ticketing',
		icon: UserX,
		label: m.fan_action_flow_trigger_membership_cancelled,
		description: m.fan_action_flow_trigger_membership_cancelled_desc
	},
	{
		id: 'membership-payment-failed',
		category: 'ticketing',
		icon: CircleX,
		label: m.fan_action_flow_trigger_membership_payment_failed,
		description: m.fan_action_flow_trigger_membership_payment_failed_desc
	},
	{
		id: 'season-ticket-transfer',
		category: 'ticketing',
		icon: ArrowLeftRight,
		label: m.fan_action_flow_trigger_season_ticket_transfer,
		description: m.fan_action_flow_trigger_season_ticket_transfer_desc
	},
	{
		id: 'ticket-transfer',
		category: 'ticketing',
		icon: ArrowLeftRight,
		label: m.fan_action_flow_trigger_ticket_transfer,
		description: m.fan_action_flow_trigger_ticket_transfer_desc
	},
	{
		id: 'membership-transfer',
		category: 'ticketing',
		icon: ArrowLeftRight,
		label: m.fan_action_flow_trigger_membership_transfer,
		description: m.fan_action_flow_trigger_membership_transfer_desc
	},
	{
		id: 'season-ticket-release',
		category: 'ticketing',
		icon: Gift,
		label: m.fan_action_flow_trigger_season_ticket_release,
		description: m.fan_action_flow_trigger_season_ticket_release_desc
	},
	{
		id: 'season-ticket-forward',
		category: 'ticketing',
		icon: Gift,
		label: m.fan_action_flow_trigger_season_ticket_forward,
		description: m.fan_action_flow_trigger_season_ticket_forward_desc
	},
	{
		id: 'membership-recurring-payment',
		category: 'ticketing',
		icon: Wallet,
		label: m.fan_action_flow_trigger_membership_recurring_payment,
		description: m.fan_action_flow_trigger_membership_recurring_payment_desc
	},
	{
		id: 'membership-status-change',
		category: 'ticketing',
		icon: UserCheck,
		label: m.fan_action_flow_trigger_membership_status_change,
		description: m.fan_action_flow_trigger_membership_status_change_desc
	},
	{
		id: 'season-ticket-bulk-forward',
		category: 'ticketing',
		icon: Gift,
		label: m.fan_action_flow_trigger_season_ticket_bulk_forward,
		description: m.fan_action_flow_trigger_season_ticket_bulk_forward_desc
	},
	{
		id: 'eshop-purchase',
		category: 'eshop',
		icon: ShoppingCart,
		label: m.fan_action_flow_trigger_eshop_purchase,
		description: m.fan_action_flow_trigger_eshop_purchase_desc
	},
	{
		id: 'package-purchase',
		category: 'eshop',
		icon: Package,
		label: m.fan_action_flow_trigger_package_purchase,
		description: m.fan_action_flow_trigger_package_purchase_desc
	},
	{
		id: 'order-cancellation',
		category: 'eshop',
		icon: CircleMinus,
		label: m.fan_action_flow_trigger_order_cancellation,
		description: m.fan_action_flow_trigger_order_cancellation_desc
	},
	{
		id: 'support-call',
		category: 'call-center',
		icon: Phone,
		label: m.fan_action_flow_trigger_support_call,
		description: m.fan_action_flow_trigger_support_call_desc
	},
	{
		id: 'push-notifications-enabled',
		category: 'mobile-app',
		icon: CircleCheck,
		label: m.fan_action_flow_trigger_push_notifications_enabled,
		description: m.fan_action_flow_trigger_push_notifications_enabled_desc
	},
	{
		id: 'app-login-open',
		category: 'mobile-app',
		icon: LogIn,
		label: m.fan_action_flow_trigger_app_login_open,
		description: m.fan_action_flow_trigger_app_login_open_desc
	},
	{
		id: 'cube-message-sent',
		category: 'mobile-app',
		icon: MonitorUp,
		label: m.fan_action_flow_trigger_cube_message_sent,
		description: m.fan_action_flow_trigger_cube_message_sent_desc
	},
	{
		id: 'bulletin-opened',
		category: 'mobile-app',
		icon: Smartphone,
		label: m.fan_action_flow_trigger_bulletin_opened,
		description: m.fan_action_flow_trigger_bulletin_opened_desc
	},
	{
		id: 'credit-top-up',
		category: 'other',
		icon: Wallet,
		label: m.fan_action_flow_trigger_credit_top_up,
		description: m.fan_action_flow_trigger_credit_top_up_desc
	},
	{
		id: 'loyalty-points-added',
		category: 'other',
		icon: Star,
		iconModifier: 'fill-current',
		label: m.fan_action_flow_trigger_loyalty_points_added,
		description: m.fan_action_flow_trigger_loyalty_points_added_desc
	},
	{
		id: 'loyalty-points-by-type',
		category: 'other',
		icon: Star,
		iconModifier: 'fill-current',
		label: m.fan_action_flow_trigger_loyalty_points_by_type,
		description: m.fan_action_flow_trigger_loyalty_points_by_type_desc
	},
	{
		id: 'loyalty-points-reached',
		category: 'other',
		icon: Award,
		label: m.fan_action_flow_trigger_loyalty_points_reached,
		description: m.fan_action_flow_trigger_loyalty_points_reached_desc
	},
	{
		id: 'id-registration',
		category: 'other',
		icon: UserPlus,
		label: m.fan_action_flow_trigger_id_registration,
		description: m.fan_action_flow_trigger_id_registration_desc
	},
	{
		id: 'newsletter-subscription',
		category: 'other',
		icon: UserPlus,
		label: m.fan_action_flow_trigger_newsletter_subscription,
		description: m.fan_action_flow_trigger_newsletter_subscription_desc
	},
	{
		id: 'questionnaire-completed',
		category: 'other',
		icon: FileText,
		label: m.fan_action_flow_trigger_questionnaire_completed,
		description: m.fan_action_flow_trigger_questionnaire_completed_desc
	},
	{
		id: 'data-change',
		category: 'other',
		icon: UserPen,
		label: m.fan_action_flow_trigger_data_change,
		description: m.fan_action_flow_trigger_data_change_desc
	},
	{
		id: 'form-completed',
		category: 'other',
		icon: Table,
		label: m.fan_action_flow_trigger_form_completed,
		description: m.fan_action_flow_trigger_form_completed_desc
	}
];

const triggerById = new Map(workflowTriggerDefinitions.map((trigger) => [trigger.id, trigger]));

export function workflowTriggerDefinition(itemId: string): WorkflowTriggerDefinition | undefined {
	return triggerById.get(itemId);
}

export function workflowTriggerPaletteGroups() {
	return workflowTriggerCategories
		.map((category) => ({
			id: category.id,
			label: category.label(),
			triggers: workflowTriggerDefinitions.filter((trigger) => trigger.category === category.id)
		}))
		.filter((group) => group.triggers.length > 0);
}
