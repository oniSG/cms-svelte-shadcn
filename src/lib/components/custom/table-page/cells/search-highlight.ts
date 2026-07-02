export const SEARCH_CTX_KEY = Symbol('table-page-search');

export type SearchContext = {
	readonly value: string;
};

export function highlightSegments(
	text: string,
	needle: string
): { text: string; match: boolean }[] {
	if (!needle || !text) return [{ text, match: false }];
	const nlower = needle.toLowerCase();
	if (!nlower) return [{ text, match: false }];
	const lower = text.toLowerCase();
	const segs: { text: string; match: boolean }[] = [];
	let i = 0;
	while (i < text.length) {
		const idx = lower.indexOf(nlower, i);
		if (idx < 0) {
			segs.push({ text: text.slice(i), match: false });
			break;
		}
		if (idx > i) segs.push({ text: text.slice(i, idx), match: false });
		segs.push({ text: text.slice(idx, idx + nlower.length), match: true });
		i = idx + nlower.length;
	}
	return segs;
}
