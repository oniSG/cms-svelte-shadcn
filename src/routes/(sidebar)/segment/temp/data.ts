import { faker } from '@faker-js/faker';
import { commonSegmentTags, type Segment } from '../segment';

faker.seed(20260707);

type Seed = {
	name: string;
	tags: string[];
	description: string;
	created_by: string;
};

const SEEDED: Seed[] = [
	{ name: 'ZTP Denisovo', tags: [], description: 'ztpeeeeeee', created_by: 'Zaoral Denis' },
	{ name: 'ZTP 4', tags: [], description: 'sdagg', created_by: 'Kirkwood Zuzana' },
	{ name: 'ZTP 3', tags: [], description: 'sdagg', created_by: 'Kirkwood Zuzana' },
	{ name: 'ZTP 2', tags: [], description: 'sdagg', created_by: 'Kirkwood Zuzana' },
	{
		name: 'seznamovani nika heh',
		tags: ['TEST - SMAZAT'],
		description: 'test test task',
		created_by: 'Kisilenko Veronika'
	},
	{
		name: 'nika testik',
		tags: ['TEST - SMAZAT'],
		description: 'test test test',
		created_by: 'Kisilenko Veronika'
	},
	{ name: 'ZTP 1', tags: [], description: 'sdagg', created_by: 'Kirkwood Zuzana' },
	{
		name: 'habarta+test',
		tags: ['HABARTA TESTUJE'],
		description: 'test',
		created_by: 'Habarta Luboš'
	},
	{ name: 'relátko', tags: [], description: '', created_by: 'Kulhánková Amálie' },
	{ name: 'ztp', tags: [], description: 'test', created_by: 'Bartoš Lukáš' },
	{
		name: 'test fronty',
		tags: ['TEST - SMAZAT'],
		description: 'test',
		created_by: 'Kirkwood Zuzana'
	},
	{
		name: 'nikca testovani',
		tags: ['TEST - SMAZAT'],
		description: 'test testovaci test test',
		created_by: 'Kisilenko Veronika'
	},
	{
		name: 'Test segment dupliciti',
		tags: [],
		description: 'avadbadbd',
		created_by: 'Kirkwood Zuzana'
	},
	{ name: 'dfadsfdas', tags: [], description: 'dafsdf', created_by: 'Kirkwood Zuzana' },
	{
		name: 'Test tag',
		tags: ['HABARTA TESTUJE'],
		description: 'test',
		created_by: 'Habarta Luboš'
	},
	{
		name: 'VIP visitors — 2026',
		tags: ['VIP', 'VIP GOLD'],
		description: 'Top-tier visitors identified in the 2026 season.',
		created_by: 'Kirkwood Zuzana'
	},
	{
		name: 'Newsletter opt-ins',
		tags: ['INVITED'],
		description: 'Visitors that consented to receive the club newsletter.',
		created_by: 'Habarta Luboš'
	},
	{
		name: 'Partner audience',
		tags: ['PARTNER'],
		description: 'Contacts brought in via partner integrations.',
		created_by: 'Bartoš Lukáš'
	},
	{
		name: 'Influencer roster',
		tags: ['INFLUENCER'],
		description: 'Public-facing personalities we collaborate with.',
		created_by: 'Kulhánková Amálie'
	},
	{
		name: 'Internal QA cohort',
		tags: ['INTERNAL'],
		description: 'Employees used for pre-release testing.',
		created_by: 'Kisilenko Veronika'
	},
	{
		name: 'Churn risk',
		tags: [],
		description: 'Visitors with dropping engagement — deserve outreach.',
		created_by: 'Zaoral Denis'
	},
	{
		name: 'Season 25/26 buyers',
		tags: [],
		description: 'Anyone who bought at least one ticket this season.',
		created_by: 'Kirkwood Zuzana'
	},
	{
		name: 'Family plan',
		tags: [],
		description: 'Family-tier subscriptions.',
		created_by: 'Habarta Luboš'
	},
	{
		name: 'Legacy import cleanup',
		tags: ['TEST - SMAZAT'],
		description: 'Old ETL import — needs review.',
		created_by: 'Bartoš Lukáš'
	},
	{
		name: 'Prague — hot leads',
		tags: [],
		description: 'Prague-area contacts with recent purchases.',
		created_by: 'Kirkwood Zuzana'
	},
	{ name: 'Empty draft', tags: [], description: '', created_by: 'Kulhánková Amálie' }
];

export const data: Segment[] = SEEDED.map((s, i) => ({
	id: String(3000 + i),
	name: s.name,
	description: s.description,
	tags: s.tags,
	created_by: s.created_by,
	updated_at: faker.date.between({ from: '2026-04-01', to: '2026-07-07' })
}));

let nextId = 3000 + SEEDED.length;

export function addSegment(input: { name: string; description: string; tags: string[] }): Segment {
	const seg: Segment = {
		id: String(nextId++),
		name: input.name,
		description: input.description,
		tags: input.tags,
		created_by: 'You',
		updated_at: new Date()
	};
	data.unshift(seg);
	return seg;
}

export function updateSegment(
	id: string,
	patch: { name: string; description: string; tags: string[] }
): Segment | null {
	const i = data.findIndex((s) => s.id === id);
	if (i === -1) return null;
	data[i] = { ...data[i], ...patch, updated_at: new Date() };
	return data[i];
}

export function deleteSegment(id: string): boolean {
	const i = data.findIndex((s) => s.id === id);
	if (i === -1) return false;
	data.splice(i, 1);
	return true;
}

export function deleteSegments(ids: string[]): number {
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

export { commonSegmentTags };
