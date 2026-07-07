import { faker } from '@faker-js/faker';
import { commonTemplateTags, type Template } from '../template';

faker.seed(20260708);

type Seed = {
	name: string;
	description: string;
	tags: string[];
	created_by: string;
	active?: boolean;
	archived?: boolean;
	auto_save?: boolean;
};

const SEEDED: Seed[] = [
	{
		name: 'pupupuuu sablona test',
		description: 'testovaci sablona',
		tags: ['TEST - SMAZAT'],
		created_by: 'Kisilenko Veronika'
	},
	{
		name: 'test prekladyyy (1)',
		description: 'test zuza',
		tags: ['TEST - ZUZA'],
		created_by: 'Kirkwood Zuzana'
	},
	{
		name: 'test prekladyyy',
		description: 'test zuza',
		tags: ['TEST - ZUZA'],
		created_by: 'Kirkwood Zuzana'
	},
	{
		name: 'preklady',
		description: 'zuza test',
		tags: ['TEST - ZUZA'],
		created_by: 'Kirkwood Zuzana'
	},
	{ name: 'Poznání', description: '', tags: [], created_by: 'Kulhánková Amálie' },
	{ name: 'test překlad', description: 'test', tags: [], created_by: 'Bartoš Lukáš' },
	{ name: 'test', description: 'test', tags: [], created_by: 'Bartoš Lukáš' },
	{
		name: 'Hell Yeah šablona',
		description: 'Hell Yeah',
		tags: ['COOL ŠTÍTEK'],
		created_by: 'Zaoral Denis'
	},
	{
		name: 'Test link package',
		description: 'test',
		tags: ['TEST - SMAZAT'],
		created_by: 'Kirkwood Zuzana'
	},
	{ name: 'test 1', description: 'dddd', tags: [], created_by: 'Korytář Petr' },
	{
		name: 'Onboarding welcome',
		description: 'Welcome email for new visitors',
		tags: ['ONBOARDING'],
		created_by: 'Kirkwood Zuzana',
		auto_save: true
	},
	{
		name: 'VIP birthday',
		description: 'Birthday greeting for VIPs',
		tags: ['VIP'],
		created_by: 'Habarta Luboš'
	},
	{
		name: 'Season announcement',
		description: 'Upcoming season overview',
		tags: [],
		created_by: 'Zaoral Denis'
	},
	{
		name: 'Match day recap',
		description: 'Post-match summary email',
		tags: [],
		created_by: 'Bartoš Lukáš'
	},
	{
		name: 'GDPR renewal',
		description: 'Consent renewal template',
		tags: ['INTERNAL'],
		created_by: 'Kisilenko Veronika',
		active: false
	},
	{
		name: 'Referral thanks',
		description: 'Thanks for referring a friend',
		tags: [],
		created_by: 'Kulhánková Amálie'
	},
	{
		name: 'Ticket confirmation',
		description: 'Auto-sent after purchase',
		tags: [],
		created_by: 'Kirkwood Zuzana',
		auto_save: true
	},
	{
		name: 'Old newsletter template',
		description: 'Legacy newsletter — replaced by 2026 version.',
		tags: ['INTERNAL'],
		created_by: 'Habarta Luboš',
		archived: true,
		active: false
	},
	{
		name: 'Q1 campaign',
		description: 'First quarter campaign copy',
		tags: ['ONBOARDING'],
		created_by: 'Zaoral Denis',
		archived: true
	},
	{
		name: 'Broken template — do not use',
		description: 'DEPRECATED — replaced by "Onboarding welcome".',
		tags: ['TEST - SMAZAT'],
		created_by: 'Kirkwood Zuzana',
		archived: true,
		active: false
	}
];

export const data: Template[] = SEEDED.map((s, i) => ({
	id: String(4000 + i),
	name: s.name,
	description: s.description,
	tags: s.tags,
	created_by: s.created_by,
	created_at: faker.date.between({ from: '2026-01-01', to: '2026-07-01' }),
	active: s.active ?? true,
	archived: s.archived ?? false,
	auto_save: s.auto_save ?? faker.datatype.boolean({ probability: 0.3 }),
	auto_translate: false
}));

let nextId = 4000 + SEEDED.length;

export function addTemplate(input: {
	name: string;
	description: string;
	tags: string[];
	active: boolean;
	auto_save: boolean;
	auto_translate: boolean;
}): Template {
	const t: Template = {
		id: String(nextId++),
		name: input.name,
		description: input.description,
		tags: input.tags,
		created_by: 'You',
		created_at: new Date(),
		active: input.active,
		archived: false,
		auto_save: input.auto_save,
		auto_translate: input.auto_translate
	};
	data.unshift(t);
	return t;
}

export function updateTemplate(
	id: string,
	patch: {
		name: string;
		description: string;
		tags: string[];
		active: boolean;
		auto_save: boolean;
		auto_translate: boolean;
	}
): Template | null {
	const i = data.findIndex((t) => t.id === id);
	if (i === -1) return null;
	data[i] = { ...data[i], ...patch };
	return data[i];
}

export function setArchived(id: string, archived: boolean): Template | null {
	const i = data.findIndex((t) => t.id === id);
	if (i === -1) return null;
	data[i] = { ...data[i], archived };
	return data[i];
}

export function deleteTemplate(id: string): boolean {
	const i = data.findIndex((t) => t.id === id);
	if (i === -1) return false;
	data.splice(i, 1);
	return true;
}

export function deleteTemplates(ids: string[]): number {
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

export { commonTemplateTags };
