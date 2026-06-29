export const FAN_ACTION_EDIT_TABS = [
	'basic',
	'settings',
	'email',
	'sms',
	'push',
	'popup',
	'notification-bar'
] as const;

export type FanActionEditTab = (typeof FAN_ACTION_EDIT_TABS)[number];

export function isFanActionEditTab(value: string): value is FanActionEditTab {
	return (FAN_ACTION_EDIT_TABS as readonly string[]).includes(value);
}

export function fanActionEditTabHref(id: number | string, tab: FanActionEditTab) {
	return `/fan-action/${id}/${tab}`;
}
