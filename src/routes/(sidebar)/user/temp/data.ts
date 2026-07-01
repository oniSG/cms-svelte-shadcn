import { faker } from '@faker-js/faker';
import { allTags, type Tag, type User } from '../user';

faker.seed(20260629);

function pickTags(): Tag[] {
	const n = faker.helpers.weightedArrayElement([
		{ value: 0, weight: 4 },
		{ value: 1, weight: 2 },
		{ value: 2, weight: 1 }
	]);
	return faker.helpers.arrayElements(allTags, n);
}

export const data: User[] = Array.from({ length: 48 }, (_, i) => {
	const first_name = faker.person.firstName();
	const surname = faker.person.lastName();
	return {
		id: `usr-${String(i + 1).padStart(3, '0')}`,
		surname,
		first_name,
		email: faker.internet
			.email({ firstName: first_name, lastName: surname, provider: 'deepvision.cz' })
			.toLowerCase(),
		phone:
			faker.helpers.maybe(() => faker.phone.number({ style: 'international' }), {
				probability: 0.45
			}) ?? null,
		tags: pickTags(),
		last_activity: faker.date.recent({ days: 90 }),
		active: faker.datatype.boolean({ probability: 0.82 }),
		two_fa: faker.datatype.boolean({ probability: 0.6 })
	};
});
