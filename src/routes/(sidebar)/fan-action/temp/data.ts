import type { FanAction } from '../fan-action';
import { allCreators } from '../fan-action';

const campaigns = [
	{
		event: 'Uvítací e-mail',
		description: 'Automatický e-mail odeslaný nově registrovaným fanouškům.'
	},
	{
		event: 'Narozeninové přání',
		description: 'Personalizovaná gratulace k narozeninám fanouška.'
	},
	{
		event: 'Odpověď po nákupu',
		description: 'Poděkování za nákup vstupenky a doporučení dalších akcí.'
	},
	{
		event: 'VIP nabídka',
		description: 'Exkluzivní sleva a výhody pro VIP segment fanoušků.'
	},
	{
		event: 'Push: domácí zápas',
		description: 'Push notifikace 48 hodin před domácím utkáním.'
	},
	{
		event: 'SMS připomínka',
		description: 'Krátká SMS 24 hodin před začátkem akce.'
	},
	{
		event: 'Reaktivace fanoušků',
		description: 'Kampaň pro fanoušky bez aktivity déle než 90 dní.'
	},
	{
		event: 'Dotazník spokojenosti',
		description: 'Krátký průzkum spokojenosti po návštěvě akce.'
	},
	{
		event: 'Měsíční newsletter',
		description: 'Přehled novinek, výsledků a nadcházejících událostí.'
	},
	{
		event: 'Sleva pro stálé zákazníky',
		description: 'Odměna za opakované nákupy vstupenek a merchandisingu.'
	},
	{
		event: 'Cross-sell merchandising',
		description: 'Doporučení produktů z fanshopu po nákupu vstupenky.'
	},
	{
		event: 'Pozvánka na fanshop',
		description: 'Speciální akce ve fanshopu pro registrované fanoušky.'
	},
	{
		event: 'Early bird vstupenky',
		description: 'Přednostní prodej vstupenek pro členy fan klubu.'
	},
	{
		event: 'Soutěž o VIP lístky',
		description: 'Soutěžní kampaň s výhrou VIP zážitku na utkání.'
	},
	{
		event: 'Sezónní přehled',
		description: 'Rekapitulace sezóny a plány na další ročník.'
	},
	{
		event: 'Push: výsledky zápasu',
		description: 'Notifikace s výsledkem hned po skončení utkání.'
	},
	{
		event: 'E-mail: opuštěný košík',
		description: 'Připomínka nedokončené objednávky vstupenek.'
	},
	{
		event: 'Segmentace nových fanoušků',
		description: 'Automatické zařazení do segmentů podle chování.'
	},
	{
		event: 'Kampaň pro studenty',
		description: 'Zvýhodněné vstupenky pro držitele ISIC.'
	},
	{
		event: 'Rodinná akce',
		description: 'Nabídka vstupenek a balíčků pro rodiny s dětmi.'
	},
	{
		event: 'Win-back kampaň',
		description: 'Návratová nabídka pro fanoušky, kteří dlouho nenavštívili akci.'
	},
	{
		event: 'Referral program',
		description: 'Odměna za doporučení nového fanouška do klubu.'
	},
	{
		event: 'Push: předprodej',
		description: 'Upozornění na start předprodeje vstupenek na novou sezónu.'
	},
	{
		event: 'E-mail: matchday info',
		description: 'Praktické informace k dni utkání včetně dopravy a vstupu.'
	}
] as const;

const tagPatterns: string[][] = [
	['VIP-gold'],
	['normal'],
	['VIP-silver'],
	['premium'],
	['VIP-gold', 'premium'],
	['normal'],
	['VIP-silver'],
	['premium', 'VIP-gold'],
	['denis'],
	['normal', 'premium'],
	['VIP-gold', 'VIP-silver'],
	['VIP-silver', 'normal']
];

export const data: FanAction[] = Array.from({ length: 60 }, (_, index) => {
	const campaign = campaigns[index % campaigns.length];
	const month = (index % 12) + 1;
	const day = (index % 28) + 1;
	const year = 2024 + Math.floor(index / 24);
	const variant = Math.floor(index / campaigns.length);

	return {
		id: index + 1,
		event: variant > 0 ? `${campaign.event} ${variant + 1}` : campaign.event,
		tags: [...tagPatterns[index % tagPatterns.length]],
		description: campaign.description,
		created_at: new Date(
			`${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
		),
		created_by: allCreators[index % allCreators.length],
		active: index % 5 !== 3
	};
});
