import { z } from 'zod';

export const commonTemplateTags = [
	'TEST - SMAZAT',
	'TEST - ZUZA',
	'COOL ŠTÍTEK',
	'HABARTA TESTUJE',
	'VIP',
	'INTERNAL',
	'ONBOARDING'
] as const;

export type Template = {
	id: string;
	name: string;
	description: string;
	tags: string[];
	created_by: string;
	created_at: Date;
	active: boolean;
	archived: boolean;
	auto_save: boolean;
	auto_translate: boolean;
};

export type TemplateFormValues = z.infer<ReturnType<typeof makeTemplateFormSchema>>;

export const TEMPLATE_LIMITS = {
	nameMin: 2,
	nameMax: 60,
	descriptionMax: 200,
	maxTags: 10,
	maxTemplates: 1000
} as const;

const NAME_ALLOWED = /^[\p{L}\p{N}\s\-_./&']+$/u;

export function makeTemplateFormSchema(isNameTaken: (name: string) => boolean) {
	return z
		.object({
			name: z
				.string()
				.min(TEMPLATE_LIMITS.nameMin, `Name must be at least ${TEMPLATE_LIMITS.nameMin} characters`)
				.max(TEMPLATE_LIMITS.nameMax, `Name must be at most ${TEMPLATE_LIMITS.nameMax} characters`)
				.regex(NAME_ALLOWED, "Only letters, numbers, spaces and - _ . / & ' are allowed"),
			description: z
				.string()
				.max(
					TEMPLATE_LIMITS.descriptionMax,
					`Description must be at most ${TEMPLATE_LIMITS.descriptionMax} characters`
				),
			tags: z
				.array(z.string())
				.max(TEMPLATE_LIMITS.maxTags, `At most ${TEMPLATE_LIMITS.maxTags} tags`),
			active: z.boolean(),
			auto_save: z.boolean(),
			auto_translate: z.boolean()
		})
		.superRefine((data, ctx) => {
			if (isNameTaken(data.name.trim())) {
				ctx.addIssue({
					code: 'custom',
					path: ['name'],
					message: 'A template with this name already exists'
				});
			}
		});
}
