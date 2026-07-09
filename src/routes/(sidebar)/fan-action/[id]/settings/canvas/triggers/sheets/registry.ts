import type { Component } from 'svelte';
import type { WorkflowDrawerContentProps } from '../../../shared/types';
import ScheduledSendingSheetContent from './scheduled-sending.svelte';
import LoyaltyPointsByTypeSheetContent from './loyalty-points-by-type.svelte';
import TicketPurchaseSheetContent from './ticket-purchase.svelte';
import EventEntrySheetContent from './event-entry.svelte';
import ExactDateSheetContent from './exact-date.svelte';
import EventDateOccursSheetContent from './event-date-occurs.svelte';
import CartAutoEmptiedSheetContent from './cart-auto-emptied.svelte';
import SpecificMembershipPurchaseSheetContent from './specific-membership-purchase.svelte';
import TicketTransferSheetContent from './ticket-transfer.svelte';
import SeasonTicketReleaseSheetContent from './season-ticket-release.svelte';
import SeasonTicketForwardSheetContent from './season-ticket-forward.svelte';
import MembershipStatusChangeSheetContent from './membership-status-change.svelte';
import SeasonTicketBulkForwardSheetContent from './season-ticket-bulk-forward.svelte';
import LoyaltyPointsReachedSheetContent from './loyalty-points-reached.svelte';
import QuestionnaireCompletedSheetContent from './questionnaire-completed.svelte';
import DataChangeSheetContent from './data-change.svelte';
import FormCompletedSheetContent from './form-completed.svelte';

export const triggerSheetRegistry: Record<string, Component<WorkflowDrawerContentProps>> = {
	'scheduled-sending': ScheduledSendingSheetContent,
	'loyalty-points-by-type': LoyaltyPointsByTypeSheetContent,
	'ticket-purchase': TicketPurchaseSheetContent,
	'event-entry': EventEntrySheetContent,
	'exact-date': ExactDateSheetContent,
	'event-date-occurs': EventDateOccursSheetContent,
	'cart-auto-emptied': CartAutoEmptiedSheetContent,
	'specific-membership-purchase': SpecificMembershipPurchaseSheetContent,
	'ticket-transfer': TicketTransferSheetContent,
	'season-ticket-release': SeasonTicketReleaseSheetContent,
	'season-ticket-forward': SeasonTicketForwardSheetContent,
	'membership-status-change': MembershipStatusChangeSheetContent,
	'season-ticket-bulk-forward': SeasonTicketBulkForwardSheetContent,
	'loyalty-points-reached': LoyaltyPointsReachedSheetContent,
	'questionnaire-completed': QuestionnaireCompletedSheetContent,
	'data-change': DataChangeSheetContent,
	'form-completed': FormCompletedSheetContent
};
