export const FAN_ACTION_EDIT_TABS = ['settings', 'stats'] as const;

export type FanActionEditTab = (typeof FAN_ACTION_EDIT_TABS)[number];

export function fanActionEditTabHref(
	id: number | string,
	tab: FanActionEditTab
): `/fan-action/${string}/${FanActionEditTab}` {
	return `/fan-action/${id}/${tab}`;
}
