import type { Component } from 'svelte';
import type { WorkflowDrawerContentProps } from '../../types';
import ScheduledSendingDrawerContent from './scheduled-sending.svelte';
import LoyaltyPointsByTypeDrawerContent from './loyalty-points-by-type.svelte';
import TicketPurchaseDrawerContent from './ticket-purchase.svelte';
import EventEntryDrawerContent from './event-entry.svelte';
import ExactDateDrawerContent from './exact-date.svelte';
import EventDateOccursDrawerContent from './event-date-occurs.svelte';
import CartAutoEmptiedDrawerContent from './cart-auto-emptied.svelte';
import SpecificMembershipPurchaseDrawerContent from './specific-membership-purchase.svelte';
import TicketTransferDrawerContent from './ticket-transfer.svelte';
import SeasonTicketReleaseDrawerContent from './season-ticket-release.svelte';
import SeasonTicketForwardDrawerContent from './season-ticket-forward.svelte';
import MembershipStatusChangeDrawerContent from './membership-status-change.svelte';
import SeasonTicketBulkForwardDrawerContent from './season-ticket-bulk-forward.svelte';
import LoyaltyPointsReachedDrawerContent from './loyalty-points-reached.svelte';
import QuestionnaireCompletedDrawerContent from './questionnaire-completed.svelte';
import DataChangeDrawerContent from './data-change.svelte';
import FormCompletedDrawerContent from './form-completed.svelte';

/** Triggers with custom drawer UI (forms, settings). Info-only triggers use auto-fallback in registry.ts. */
export const triggerDrawerRegistry: Record<string, Component<WorkflowDrawerContentProps>> = {
	'scheduled-sending': ScheduledSendingDrawerContent,
	'loyalty-points-by-type': LoyaltyPointsByTypeDrawerContent,
	'ticket-purchase': TicketPurchaseDrawerContent,
	'event-entry': EventEntryDrawerContent,
	'exact-date': ExactDateDrawerContent,
	'event-date-occurs': EventDateOccursDrawerContent,
	'cart-auto-emptied': CartAutoEmptiedDrawerContent,
	'specific-membership-purchase': SpecificMembershipPurchaseDrawerContent,
	'ticket-transfer': TicketTransferDrawerContent,
	'season-ticket-release': SeasonTicketReleaseDrawerContent,
	'season-ticket-forward': SeasonTicketForwardDrawerContent,
	'membership-status-change': MembershipStatusChangeDrawerContent,
	'season-ticket-bulk-forward': SeasonTicketBulkForwardDrawerContent,
	'loyalty-points-reached': LoyaltyPointsReachedDrawerContent,
	'questionnaire-completed': QuestionnaireCompletedDrawerContent,
	'data-change': DataChangeDrawerContent,
	'form-completed': FormCompletedDrawerContent
};
