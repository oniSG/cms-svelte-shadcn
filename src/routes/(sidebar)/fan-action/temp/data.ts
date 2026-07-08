import type { FanAction } from '$lib/types/fan-action.js';

export const data: FanAction[] = [
	{
		id: 1,
		event: 'Uvítací e-mail',
		tags: ['VIP-gold'],
		description: 'Automatický e-mail odeslaný nově registrovaným fanouškům.',
		created_at: new Date('2024-01-01'),
		created_by: 'Budina Tomáš',
		active: true,
		workflow: {
			nodes: [
				{
					id: 'trigger-1',
					type: 'workflow',
					position: { x: 40, y: 120 },
					data: { itemId: 'start-now', variant: 'trigger' }
				}
			],
			edges: []
		}
	},
	{
		id: 2,
		event: 'Narozeninové přání',
		tags: ['normal'],
		description: 'Personalizovaná gratulace k narozeninám fanouška.',
		created_at: new Date('2024-02-02'),
		created_by: 'Novák Petr',
		active: true,
		workflow: {
			nodes: [
				{
					id: 'trigger-1',
					type: 'workflow',
					position: { x: 40, y: 120 },
					data: { itemId: 'start-now', variant: 'trigger' }
				}
			],
			edges: []
		}
	},
	{
		id: 3,
		event: 'Odpověď po nákupu',
		tags: ['VIP-silver'],
		description: 'Poděkování za nákup vstupenky a doporučení dalších akcí.',
		created_at: new Date('2024-03-03'),
		created_by: 'Svoboda Jan',
		active: true,
		workflow: {
			nodes: [
				{
					id: 'trigger-1',
					type: 'workflow',
					position: { x: 40, y: 120 },
					data: { itemId: 'start-now', variant: 'trigger' }
				}
			],
			edges: []
		}
	},
	{
		id: 4,
		event: 'VIP nabídka',
		tags: ['premium'],
		description: 'Exkluzivní sleva a výhody pro VIP segment fanoušků.',
		created_at: new Date('2024-04-04'),
		created_by: 'Dvořák Martin',
		active: false,
		workflow: {
			nodes: [
				{
					id: 'trigger-1',
					type: 'workflow',
					position: { x: 40, y: 120 },
					data: { itemId: 'ticket-purchase', variant: 'trigger' }
				}
			],
			edges: []
		}
	},
	{
		id: 5,
		event: 'Push: domácí zápas',
		tags: ['VIP-gold', 'premium'],
		description: 'Push notifikace 48 hodin před domácím utkáním.',
		created_at: new Date('2024-05-05'),
		created_by: 'Černý Jakub',
		active: true,
		workflow: {
			nodes: [
				{
					id: 'trigger-1',
					type: 'workflow',
					position: { x: 40, y: 120 },
					data: { itemId: 'start-now', variant: 'trigger' }
				}
			],
			edges: []
		}
	},
	{
		id: 6,
		event: 'SMS připomínka',
		tags: ['normal'],
		description: 'Krátká SMS 24 hodin před začátkem akce.',
		created_at: new Date('2024-06-06'),
		created_by: 'Procházka Ondřej',
		active: true,
		workflow: {
			nodes: [
				{
					id: 'trigger-1',
					type: 'workflow',
					position: { x: 40, y: 120 },
					data: { itemId: 'start-now', variant: 'trigger' }
				}
			],
			edges: []
		}
	},
	{
		id: 7,
		event: 'Reaktivace fanoušků',
		tags: ['VIP-silver'],
		description: 'Kampaň pro fanoušky bez aktivity déle než 90 dní.',
		created_at: new Date('2024-07-07'),
		created_by: 'Kučera Lukáš',
		active: true,
		workflow: {
			nodes: [
				{
					id: 'trigger-1',
					type: 'workflow',
					position: { x: 40, y: 120 },
					data: { itemId: 'start-now', variant: 'trigger' }
				}
			],
			edges: []
		}
	},
	{
		id: 8,
		event: 'Dotazník spokojenosti',
		tags: ['premium', 'VIP-gold'],
		description: 'Krátký průzkum spokojenosti po návštěvě akce.',
		created_at: new Date('2024-08-08'),
		created_by: 'Veselý Michal',
		active: true,
		workflow: {
			nodes: [
				{
					id: 'trigger-1',
					type: 'workflow',
					position: { x: 40, y: 120 },
					data: { itemId: 'start-now', variant: 'trigger' }
				}
			],
			edges: []
		}
	},
	{
		id: 9,
		event: 'Měsíční newsletter',
		tags: ['denis'],
		description: 'Přehled novinek, výsledků a nadcházejících událostí.',
		created_at: new Date('2024-09-09'),
		created_by: 'Horáček Filip',
		active: false,
		workflow: {
			nodes: [
				{
					id: 'trigger-1',
					type: 'workflow',
					position: { x: 40, y: 120 },
					data: { itemId: 'start-now', variant: 'trigger' }
				}
			],
			edges: []
		}
	},
	{
		id: 10,
		event: 'Sleva pro stálé zákazníky',
		tags: ['normal', 'premium'],
		description: 'Odměna za opakované nákupy vstupenek a merchandisingu.',
		created_at: new Date('2024-10-10'),
		created_by: 'Pospíšil Radek',
		active: true,
		workflow: {
			nodes: [
				{
					id: 'trigger-1',
					type: 'workflow',
					position: { x: 40, y: 120 },
					data: { itemId: 'start-now', variant: 'trigger' }
				}
			],
			edges: []
		}
	},
	{
		id: 11,
		event: 'Cross-sell merchandising',
		tags: ['VIP-gold', 'VIP-silver'],
		description: 'Doporučení produktů z fanshopu po nákupu vstupenky.',
		created_at: new Date('2024-11-11'),
		created_by: 'Blažek Vojtěch',
		active: true,
		workflow: {
			nodes: [
				{
					id: 'trigger-1',
					type: 'workflow',
					position: { x: 40, y: 120 },
					data: { itemId: 'start-now', variant: 'trigger' }
				}
			],
			edges: []
		}
	},
	{
		id: 12,
		event: 'Pozvánka na fanshop',
		tags: ['VIP-silver', 'normal'],
		description: 'Speciální akce ve fanshopu pro registrované fanoušky.',
		created_at: new Date('2024-12-12'),
		created_by: 'Kratochvíl Marek',
		active: true,
		workflow: {
			nodes: [
				{
					id: 'trigger-1',
					type: 'workflow',
					position: { x: 40, y: 120 },
					data: { itemId: 'start-now', variant: 'trigger' }
				}
			],
			edges: []
		}
	},
	{
		id: 13,
		event: 'Early bird vstupenky',
		tags: ['VIP-gold'],
		description: 'Přednostní prodej vstupenek pro členy fan klubu.',
		created_at: new Date('2024-01-13'),
		created_by: 'Fiala Zdeněk',
		active: true,
		workflow: {
			nodes: [
				{
					id: 'trigger-1',
					type: 'workflow',
					position: { x: 40, y: 120 },
					data: { itemId: 'start-now', variant: 'trigger' }
				}
			],
			edges: []
		}
	},
	{
		id: 14,
		event: 'Soutěž o VIP lístky',
		tags: ['normal'],
		description: 'Soutěžní kampaň s výhrou VIP zážitku na utkání.',
		created_at: new Date('2024-02-14'),
		created_by: 'Sedláček Pavel',
		active: false,
		workflow: {
			nodes: [
				{
					id: 'trigger-1',
					type: 'workflow',
					position: { x: 40, y: 120 },
					data: { itemId: 'start-now', variant: 'trigger' }
				}
			],
			edges: []
		}
	},
	{
		id: 15,
		event: 'Sezónní přehled',
		tags: ['VIP-silver'],
		description: 'Rekapitulace sezóny a plány na další ročník.',
		created_at: new Date('2024-03-15'),
		created_by: 'Musil Daniel',
		active: true,
		workflow: {
			nodes: [
				{
					id: 'trigger-1',
					type: 'workflow',
					position: { x: 40, y: 120 },
					data: { itemId: 'start-now', variant: 'trigger' }
				}
			],
			edges: []
		}
	},
	{
		id: 16,
		event: 'Push: výsledky zápasu',
		tags: ['premium'],
		description: 'Notifikace s výsledkem hned po skončení utkání.',
		created_at: new Date('2024-04-16'),
		created_by: 'Hájek Roman',
		active: true,
		workflow: {
			nodes: [
				{
					id: 'trigger-1',
					type: 'workflow',
					position: { x: 40, y: 120 },
					data: { itemId: 'start-now', variant: 'trigger' }
				}
			],
			edges: []
		}
	},
	{
		id: 17,
		event: 'E-mail: opuštěný košík',
		tags: ['VIP-gold', 'premium'],
		description: 'Připomínka nedokončené objednávky vstupenek.',
		created_at: new Date('2024-05-17'),
		created_by: 'Kopecký Stanislav',
		active: true,
		workflow: {
			nodes: [
				{
					id: 'trigger-1',
					type: 'workflow',
					position: { x: 40, y: 120 },
					data: { itemId: 'start-now', variant: 'trigger' }
				}
			],
			edges: []
		}
	},
	{
		id: 18,
		event: 'Segmentace nových fanoušků',
		tags: ['normal'],
		description: 'Automatické zařazení do segmentů podle chování.',
		created_at: new Date('2024-06-18'),
		created_by: 'Kolář Miroslav',
		active: true,
		workflow: {
			nodes: [
				{
					id: 'trigger-1',
					type: 'workflow',
					position: { x: 40, y: 120 },
					data: { itemId: 'start-now', variant: 'trigger' }
				}
			],
			edges: []
		}
	},
	{
		id: 19,
		event: 'Kampaň pro studenty',
		tags: ['VIP-silver'],
		description: 'Zvýhodněné vstupenky pro držitele ISIC.',
		created_at: new Date('2024-07-19'),
		created_by: 'Růžička Tomáš',
		active: false,
		workflow: {
			nodes: [
				{
					id: 'trigger-1',
					type: 'workflow',
					position: { x: 40, y: 120 },
					data: { itemId: 'start-now', variant: 'trigger' }
				}
			],
			edges: []
		}
	},
	{
		id: 20,
		event: 'Rodinná akce',
		tags: ['premium', 'VIP-gold'],
		description: 'Nabídka vstupenek a balíčků pro rodiny s dětmi.',
		created_at: new Date('2024-08-20'),
		created_by: 'Novotný Karel',
		active: true,
		workflow: {
			nodes: [
				{
					id: 'trigger-1',
					type: 'workflow',
					position: { x: 40, y: 120 },
					data: { itemId: 'start-now', variant: 'trigger' }
				}
			],
			edges: []
		}
	},
	{
		id: 21,
		event: 'Win-back kampaň',
		tags: ['denis'],
		description: 'Návratová nabídka pro fanoušky, kteří dlouho nenavštívili akci.',
		created_at: new Date('2024-09-21'),
		created_by: 'Marková Eva',
		active: true,
		workflow: {
			nodes: [
				{
					id: 'trigger-1',
					type: 'workflow',
					position: { x: 40, y: 120 },
					data: { itemId: 'start-now', variant: 'trigger' }
				}
			],
			edges: []
		}
	},
	{
		id: 22,
		event: 'Referral program',
		tags: ['normal', 'premium'],
		description: 'Odměna za doporučení nového fanouška do klubu.',
		created_at: new Date('2024-10-22'),
		created_by: 'Horáková Jana',
		active: true,
		workflow: {
			nodes: [
				{
					id: 'trigger-1',
					type: 'workflow',
					position: { x: 40, y: 120 },
					data: { itemId: 'start-now', variant: 'trigger' }
				}
			],
			edges: []
		}
	},
	{
		id: 23,
		event: 'Push: předprodej',
		tags: ['VIP-gold', 'VIP-silver'],
		description: 'Upozornění na start předprodeje vstupenek na novou sezónu.',
		created_at: new Date('2024-11-23'),
		created_by: 'Nováková Lucie',
		active: true,
		workflow: {
			nodes: [
				{
					id: 'trigger-1',
					type: 'workflow',
					position: { x: 40, y: 120 },
					data: { itemId: 'start-now', variant: 'trigger' }
				}
			],
			edges: []
		}
	},
	{
		id: 24,
		event: 'E-mail: matchday info',
		tags: ['VIP-silver', 'normal'],
		description: 'Praktické informace k dni utkání včetně dopravy a vstupu.',
		created_at: new Date('2024-12-24'),
		created_by: 'Dvořáková Petra',
		active: false,
		workflow: {
			nodes: [
				{
					id: 'trigger-1',
					type: 'workflow',
					position: { x: 40, y: 120 },
					data: { itemId: 'start-now', variant: 'trigger' }
				}
			],
			edges: []
		}
	},
	{
		id: 25,
		event: 'Uvítací e-mail 2',
		tags: ['VIP-gold'],
		description: 'Automatický e-mail odeslaný nově registrovaným fanouškům.',
		created_at: new Date('2025-01-25'),
		created_by: 'Budina Tomáš',
		active: true,
		workflow: {
			nodes: [
				{
					id: 'trigger-1',
					type: 'workflow',
					position: { x: 40, y: 120 },
					data: { itemId: 'start-now', variant: 'trigger' }
				}
			],
			edges: []
		}
	},
	{
		id: 26,
		event: 'Narozeninové přání 2',
		tags: ['normal'],
		description: 'Personalizovaná gratulace k narozeninám fanouška.',
		created_at: new Date('2025-02-26'),
		created_by: 'Novák Petr',
		active: true,
		workflow: {
			nodes: [
				{
					id: 'trigger-1',
					type: 'workflow',
					position: { x: 40, y: 120 },
					data: { itemId: 'start-now', variant: 'trigger' }
				}
			],
			edges: []
		}
	},
	{
		id: 27,
		event: 'Odpověď po nákupu 2',
		tags: ['VIP-silver'],
		description: 'Poděkování za nákup vstupenky a doporučení dalších akcí.',
		created_at: new Date('2025-03-27'),
		created_by: 'Svoboda Jan',
		active: true,
		workflow: {
			nodes: [
				{
					id: 'trigger-1',
					type: 'workflow',
					position: { x: 40, y: 120 },
					data: { itemId: 'start-now', variant: 'trigger' }
				}
			],
			edges: []
		}
	},
	{
		id: 28,
		event: 'VIP nabídka 2',
		tags: ['premium'],
		description: 'Exkluzivní sleva a výhody pro VIP segment fanoušků.',
		created_at: new Date('2025-04-28'),
		created_by: 'Dvořák Martin',
		active: true,
		workflow: {
			nodes: [
				{
					id: 'trigger-1',
					type: 'workflow',
					position: { x: 40, y: 120 },
					data: { itemId: 'start-now', variant: 'trigger' }
				}
			],
			edges: []
		}
	},
	{
		id: 29,
		event: 'Push: domácí zápas 2',
		tags: ['VIP-gold', 'premium'],
		description: 'Push notifikace 48 hodin před domácím utkáním.',
		created_at: new Date('2025-05-01'),
		created_by: 'Černý Jakub',
		active: false,
		workflow: {
			nodes: [
				{
					id: 'trigger-1',
					type: 'workflow',
					position: { x: 40, y: 120 },
					data: { itemId: 'start-now', variant: 'trigger' }
				}
			],
			edges: []
		}
	},
	{
		id: 30,
		event: 'SMS připomínka 2',
		tags: ['normal'],
		description: 'Krátká SMS 24 hodin před začátkem akce.',
		created_at: new Date('2025-06-02'),
		created_by: 'Procházka Ondřej',
		active: true,
		workflow: {
			nodes: [
				{
					id: 'trigger-1',
					type: 'workflow',
					position: { x: 40, y: 120 },
					data: { itemId: 'start-now', variant: 'trigger' }
				}
			],
			edges: []
		}
	},
	{
		id: 31,
		event: 'Reaktivace fanoušků 2',
		tags: ['VIP-silver'],
		description: 'Kampaň pro fanoušky bez aktivity déle než 90 dní.',
		created_at: new Date('2025-07-03'),
		created_by: 'Kučera Lukáš',
		active: true,
		workflow: {
			nodes: [
				{
					id: 'trigger-1',
					type: 'workflow',
					position: { x: 40, y: 120 },
					data: { itemId: 'start-now', variant: 'trigger' }
				}
			],
			edges: []
		}
	},
	{
		id: 32,
		event: 'Dotazník spokojenosti 2',
		tags: ['premium', 'VIP-gold'],
		description: 'Krátký průzkum spokojenosti po návštěvě akce.',
		created_at: new Date('2025-08-04'),
		created_by: 'Veselý Michal',
		active: true,
		workflow: {
			nodes: [
				{
					id: 'trigger-1',
					type: 'workflow',
					position: { x: 40, y: 120 },
					data: { itemId: 'start-now', variant: 'trigger' }
				}
			],
			edges: []
		}
	},
	{
		id: 33,
		event: 'Měsíční newsletter 2',
		tags: ['denis'],
		description: 'Přehled novinek, výsledků a nadcházejících událostí.',
		created_at: new Date('2025-09-05'),
		created_by: 'Horáček Filip',
		active: true,
		workflow: {
			nodes: [
				{
					id: 'trigger-1',
					type: 'workflow',
					position: { x: 40, y: 120 },
					data: { itemId: 'start-now', variant: 'trigger' }
				}
			],
			edges: []
		}
	},
	{
		id: 34,
		event: 'Sleva pro stálé zákazníky 2',
		tags: ['normal', 'premium'],
		description: 'Odměna za opakované nákupy vstupenek a merchandisingu.',
		created_at: new Date('2025-10-06'),
		created_by: 'Pospíšil Radek',
		active: false,
		workflow: {
			nodes: [
				{
					id: 'trigger-1',
					type: 'workflow',
					position: { x: 40, y: 120 },
					data: { itemId: 'start-now', variant: 'trigger' }
				}
			],
			edges: []
		}
	},
	{
		id: 35,
		event: 'Cross-sell merchandising 2',
		tags: ['VIP-gold', 'VIP-silver'],
		description: 'Doporučení produktů z fanshopu po nákupu vstupenky.',
		created_at: new Date('2025-11-07'),
		created_by: 'Blažek Vojtěch',
		active: true,
		workflow: {
			nodes: [
				{
					id: 'trigger-1',
					type: 'workflow',
					position: { x: 40, y: 120 },
					data: { itemId: 'start-now', variant: 'trigger' }
				}
			],
			edges: []
		}
	},
	{
		id: 36,
		event: 'Pozvánka na fanshop 2',
		tags: ['VIP-silver', 'normal'],
		description: 'Speciální akce ve fanshopu pro registrované fanoušky.',
		created_at: new Date('2025-12-08'),
		created_by: 'Kratochvíl Marek',
		active: true,
		workflow: {
			nodes: [
				{
					id: 'trigger-1',
					type: 'workflow',
					position: { x: 40, y: 120 },
					data: { itemId: 'start-now', variant: 'trigger' }
				}
			],
			edges: []
		}
	},
	{
		id: 37,
		event: 'Early bird vstupenky 2',
		tags: ['VIP-gold'],
		description: 'Přednostní prodej vstupenek pro členy fan klubu.',
		created_at: new Date('2025-01-09'),
		created_by: 'Fiala Zdeněk',
		active: true,
		workflow: {
			nodes: [
				{
					id: 'trigger-1',
					type: 'workflow',
					position: { x: 40, y: 120 },
					data: { itemId: 'start-now', variant: 'trigger' }
				}
			],
			edges: []
		}
	},
	{
		id: 38,
		event: 'Soutěž o VIP lístky 2',
		tags: ['normal'],
		description: 'Soutěžní kampaň s výhrou VIP zážitku na utkání.',
		created_at: new Date('2025-02-10'),
		created_by: 'Sedláček Pavel',
		active: true,
		workflow: {
			nodes: [
				{
					id: 'trigger-1',
					type: 'workflow',
					position: { x: 40, y: 120 },
					data: { itemId: 'start-now', variant: 'trigger' }
				}
			],
			edges: []
		}
	},
	{
		id: 39,
		event: 'Sezónní přehled 2',
		tags: ['VIP-silver'],
		description: 'Rekapitulace sezóny a plány na další ročník.',
		created_at: new Date('2025-03-11'),
		created_by: 'Musil Daniel',
		active: false,
		workflow: {
			nodes: [
				{
					id: 'trigger-1',
					type: 'workflow',
					position: { x: 40, y: 120 },
					data: { itemId: 'start-now', variant: 'trigger' }
				}
			],
			edges: []
		}
	},
	{
		id: 40,
		event: 'Push: výsledky zápasu 2',
		tags: ['premium'],
		description: 'Notifikace s výsledkem hned po skončení utkání.',
		created_at: new Date('2025-04-12'),
		created_by: 'Hájek Roman',
		active: true,
		workflow: {
			nodes: [
				{
					id: 'trigger-1',
					type: 'workflow',
					position: { x: 40, y: 120 },
					data: { itemId: 'start-now', variant: 'trigger' }
				}
			],
			edges: []
		}
	},
	{
		id: 41,
		event: 'E-mail: opuštěný košík 2',
		tags: ['VIP-gold', 'premium'],
		description: 'Připomínka nedokončené objednávky vstupenek.',
		created_at: new Date('2025-05-13'),
		created_by: 'Kopecký Stanislav',
		active: true,
		workflow: {
			nodes: [
				{
					id: 'trigger-1',
					type: 'workflow',
					position: { x: 40, y: 120 },
					data: { itemId: 'start-now', variant: 'trigger' }
				}
			],
			edges: []
		}
	},
	{
		id: 42,
		event: 'Segmentace nových fanoušků 2',
		tags: ['normal'],
		description: 'Automatické zařazení do segmentů podle chování.',
		created_at: new Date('2025-06-14'),
		created_by: 'Kolář Miroslav',
		active: true,
		workflow: {
			nodes: [
				{
					id: 'trigger-1',
					type: 'workflow',
					position: { x: 40, y: 120 },
					data: { itemId: 'start-now', variant: 'trigger' }
				}
			],
			edges: []
		}
	},
	{
		id: 43,
		event: 'Kampaň pro studenty 2',
		tags: ['VIP-silver'],
		description: 'Zvýhodněné vstupenky pro držitele ISIC.',
		created_at: new Date('2025-07-15'),
		created_by: 'Růžička Tomáš',
		active: true,
		workflow: {
			nodes: [
				{
					id: 'trigger-1',
					type: 'workflow',
					position: { x: 40, y: 120 },
					data: { itemId: 'start-now', variant: 'trigger' }
				}
			],
			edges: []
		}
	},
	{
		id: 44,
		event: 'Rodinná akce 2',
		tags: ['premium', 'VIP-gold'],
		description: 'Nabídka vstupenek a balíčků pro rodiny s dětmi.',
		created_at: new Date('2025-08-16'),
		created_by: 'Novotný Karel',
		active: false,
		workflow: {
			nodes: [
				{
					id: 'trigger-1',
					type: 'workflow',
					position: { x: 40, y: 120 },
					data: { itemId: 'start-now', variant: 'trigger' }
				}
			],
			edges: []
		}
	},
	{
		id: 45,
		event: 'Win-back kampaň 2',
		tags: ['denis'],
		description: 'Návratová nabídka pro fanoušky, kteří dlouho nenavštívili akci.',
		created_at: new Date('2025-09-17'),
		created_by: 'Marková Eva',
		active: true,
		workflow: {
			nodes: [
				{
					id: 'trigger-1',
					type: 'workflow',
					position: { x: 40, y: 120 },
					data: { itemId: 'start-now', variant: 'trigger' }
				}
			],
			edges: []
		}
	},
	{
		id: 46,
		event: 'Referral program 2',
		tags: ['normal', 'premium'],
		description: 'Odměna za doporučení nového fanouška do klubu.',
		created_at: new Date('2025-10-18'),
		created_by: 'Horáková Jana',
		active: true,
		workflow: {
			nodes: [
				{
					id: 'trigger-1',
					type: 'workflow',
					position: { x: 40, y: 120 },
					data: { itemId: 'start-now', variant: 'trigger' }
				}
			],
			edges: []
		}
	},
	{
		id: 47,
		event: 'Push: předprodej 2',
		tags: ['VIP-gold', 'VIP-silver'],
		description: 'Upozornění na start předprodeje vstupenek na novou sezónu.',
		created_at: new Date('2025-11-19'),
		created_by: 'Nováková Lucie',
		active: true,
		workflow: {
			nodes: [
				{
					id: 'trigger-1',
					type: 'workflow',
					position: { x: 40, y: 120 },
					data: { itemId: 'start-now', variant: 'trigger' }
				}
			],
			edges: []
		}
	},
	{
		id: 48,
		event: 'E-mail: matchday info 2',
		tags: ['VIP-silver', 'normal'],
		description: 'Praktické informace k dni utkání včetně dopravy a vstupu.',
		created_at: new Date('2025-12-20'),
		created_by: 'Dvořáková Petra',
		active: true,
		workflow: {
			nodes: [
				{
					id: 'trigger-1',
					type: 'workflow',
					position: { x: 40, y: 120 },
					data: { itemId: 'start-now', variant: 'trigger' }
				}
			],
			edges: []
		}
	},
	{
		id: 49,
		event: 'Uvítací e-mail 3',
		tags: ['VIP-gold'],
		description: 'Automatický e-mail odeslaný nově registrovaným fanouškům.',
		created_at: new Date('2026-01-21'),
		created_by: 'Budina Tomáš',
		active: false,
		workflow: {
			nodes: [
				{
					id: 'trigger-1',
					type: 'workflow',
					position: { x: 40, y: 120 },
					data: { itemId: 'start-now', variant: 'trigger' }
				}
			],
			edges: []
		}
	},
	{
		id: 50,
		event: 'Narozeninové přání 3',
		tags: ['normal'],
		description: 'Personalizovaná gratulace k narozeninám fanouška.',
		created_at: new Date('2026-02-22'),
		created_by: 'Novák Petr',
		active: true,
		workflow: {
			nodes: [
				{
					id: 'trigger-1',
					type: 'workflow',
					position: { x: 40, y: 120 },
					data: { itemId: 'start-now', variant: 'trigger' }
				}
			],
			edges: []
		}
	},
	{
		id: 51,
		event: 'Odpověď po nákupu 3',
		tags: ['VIP-silver'],
		description: 'Poděkování za nákup vstupenky a doporučení dalších akcí.',
		created_at: new Date('2026-03-23'),
		created_by: 'Svoboda Jan',
		active: true,
		workflow: {
			nodes: [
				{
					id: 'trigger-1',
					type: 'workflow',
					position: { x: 40, y: 120 },
					data: { itemId: 'start-now', variant: 'trigger' }
				}
			],
			edges: []
		}
	},
	{
		id: 52,
		event: 'VIP nabídka 3',
		tags: ['premium'],
		description: 'Exkluzivní sleva a výhody pro VIP segment fanoušků.',
		created_at: new Date('2026-04-24'),
		created_by: 'Dvořák Martin',
		active: true,
		workflow: {
			nodes: [
				{
					id: 'trigger-1',
					type: 'workflow',
					position: { x: 40, y: 120 },
					data: { itemId: 'start-now', variant: 'trigger' }
				}
			],
			edges: []
		}
	},
	{
		id: 53,
		event: 'Push: domácí zápas 3',
		tags: ['VIP-gold', 'premium'],
		description: 'Push notifikace 48 hodin před domácím utkáním.',
		created_at: new Date('2026-05-25'),
		created_by: 'Černý Jakub',
		active: true,
		workflow: {
			nodes: [
				{
					id: 'trigger-1',
					type: 'workflow',
					position: { x: 40, y: 120 },
					data: { itemId: 'start-now', variant: 'trigger' }
				}
			],
			edges: []
		}
	},
	{
		id: 54,
		event: 'SMS připomínka 3',
		tags: ['normal'],
		description: 'Krátká SMS 24 hodin před začátkem akce.',
		created_at: new Date('2026-06-26'),
		created_by: 'Procházka Ondřej',
		active: false,
		workflow: {
			nodes: [
				{
					id: 'trigger-1',
					type: 'workflow',
					position: { x: 40, y: 120 },
					data: { itemId: 'start-now', variant: 'trigger' }
				}
			],
			edges: []
		}
	},
	{
		id: 55,
		event: 'Reaktivace fanoušků 3',
		tags: ['VIP-silver'],
		description: 'Kampaň pro fanoušky bez aktivity déle než 90 dní.',
		created_at: new Date('2026-07-27'),
		created_by: 'Kučera Lukáš',
		active: true,
		workflow: {
			nodes: [
				{
					id: 'trigger-1',
					type: 'workflow',
					position: { x: 40, y: 120 },
					data: { itemId: 'start-now', variant: 'trigger' }
				}
			],
			edges: []
		}
	},
	{
		id: 56,
		event: 'Dotazník spokojenosti 3',
		tags: ['premium', 'VIP-gold'],
		description: 'Krátký průzkum spokojenosti po návštěvě akce.',
		created_at: new Date('2026-08-28'),
		created_by: 'Veselý Michal',
		active: true,
		workflow: {
			nodes: [
				{
					id: 'trigger-1',
					type: 'workflow',
					position: { x: 40, y: 120 },
					data: { itemId: 'start-now', variant: 'trigger' }
				}
			],
			edges: []
		}
	},
	{
		id: 57,
		event: 'Měsíční newsletter 3',
		tags: ['denis'],
		description: 'Přehled novinek, výsledků a nadcházejících událostí.',
		created_at: new Date('2026-09-01'),
		created_by: 'Horáček Filip',
		active: true,
		workflow: {
			nodes: [
				{
					id: 'trigger-1',
					type: 'workflow',
					position: { x: 40, y: 120 },
					data: { itemId: 'start-now', variant: 'trigger' }
				}
			],
			edges: []
		}
	},
	{
		id: 58,
		event: 'Sleva pro stálé zákazníky 3',
		tags: ['normal', 'premium'],
		description: 'Odměna za opakované nákupy vstupenek a merchandisingu.',
		created_at: new Date('2026-10-02'),
		created_by: 'Pospíšil Radek',
		active: true,
		workflow: {
			nodes: [
				{
					id: 'trigger-1',
					type: 'workflow',
					position: { x: 40, y: 120 },
					data: { itemId: 'start-now', variant: 'trigger' }
				}
			],
			edges: []
		}
	},
	{
		id: 59,
		event: 'Cross-sell merchandising 3',
		tags: ['VIP-gold', 'VIP-silver'],
		description: 'Doporučení produktů z fanshopu po nákupu vstupenky.',
		created_at: new Date('2026-11-03'),
		created_by: 'Blažek Vojtěch',
		active: false,
		workflow: {
			nodes: [
				{
					id: 'trigger-1',
					type: 'workflow',
					position: { x: 40, y: 120 },
					data: { itemId: 'start-now', variant: 'trigger' }
				}
			],
			edges: []
		}
	},
	{
		id: 60,
		event: 'Pozvánka na fanshop 3',
		tags: ['VIP-silver', 'normal'],
		description: 'Speciální akce ve fanshopu pro registrované fanoušky.',
		created_at: new Date('2026-12-04'),
		created_by: 'Kratochvíl Marek',
		active: true,
		workflow: {
			nodes: [
				{
					id: 'trigger-1',
					type: 'workflow',
					position: { x: 40, y: 120 },
					data: { itemId: 'start-now', variant: 'trigger' }
				}
			],
			edges: []
		}
	}
];
