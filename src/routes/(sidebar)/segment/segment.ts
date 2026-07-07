import { z } from 'zod';

export const commonSegmentTags = [
	'VIP',
	'VIP GOLD',
	'INVITED',
	'PARTNER',
	'INFLUENCER',
	'INTERNAL',
	'HABARTA TESTUJE',
	'TEST - SMAZAT'
] as const;

export type Segment = {
	id: string;
	name: string;
	description: string;
	tags: string[];
	created_by: string;
	updated_at: Date;
};

export type SegmentFormValues = z.infer<ReturnType<typeof makeSegmentFormSchema>>;

export const SEGMENT_LIMITS = {
	nameMin: 2,
	nameMax: 60,
	descriptionMax: 200,
	maxTags: 10,
	maxSegments: 500
} as const;

const NAME_ALLOWED = /^[\p{L}\p{N}\s\-_./&']+$/u;

export function makeSegmentFormSchema(isNameTaken: (name: string) => boolean) {
	return z
		.object({
			name: z
				.string()
				.min(SEGMENT_LIMITS.nameMin, `Name must be at least ${SEGMENT_LIMITS.nameMin} characters`)
				.max(SEGMENT_LIMITS.nameMax, `Name must be at most ${SEGMENT_LIMITS.nameMax} characters`)
				.regex(NAME_ALLOWED, "Only letters, numbers, spaces and - _ . / & ' are allowed"),
			description: z
				.string()
				.max(
					SEGMENT_LIMITS.descriptionMax,
					`Description must be at most ${SEGMENT_LIMITS.descriptionMax} characters`
				),
			tags: z
				.array(z.string())
				.max(SEGMENT_LIMITS.maxTags, `At most ${SEGMENT_LIMITS.maxTags} tags`)
		})
		.superRefine((data, ctx) => {
			if (isNameTaken(data.name.trim())) {
				ctx.addIssue({
					code: 'custom',
					path: ['name'],
					message: 'A segment with this name already exists'
				});
			}
		});
}
