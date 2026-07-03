import { faker } from '@faker-js/faker';
import type { Tag, TagColor } from '../tag';

faker.seed(20260702);

type Seed = { name: string; color: TagColor };

const SEEDED: Seed[] = [
	{ name: 'Cool Štítek', color: 'slate' },
	{ name: 'Habarta testuje', color: 'red' },
	{ name: 'import 17.4.', color: 'violet' },
	{ name: 'import aktulizane pohl', color: 'orange' },
	{ name: 'import op lukas', color: 'emerald' },
	{ name: 'import test onb 9.4.', color: 'yellow' },
	{ name: 'prezentace', color: 'slate' },
	{ name: 'RBD', color: 'sky' },
	{ name: 'relocation', color: 'red' },
	{ name: 'SEGMENTACE', color: 'slate' },
	{ name: 'Silver', color: 'sky' },
	{ name: 'Stitky v akci', color: 'amber' },
	{ name: 'Test - Lukas', color: 'sky' },
	{ name: 'Test - smazat', color: 'red' },
	{ name: 'VIP', color: 'amber' },
	{ name: 'VIP GOLD', color: 'yellow' },
	{ name: 'INVITED', color: 'violet' },
	{ name: 'PARTNER', color: 'teal' },
	{ name: 'INFLUENCER', color: 'pink' },
	{ name: 'INTERNAL', color: 'slate' },
	{ name: 'onboarding', color: 'lime' },
	{ name: 'churn risk', color: 'red' },
	{ name: 'newsletter opt-in', color: 'emerald' },
	{ name: 'family plan', color: 'sky' },
	{ name: 'student', color: 'teal' },
	{ name: 'senior', color: 'violet' },
	{ name: 'staff', color: 'slate' },
	{ name: 'referral 2026', color: 'orange' },
	{ name: 'blacklist', color: 'red' },
	{ name: 'season 24/25', color: 'amber' },
	{ name: 'season 25/26', color: 'lime' }
];

export const data: Tag[] = SEEDED.map((s, i) => ({
	id: String(2000 + i),
	name: s.name,
	color: s.color,
	active: faker.datatype.boolean({ probability: 0.85 }),
	created_at: faker.date.between({ from: '2023-01-01', to: '2026-06-30' })
}));

let nextId = 2000 + SEEDED.length;

export function addTag(input: { name: string; color: TagColor; active: boolean }): Tag {
	const tag: Tag = {
		id: String(nextId++),
		name: input.name,
		color: input.color,
		active: input.active,
		created_at: new Date()
	};
	data.push(tag);
	return tag;
}

export function updateTag(
	id: string,
	patch: { name: string; color: TagColor; active: boolean }
): Tag | null {
	const i = data.findIndex((t) => t.id === id);
	if (i === -1) return null;
	data[i] = { ...data[i], ...patch };
	return data[i];
}

export function deleteTag(id: string): boolean {
	const i = data.findIndex((t) => t.id === id);
	if (i === -1) return false;
	data.splice(i, 1);
	return true;
}

export function deleteTags(ids: string[]): number {
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
