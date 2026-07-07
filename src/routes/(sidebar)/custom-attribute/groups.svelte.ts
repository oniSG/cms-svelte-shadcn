export const DEFAULT_GROUPS = [
	'Default group',
	'Profile',
	'Medical',
	'Membership',
	'Communication',
	'Billing'
] as const;

export const groupsState = $state<{ list: string[] }>({
	list: [...DEFAULT_GROUPS]
});

export function hasGroup(name: string): boolean {
	const target = name.trim().toLowerCase();
	return groupsState.list.some((s) => s.trim().toLowerCase() === target);
}

export function addGroup(name: string): string | null {
	const trimmed = name.trim();
	if (!trimmed) return null;
	if (hasGroup(trimmed)) return null;
	groupsState.list = [...groupsState.list, trimmed];
	return trimmed;
}

export function removeGroup(name: string): boolean {
	const before = groupsState.list.length;
	groupsState.list = groupsState.list.filter((s) => s !== name);
	return groupsState.list.length < before;
}

export function renameGroup(oldName: string, newName: string): boolean {
	const trimmed = newName.trim();
	if (!trimmed) return false;
	const idx = groupsState.list.findIndex((s) => s === oldName);
	if (idx === -1) return false;
	if (oldName === trimmed) return true;
	const target = trimmed.toLowerCase();
	const collision = groupsState.list.some((s, i) => i !== idx && s.trim().toLowerCase() === target);
	if (collision) return false;
	const next = [...groupsState.list];
	next[idx] = trimmed;
	groupsState.list = next;
	return true;
}
