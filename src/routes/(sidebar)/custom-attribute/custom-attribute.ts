import Type from '@lucide/svelte/icons/type';
import Hash from '@lucide/svelte/icons/hash';
import ListChecks from '@lucide/svelte/icons/list-checks';
import CheckSquare from '@lucide/svelte/icons/check-square';
import CalendarDays from '@lucide/svelte/icons/calendar-days';
import AlignLeft from '@lucide/svelte/icons/align-left';
import Image from '@lucide/svelte/icons/image';
import { Braces } from '@lucide/svelte';

export type CustomAttrFieldType =
	| 'SELECT'
	| 'TEXT'
	| 'DATE'
	| 'CHECKBOX'
	| 'LONG_TEXT'
	| 'NUMBER'
	| 'IMAGE_URL'
	| 'INTEGRATION';

export const allFieldTypes: CustomAttrFieldType[] = [
	'SELECT',
	'TEXT',
	'DATE',
	'CHECKBOX',
	'LONG_TEXT',
	'NUMBER',
	'IMAGE_URL',
	'INTEGRATION'
];

export const fieldTypeLabels: Record<CustomAttrFieldType, string> = {
	SELECT: 'Select',
	TEXT: 'Text',
	DATE: 'Date',
	CHECKBOX: 'Checkbox',
	LONG_TEXT: 'Long text',
	NUMBER: 'Number',
	IMAGE_URL: 'Image URL',
	INTEGRATION: 'Integration'
};

export const fieldTypeIcons: Record<CustomAttrFieldType, typeof Type> = {
	SELECT: ListChecks,
	TEXT: Type,
	DATE: CalendarDays,
	CHECKBOX: CheckSquare,
	LONG_TEXT: AlignLeft,
	NUMBER: Hash,
	IMAGE_URL: Image,
	INTEGRATION: Braces
};

export const BASE_FIELD_ELIGIBLE_TYPES: CustomAttrFieldType[] = [
	'TEXT',
	'DATE',
	'LONG_TEXT',
	'CHECKBOX'
];

export const VALIDATION_ELIGIBLE_TYPES: CustomAttrFieldType[] = [
	'TEXT',
	'LONG_TEXT',
	'NUMBER',
	'IMAGE_URL'
];

export type BaseFieldOption = { value: string; label: string };

export const mockBaseFields: BaseFieldOption[] = [
	{ value: 'first_name', label: 'First name' },
	{ value: 'last_name', label: 'Last name' },
	{ value: 'email', label: 'Email' },
	{ value: 'phone', label: 'Phone' },
	{ value: 'date_of_birth', label: 'Date of birth' },
	{ value: 'gender', label: 'Gender' },
	{ value: 'membership_status', label: 'Membership status' },
	{ value: 'join_date', label: 'Join date' },
	{ value: 'marketing_opt_in', label: 'Marketing opt-in' },
	{ value: 'notes', label: 'Notes' }
];

export type CustomAttribute = {
	id: string;
	name: string;
	api_key: string;
	group: CustomAttrGroup;
	field_type: CustomAttrFieldType;
	options: string[] | null;
	default_value: string | null;
	connected_base_field: string | null;
	required: boolean;
	error_message: string | null;
	max_length: number | null;
	max_number: number | null;
	max_url_length: number | null;
	allow_array: boolean;
	allow_object: boolean;
	active: boolean;
	all_clubs: boolean;
	created_at: Date;
	expected_structure: string | null;
};

export function formatDefaultValue(a: CustomAttribute): string {
	if (a.default_value == null || a.default_value === '') return '—';
	if (a.field_type === 'CHECKBOX') return a.default_value === 'true' ? 'Yes' : 'No';
	return a.default_value;
}

// --- limits & validation ---

import { z } from 'zod';

export const CA_LIMITS = {
	nameMin: 2,
	nameMax: 40,
	apiKeyMin: 2,
	apiKeyMax: 40,
	groupMin: 2,
	groupMax: 40,
	defaultValueMax: 200,
	minOptions: 2,
	maxOptions: 20,
	optionMin: 1,
	optionMax: 40,
	maxAttributes: 200,
	errorMessageMax: 140,
	maxLengthCap: 10_000,
	maxNumberCap: Number.MAX_SAFE_INTEGER,
	maxUrlLengthCap: 4096,
	expectedStructureMax: 4000
} as const;

