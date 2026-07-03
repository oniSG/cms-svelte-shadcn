export const DEFAULT_SECTIONS = [
	'Default section',
	'Profile',
	'Medical',
	'Membership',
	'Communication',
	'Billing'
] as const;

export const sectionsState = $state<{ list: string[] }>({
	list: [...DEFAULT_SECTIONS]
});

export function hasSection(name: string): boolean {
	const target = name.trim().toLowerCase();
	return sectionsState.list.some((s) => s.trim().toLowerCase() === target);
}

export function addSection(name: string): string | null {
	const trimmed = name.trim();
	if (!trimmed) return null;
	if (hasSection(trimmed)) return null;
	sectionsState.list = [...sectionsState.list, trimmed];
	return trimmed;
}

export function removeSection(name: string): boolean {
	const before = sectionsState.list.length;
	sectionsState.list = sectionsState.list.filter((s) => s !== name);
	return sectionsState.list.length < before;
}
