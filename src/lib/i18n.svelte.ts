import { overwriteGetLocale, localStorageKey, isLocale } from '$lib/paraglide/runtime.js';
import type { Locale } from '$lib/paraglide/runtime.js';

function detectLocale(): Locale {
	if (typeof window === 'undefined') return 'en';
	const stored = localStorage.getItem(localStorageKey);
	if (isLocale(stored)) return stored;
	const browser = navigator.language.slice(0, 2);
	if (isLocale(browser)) return browser;
	return 'en';
}

// Shared reactive locale state — module-level $state is shared across all components
export const localeState = $state({ current: detectLocale() });

// Wire paraglide's getLocale to our reactive state so every m.*() call is reactive
overwriteGetLocale(() => localeState.current);

export function setLocale(locale: Locale): void {
	localeState.current = locale;
	if (typeof window !== 'undefined') {
		localStorage.setItem(localStorageKey, locale);
	}
}