const NAME_ALLOWED = /^[\p{L}\p{N}\s\-_./&']+$/u;
const API_KEY_ALLOWED = /^[a-zA-Z][a-zA-Z0-9_]*$/;

export function makeCAFormSchema(opts: {
	isNameTaken: (name: string) => boolean;
	isApiKeyTaken: (apiKey: string) => boolean;
	isValidGroup: (group: string) => boolean;
}) {
	return z
		.object({
			name: z
				.string()
				.min(CA_LIMITS.nameMin, `Name must be at least ${CA_LIMITS.nameMin} characters`)
				.max(CA_LIMITS.nameMax, `Name must be at most ${CA_LIMITS.nameMax} characters`)
				.regex(NAME_ALLOWED, "Only letters, numbers, spaces and - _ . / & ' are allowed"),
			api_key: z
				.string()
				.min(CA_LIMITS.apiKeyMin, `API key must be at least ${CA_LIMITS.apiKeyMin} characters`)
				.max(CA_LIMITS.apiKeyMax, `API key must be at most ${CA_LIMITS.apiKeyMax} characters`)
				.regex(
					API_KEY_ALLOWED,
					'Must start with a letter and contain only letters, numbers, and underscores'
				),
			group: z.string().min(1, 'Group is required'),
			field_type: z.enum(
				allFieldTypes as unknown as [CustomAttrFieldType, ...CustomAttrFieldType[]]
			),
			connected_base_field: z.string().max(60).optional().default(''),
			options: z
				.array(
					z
						.string()
						.min(CA_LIMITS.optionMin, 'Option cannot be empty')
						.max(CA_LIMITS.optionMax, `Option must be at most ${CA_LIMITS.optionMax} characters`)
				)
				.max(CA_LIMITS.maxOptions, `At most ${CA_LIMITS.maxOptions} options`),
			default_value: z
				.string()
				.max(
					CA_LIMITS.defaultValueMax,
					`Default must be at most ${CA_LIMITS.defaultValueMax} characters`
				),
			required: z.boolean().default(false),
			error_message: z
				.string()
				.max(CA_LIMITS.errorMessageMax, `Error message must be at most ${CA_LIMITS.errorMessageMax} characters`)
				.optional()
				.default(''),
			max_length: z
				.number()
				.int()
				.positive()
				.max(CA_LIMITS.maxLengthCap, `Must be at most ${CA_LIMITS.maxLengthCap}`)
				.optional(),
			max_number: z
				.number()
				.max(CA_LIMITS.maxNumberCap, `Must be at most ${CA_LIMITS.maxNumberCap}`)
				.optional(),
			max_url_length: z
				.number()
				.int()
				.positive()
				.max(CA_LIMITS.maxUrlLengthCap, `Must be at most ${CA_LIMITS.maxUrlLengthCap}`)
				.optional(),
			allow_array: z.boolean().default(false),
			allow_object: z.boolean().default(false),
			expected_structure: z
				.string()
				.max(
					CA_LIMITS.expectedStructureMax,
					`Must be at most ${CA_LIMITS.expectedStructureMax} characters`
				)
				.optional()
				.default(''),
			active: z.boolean(),
			all_clubs: z.boolean()
		})
		.superRefine((data, ctx) => {
			if (opts.isNameTaken(data.name.trim())) {
				ctx.addIssue({
					code: 'custom',
					path: ['name'],
					message: 'A custom field with this name already exists'
				});
			}
			if (opts.isApiKeyTaken(data.api_key.trim())) {
				ctx.addIssue({
					code: 'custom',
					path: ['api_key'],
					message: 'A custom field with this API key already exists'
				});
			}
			if (!opts.isValidGroup(data.group)) {
				ctx.addIssue({
					code: 'custom',
					path: ['group'],
					message: 'Pick a group from the list or create a new one'
				});
			}
			if (data.field_type === 'SELECT') {
				if (data.options.length < CA_LIMITS.minOptions) {
					ctx.addIssue({
						code: 'custom',
						path: ['options'],
						message: `Select fields need at least ${CA_LIMITS.minOptions} options`
					});
				}
				const seen = new Set<string>();
				for (const opt of data.options) {
					const key = opt.trim().toLowerCase();
					if (seen.has(key)) {
						ctx.addIssue({
							code: 'custom',
							path: ['options'],
							message: 'Options must be unique'
						});
						break;
					}
					seen.add(key);
				}
			}
			if (data.field_type === 'CHECKBOX' && data.default_value) {
				if (data.default_value !== 'true' && data.default_value !== 'false') {
					ctx.addIssue({
						code: 'custom',
						path: ['default_value'],
						message: 'Checkbox default must be "true" or "false"'
					});
				}
			}
			if (data.field_type === 'NUMBER' && data.default_value) {
				if (Number.isNaN(Number(data.default_value))) {
					ctx.addIssue({
						code: 'custom',
						path: ['default_value'],
						message: 'Number default must be a valid number'
					});
				}
			}
			if (data.field_type === 'SELECT' && data.default_value) {
				if (!data.options.includes(data.default_value)) {
					ctx.addIssue({
						code: 'custom',
						path: ['default_value'],
						message: 'Default must be one of the options'
					});
				}
			}
		});
}

export type CAFormValues = z.infer<ReturnType<typeof makeCAFormSchema>>;

export type ApiIntegration = {
	id: string;
	endpoint: string;
	method: 'GET' | 'POST' | 'PUT' | 'DELETE';
	headers: Record<string, string>;
};

export const mockApiIntegrations: ApiIntegration[] = [
	{
		id: 'int_1',
		endpoint: '/api/v1/members/sync',
		method: 'GET',
		headers: { Authorization: 'Bearer ...' }
	},
	{
		id: 'int_2',
		endpoint: '/api/v1/invoices/create',
		method: 'POST',
		headers: { Authorization: 'Bearer ...', 'Content-Type': 'application/json' }
	},
	{
		id: 'int_3',
		endpoint: '/api/v1/members/{id}',
		method: 'PUT',
		headers: { Authorization: 'Bearer ...' }
	}
];