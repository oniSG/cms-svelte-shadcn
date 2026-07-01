import { faker } from '@faker-js/faker';
import { allTags, type Fan, type FanTag, type RegistrationSource } from '../fan';

faker.seed(20260629);

function pickTags(): FanTag[] {
	const n = faker.helpers.weightedArrayElement([
		{ value: 0, weight: 5 },
		{ value: 1, weight: 3 },
		{ value: 2, weight: 1 }
	]);
	return faker.helpers.arrayElements(allTags, n);
}

function pickSource(): RegistrationSource {
	return faker.helpers.weightedArrayElement([
		{ value: 'TICKETING', weight: 6 },
		{ value: 'ONEID', weight: 4 },
		{ value: 'WEB_FORM', weight: 3 },
		{ value: 'INTERNAL', weight: 2 },
		{ value: 'BUSINESS', weight: 2 },
		{ value: 'IMPORT', weight: 1 }
	]);
}

const partners = [
	'Apple Czech s.r.o.',
	'Beta Technologies a.s.',
	'DEEP VISION s.r.o.',
	'Relatoo Holding',
	'CzechFan Group'
];

export const data: Fan[] = Array.from({ length: 96 }, () => {
	const first_name = faker.person.firstName();
	const surname = faker.person.lastName();
	const source = pickSource();
	return {
		id: String(faker.number.int({ min: 1, max: 9_999_999 })),
		surname,
		first_name,
		email: faker.internet
			.email({ firstName: first_name, lastName: surname, provider: 'deepvision.cz' })
			.toLowerCase(),
		phone:
			faker.helpers.maybe(() => faker.phone.number({ style: 'international' }), {
				probability: 0.7
			}) ?? null,
		city: faker.helpers.maybe(() => faker.location.city(), { probability: 0.55 }) ?? null,
		tags: pickTags(),
		date_added: faker.date.between({ from: '2025-01-01', to: '2026-06-29' }),
		registration_source: source,
		partner:
			source === 'BUSINESS' || source === 'TICKETING' ? faker.helpers.arrayElement(partners) : null,
		segment_match: faker.datatype.boolean({ probability: 0.65 })
	};
});
