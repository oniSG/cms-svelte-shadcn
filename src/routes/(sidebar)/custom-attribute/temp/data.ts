import { faker } from '@faker-js/faker';
import type { CustomAttrFieldType, CustomAttrSection, CustomAttribute } from '../custom-attribute';
import { DEFAULT_SECTIONS } from '../sections.svelte.js';

faker.seed(20260702);

const NAMES: string[] = [
	'medicalRecords',
	'dietaryRestrictions',
	'emergencyContact',
	'tshirtSize',
	'favoriteColor',
	'birthMonth',
	'referralSource',
	'socialMediaHandle',
	'membershipLevel',
	'receiptId',
	'hasCompanionAnimal',
	'notificationsOptIn',
	'allergies',
	'subscribedNewsletter',
	'homeCity',
	'employer',
	'jobTitle',
	'taxId',
	'passportNumber',
	'driversLicenseId',
	'nickname',
	'portraitUrl',
	'avatarUrl',
	'crmContactId',
	'billingAddress',
	'vipTier',
	'preferredLanguage',
	'gender',
	'shoeSize',
	'height',
	'weight',
	'trainerName',
	'consentSignedAt',
	'accessCardId',
	'bankAccount',
	'invoiceEmail',
	'companyName',
	'internalNotes',
	'lockerNumber',
	'jerseyNumber',
	'position',
	'seasonPassNumber',
	'renewalDate',
	'salesRepId',
	'partnerCode',
	'discountEligible',
	'preferredSeat',
	'stripeCustomerId',
	'mailchimpTag',
	'hubspotContactId'
];

const SELECT_OPTIONS: Record<string, string[]> = {
	tshirtSize: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
	shoeSize: ['38', '39', '40', '41', '42', '43', '44', '45', '46'],
	favoriteColor: ['Red', 'Green', 'Blue', 'Yellow', 'Black', 'White'],
	referralSource: ['Google', 'Friend', 'Instagram', 'Newsletter', 'Event'],
	membershipLevel: ['Bronze', 'Silver', 'Gold', 'Platinum'],
	preferredLanguage: ['English', 'Czech', 'German', 'Slovak'],
	gender: ['Male', 'Female', 'Other', 'Prefer not to say'],
	position: ['Goalkeeper', 'Defender', 'Midfielder', 'Forward'],
	vipTier: ['Standard', 'Silver', 'Gold', 'Diamond']
};

function pickFieldTypeFor(name: string): CustomAttrFieldType {
	if (SELECT_OPTIONS[name]) return 'SELECT';
	if (name.endsWith('Url')) return 'IMAGE_URL';
	if (name.endsWith('Id') || name.endsWith('ContactId') || name === 'mailchimpTag')
		return 'INTEGRATION';
	if (name.endsWith('At') || name.endsWith('Date') || name === 'birthMonth') return 'DATE';
	if (
		name.startsWith('has') ||
		name.startsWith('subscribed') ||
		name.startsWith('notifications') ||
		name.startsWith('discount')
	)
		return 'CHECKBOX';
	if (name === 'height' || name === 'weight' || name === 'lockerNumber' || name === 'jerseyNumber')
		return 'NUMBER';
	if (name === 'medicalRecords' || name === 'internalNotes' || name === 'allergies')
		return 'LONG_TEXT';
	return 'TEXT';
}

function defaultValueFor(type: CustomAttrFieldType, options: string[] | null): string | null {
	if (type === 'CHECKBOX') return faker.datatype.boolean({ probability: 0.5 }) ? 'true' : 'false';
	if (type === 'SELECT' && options && options.length > 0) {
		return (
			faker.helpers.maybe(() => faker.helpers.arrayElement(options), { probability: 0.4 }) ?? null
		);
	}
	if (type === 'NUMBER')
		return (
			faker.helpers.maybe(() => String(faker.number.int({ min: 0, max: 100 })), {
				probability: 0.4
			}) ?? null
		);
	if (type === 'DATE')
		return (
			faker.helpers.maybe(
				() =>
					faker.date.between({ from: '2024-01-01', to: '2026-06-30' }).toISOString().slice(0, 10),
				{ probability: 0.3 }
			) ?? null
		);
	if (type === 'TEXT' || type === 'LONG_TEXT')
		return (
			faker.helpers.maybe(() => faker.lorem.words({ min: 1, max: 4 }), { probability: 0.2 }) ?? null
		);
	if (type === 'IMAGE_URL')
		return faker.helpers.maybe(() => faker.image.avatar(), { probability: 0.3 }) ?? null;
	return null;
}

function pickSection(): CustomAttrSection {
	return faker.helpers.weightedArrayElement([
		{ value: DEFAULT_SECTIONS[0], weight: 6 },
		{ value: DEFAULT_SECTIONS[1], weight: 4 },
		{ value: DEFAULT_SECTIONS[2], weight: 2 },
		{ value: DEFAULT_SECTIONS[3], weight: 3 },
		{ value: DEFAULT_SECTIONS[4], weight: 2 },
		{ value: DEFAULT_SECTIONS[5], weight: 2 }
	]);
}

export const data: CustomAttribute[] = NAMES.map((name, i) => {
	const field_type = pickFieldTypeFor(name);
	const options = field_type === 'SELECT' ? (SELECT_OPTIONS[name] ?? null) : null;
	return {
		id: String(1000 + i),
		name,
		api_key: name,
		section: pickSection(),
		field_type,
		options,
		default_value: defaultValueFor(field_type, options),
		active: faker.datatype.boolean({ probability: 0.75 }),
		all_clubs: faker.datatype.boolean({ probability: 0.35 }),
		created_at: faker.date.between({ from: '2024-06-01', to: '2026-06-30' })
	};
});

let nextId = 1000 + NAMES.length;

type CAInput = {
	name: string;
	api_key: string;
	section: CustomAttrSection;
	field_type: CustomAttrFieldType;
	options: string[];
	default_value: string;
	active: boolean;
	all_clubs: boolean;
};

function shape(input: CAInput): Omit<CustomAttribute, 'id' | 'created_at'> {
	return {
		name: input.name,
		api_key: input.api_key,
		section: input.section,
		field_type: input.field_type,
		options: input.field_type === 'SELECT' ? input.options : null,
		default_value: input.default_value ? input.default_value : null,
		active: input.active,
		all_clubs: input.all_clubs
	};
}

export function addCA(input: CAInput): CustomAttribute {
	const attr: CustomAttribute = {
		id: String(nextId++),
		...shape(input),
		created_at: new Date()
	};
	data.push(attr);
	return attr;
}

export function updateCA(id: string, patch: CAInput): CustomAttribute | null {
	const i = data.findIndex((a) => a.id === id);
	if (i === -1) return null;
	data[i] = { ...data[i], ...shape(patch) };
	return data[i];
}

export function deleteCA(id: string): boolean {
	const i = data.findIndex((a) => a.id === id);
	if (i === -1) return false;
	data.splice(i, 1);
	return true;
}

export function deleteCAs(ids: string[]): number {
	const set = new Set(ids);
	let removed = 0;
	for (let i = data.length - 1; i >= 0; i--) {
		if (set.has(data[i].id)) {
			data.splice(i, 1);
			removed++;
		}
	}
	return removed;
}

export function countBySection(section: string): number {
	return data.reduce((n, a) => (a.section === section ? n + 1 : n), 0);
}
