export type TablePreferences = {
	searchFields?: string[];
	hiddenShortcuts?: string[];
	limit?: number | 'all';
	columnVisibility?: Record<string, boolean>;
	columnOrder?: string[];
	columnSizing?: Record<string, number>;
};

const PREFIX = 'tablepage:';

function isBrowser(): boolean {
	return typeof window !== 'undefined';
}

export function loadPreferences(queryKey: string): TablePreferences {
	if (!isBrowser()) return {};
	try {
		const raw = window.localStorage.getItem(PREFIX + queryKey);
		if (!raw) return {};
		const parsed = JSON.parse(raw);
		return parsed && typeof parsed === 'object' ? (parsed as TablePreferences) : {};
	} catch {
		return {};
	}
}

export function patchPreferences(queryKey: string, patch: Partial<TablePreferences>): void {
	if (!isBrowser()) return;
	try {
		const merged: TablePreferences = { ...loadPreferences(queryKey), ...patch };
		if (patch.limit !== undefined) {
			merged.limit = Number.isFinite(patch.limit as number) ? (patch.limit as number) : 'all';
		}
		window.localStorage.setItem(PREFIX + queryKey, JSON.stringify(merged));
	} catch {
		// ignore quota / private-mode errors
	}
}

export function decodeStoredLimit(stored: number | 'all' | undefined): number | undefined {
	if (stored === undefined) return undefined;
	if (stored === 'all') return Infinity;
	return stored;
}
