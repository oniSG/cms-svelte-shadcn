export type Event = {
	id: number;
	event: string;
	label: string[];
	name: string;
	time: Date;
	active: boolean;
};

export const eventListTags = ['VIP-gold', 'VIP-silver', 'normal', 'premium', 'denis'] as const;

export const linkedEventsCatalog = [
	{ id: '2507', name: 'Udalost Lukas 2507', date: '03.01.2026' },
	{ id: '987', name: 'Test Event Zuz Feb', date: '01.02.2026' },
	{ id: '100', name: 'Udalost 100', date: '05.02.2026' },
	{ id: '102', name: 'Udalost 102', date: '05.02.2026' },
	{ id: '98765', name: 'Test Event Zuz Feb2', date: '06.02.2026' },
	{ id: '98766', name: 'Test Event Zuz Feb3', date: '06.02.2026' }
] as const;
