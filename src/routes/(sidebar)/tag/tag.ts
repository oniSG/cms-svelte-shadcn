export type TagColor =
	| 'slate'
	| 'red'
	| 'orange'
	| 'amber'
	| 'yellow'
	| 'lime'
	| 'emerald'
	| 'teal'
	| 'sky'
	| 'violet'
	| 'pink';

export const allColors: TagColor[] = [
	'slate',
	'red',
	'orange',
	'amber',
	'yellow',
	'lime',
	'emerald',
	'teal',
	'sky',
	'violet',
	'pink'
];

export const colorLabels: Record<TagColor, string> = {
	slate: 'Slate',
	red: 'Red',
	orange: 'Orange',
	amber: 'Amber',
	yellow: 'Yellow',
	lime: 'Lime',
	emerald: 'Emerald',
	teal: 'Teal',
	sky: 'Sky',
	violet: 'Violet',
	pink: 'Pink'
};

export const colorClasses: Record<TagColor, string> = {
	slate:
		'bg-slate-700/85 text-slate-50 border-slate-700/85 dark:bg-slate-600 dark:border-slate-500',
	red: 'bg-red-500/15 text-red-700 border-red-500/40 dark:text-red-300 dark:border-red-500/40',
	orange:
		'bg-orange-500/20 text-orange-700 border-orange-500/40 dark:text-orange-300 dark:border-orange-500/40',
	amber:
		'bg-amber-500/25 text-amber-800 border-amber-500/50 dark:text-amber-200 dark:border-amber-500/40',
	yellow:
		'bg-yellow-300/50 text-yellow-900 border-yellow-500/40 dark:text-yellow-200 dark:border-yellow-500/40',
	lime: 'bg-lime-500/25 text-lime-800 border-lime-600/40 dark:text-lime-200 dark:border-lime-500/40',
	emerald:
		'bg-emerald-500/20 text-emerald-800 border-emerald-500/40 dark:text-emerald-200 dark:border-emerald-500/40',
	teal: 'bg-teal-500/20 text-teal-800 border-teal-500/40 dark:text-teal-200 dark:border-teal-500/40',
	sky: 'bg-sky-500/20 text-sky-800 border-sky-500/40 dark:text-sky-200 dark:border-sky-500/40',
	violet:
		'bg-violet-500/20 text-violet-800 border-violet-500/40 dark:text-violet-200 dark:border-violet-500/40',
	pink: 'bg-pink-500/20 text-pink-800 border-pink-500/40 dark:text-pink-200 dark:border-pink-500/40'
};

export type Tag = {
	id: string;
	name: string;
	color: TagColor;
	active: boolean;
	created_at: Date;
};

// --- limits & validation ---

import { z } from 'zod';

export const TAG_LIMITS = {
	nameMin: 2,
	nameMax: 16,
	maxTags: 100
} as const;

const NAME_ALLOWED = /^[\p{L}\p{N}\s\-_./&']+$/u;

export function makeTagFormSchema(isNameTaken: (name: string) => boolean) {
	return z
		.object({
			name: z
				.string()
				.min(TAG_LIMITS.nameMin, `Name must be at least ${TAG_LIMITS.nameMin} characters`)
				.max(TAG_LIMITS.nameMax, `Name must be at most ${TAG_LIMITS.nameMax} characters`)
				.regex(NAME_ALLOWED, "Only letters, numbers, spaces and - _ . / & ' are allowed"),
			color: z.enum(allColors as unknown as [TagColor, ...TagColor[]]),
			active: z.boolean()
		})
		.superRefine((data, ctx) => {
			if (isNameTaken(data.name.trim())) {
				ctx.addIssue({
					code: 'custom',
					path: ['name'],
					message: 'A tag with this name already exists'
				});
			}
		});
}

export type TagFormValues = z.infer<ReturnType<typeof makeTagFormSchema>>;
