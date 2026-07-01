const palette = [
	'bg-sky-500/15 text-sky-700 dark:text-sky-300 border-sky-500/30',
	'bg-orange-500/15 text-orange-700 dark:text-orange-300 border-orange-500/30',
	'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30',
	'bg-violet-500/15 text-violet-700 dark:text-violet-300 border-violet-500/30',
	'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30',
	'bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/30',
	'bg-teal-500/15 text-teal-700 dark:text-teal-300 border-teal-500/30',
	'bg-fuchsia-500/15 text-fuchsia-700 dark:text-fuchsia-300 border-fuchsia-500/30'
];

export function tagColorClass(tag: string): string {
	let hash = 0;
	for (let i = 0; i < tag.length; i++) hash = (hash * 31 + tag.charCodeAt(i)) | 0;
	return palette[Math.abs(hash) % palette.length];
}
