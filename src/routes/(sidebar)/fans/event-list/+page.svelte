<script lang="ts">
	// Shadcn imports
	import PageHeader from '$lib/components/custom/sidebar/page-header.svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Table from '$lib/components/ui/table/index.js';
	import * as ContextMenu from '$lib/components/ui/context-menu/index.js';
	import { Badge } from '$lib/components/ui/badge';
	import * as Dialog from "$lib/components/ui/dialog/index.js";
	import * as Field from "$lib/components/ui/field/index.js";
	import { Input } from "$lib/components/ui/input/index.js";
	import { Switch } from "$lib/components/ui/switch/index.js";
	import * as Command from '$lib/components/ui/command/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import { Separator } from "$lib/components/ui/separator/index.js";

	// Lucide imports
	import { Check } from '@lucide/svelte';
	import { X } from '@lucide/svelte';
	import { Plus } from '@lucide/svelte';
	import { SquarePen } from '@lucide/svelte';
	import { Copy } from '@lucide/svelte';
	import { Trash } from '@lucide/svelte';
	import { Eye } from '@lucide/svelte';

	// Custom component imports
	import FilterBar from './components/data-table-col-filter.svelte';
	import Pagination from './components/data-table-pagination.svelte';

	//Other imports
	import { getLocalTimeZone, today } from '@internationalized/date';

	const events = [
		{
			id: 1,
			name: 'Budina Tomáš',
			event: 'Ples města Pardubice',
			label: 'VIP-gold',
			creation_date: '2024-01-15',
			isActive: 'true'
		},
		{
			id: 2,
			name: 'Novák Petr',
			event: 'Firemní večírek 2024',
			label: 'normal',
			creation_date: '2024-01-22',
			isActive: 'true'
		},
		{
			id: 3,
			name: 'Svoboda Jan',
			event: 'Gala večer Nadace Světlo',
			label: 'VIP-silver',
			creation_date: '2024-02-03',
			isActive: 'false'
		},
		{
			id: 4,
			name: 'Dvořák Martin',
			event: 'Sportovní banket FC Pardubice',
			label: 'normal',
			creation_date: '2024-02-11',
			isActive: 'true'
		},
		{
			id: 5,
			name: 'Černý Jakub',
			event: 'Ples města Pardubice',
			label: 'VIP-gold',
			creation_date: '2024-02-19',
			isActive: 'true'
		},
		{
			id: 6,
			name: 'Procházka Ondřej',
			event: 'Konference TechSummit',
			label: 'premium',
			creation_date: '2024-03-01',
			isActive: 'false'
		},
		{
			id: 7,
			name: 'Kučera Lukáš',
			event: 'Firemní večírek 2024',
			label: 'normal',
			creation_date: '2024-03-08',
			isActive: 'true'
		},
		{
			id: 8,
			name: 'Veselý Michal',
			event: 'Gala večer Nadace Světlo',
			label: 'VIP-silver',
			creation_date: '2024-03-15',
			isActive: 'true'
		},
		{
			id: 9,
			name: 'Horáček Filip',
			event: 'Hudební festival Kmochův Kolín',
			label: 'premium',
			creation_date: '2024-03-22',
			isActive: 'false'
		},
		{
			id: 10,
			name: 'Pospíšil Radek',
			event: 'Sportovní banket FC Pardubice',
			label: 'normal',
			creation_date: '2024-03-29',
			isActive: 'true'
		},
		{
			id: 11,
			name: 'Blažek Vojtěch',
			event: 'Ples města Pardubice',
			label: 'VIP-gold',
			creation_date: '2024-04-05',
			isActive: 'true'
		},
		{
			id: 12,
			name: 'Kratochvíl Marek',
			event: 'Konference TechSummit',
			label: 'normal',
			creation_date: '2024-04-12',
			isActive: 'true'
		},
		{
			id: 13,
			name: 'Fiala Zdeněk',
			event: 'Gala večer Nadace Světlo',
			label: 'VIP-silver',
			creation_date: '2024-04-19',
			isActive: 'false'
		},
		{
			id: 14,
			name: 'Sedláček Pavel',
			event: 'Firemní večírek 2024',
			label: 'premium',
			creation_date: '2024-04-26',
			isActive: 'true'
		},
		{
			id: 15,
			name: 'Musil Daniel',
			event: 'Hudební festival Kmochův Kolín',
			label: 'normal',
			creation_date: '2024-05-03',
			isActive: 'true'
		},
		{
			id: 16,
			name: 'Hájek Roman',
			event: 'Ples města Pardubice',
			label: 'VIP-gold',
			creation_date: '2024-05-10',
			isActive: 'false'
		},
		{
			id: 17,
			name: 'Kopecký Stanislav',
			event: 'Sportovní banket FC Pardubice',
			label: 'normal',
			creation_date: '2024-05-17',
			isActive: 'true'
		},
		{
			id: 18,
			name: 'Kolář Miroslav',
			event: 'Konference TechSummit',
			label: 'VIP-silver',
			creation_date: '2024-05-24',
			isActive: 'true'
		},
		{
			id: 19,
			name: 'Růžička Tomáš',
			event: 'Gala večer Nadace Světlo',
			label: 'premium',
			creation_date: '2024-05-31',
			isActive: 'false'
		},
		{
			id: 20,
			name: 'Novotný Karel',
			event: 'Firemní večírek 2024',
			label: 'normal',
			creation_date: '2024-06-07',
			isActive: 'true'
		},
		{
			id: 21,
			name: 'Marková Eva',
			event: 'Ples města Pardubice',
			label: 'VIP-gold',
			creation_date: '2024-06-14',
			isActive: 'true'
		},
		{
			id: 22,
			name: 'Horáková Jana',
			event: 'Hudební festival Kmochův Kolín',
			label: 'normal',
			creation_date: '2024-06-21',
			isActive: 'true'
		},
		{
			id: 23,
			name: 'Nováková Lucie',
			event: 'Sportovní banket FC Pardubice',
			label: 'VIP-silver',
			creation_date: '2024-06-28',
			isActive: 'false'
		},
		{
			id: 24,
			name: 'Dvořáková Petra',
			event: 'Konference TechSummit',
			label: 'premium',
			creation_date: '2024-07-05',
			isActive: 'true'
		},
		{
			id: 25,
			name: 'Svobodová Kateřina',
			event: 'Gala večer Nadace Světlo',
			label: 'normal',
			creation_date: '2024-07-12',
			isActive: 'true'
		},
		{
			id: 26,
			name: 'Procházková Martina',
			event: 'Ples města Pardubice',
			label: 'VIP-gold',
			creation_date: '2024-07-19',
			isActive: 'false'
		},
		{
			id: 27,
			name: 'Krejčí Radoslav',
			event: 'Firemní večírek 2024',
			label: 'normal',
			creation_date: '2024-07-26',
			isActive: 'true'
		},
		{
			id: 28,
			name: 'Šimánek Vladimír',
			event: 'Hudební festival Kmochův Kolín',
			label: 'VIP-silver',
			creation_date: '2024-08-02',
			isActive: 'true'
		},
		{
			id: 29,
			name: 'Beneš Jiří',
			event: 'Sportovní banket FC Pardubice',
			label: 'premium',
			creation_date: '2024-08-09',
			isActive: 'true'
		},
		{
			id: 30,
			name: 'Pokorný František',
			event: 'Konference TechSummit',
			label: 'normal',
			creation_date: '2024-08-16',
			isActive: 'false'
		},
		{
			id: 31,
			name: 'Urban Aleš',
			event: 'Ples města Pardubice',
			label: 'VIP-gold',
			creation_date: '2024-08-23',
			isActive: 'true'
		},
		{
			id: 32,
			name: 'Šťastný Václav',
			event: 'Gala večer Nadace Světlo',
			label: 'normal',
			creation_date: '2024-08-30',
			isActive: 'true'
		},
		{
			id: 33,
			name: 'Holub Patrik',
			event: 'Firemní večírek 2024',
			label: 'VIP-silver',
			creation_date: '2024-09-06',
			isActive: 'false'
		},
		{
			id: 34,
			name: 'Král David',
			event: 'Hudební festival Kmochův Kolín',
			label: 'premium',
			creation_date: '2024-09-13',
			isActive: 'true'
		},
		{
			id: 35,
			name: 'Vlček Igor',
			event: 'Sportovní banket FC Pardubice',
			label: 'normal',
			creation_date: '2024-09-20',
			isActive: 'true'
		},
		{
			id: 36,
			name: 'Marek Antonín',
			event: 'Ples města Pardubice',
			label: 'VIP-gold',
			creation_date: '2024-09-27',
			isActive: 'true'
		},
		{
			id: 37,
			name: 'Pešek Bronislav',
			event: 'Konference TechSummit',
			label: 'normal',
			creation_date: '2024-10-04',
			isActive: 'false'
		},
		{
			id: 38,
			name: 'Toman Rostislav',
			event: 'Gala večer Nadace Světlo',
			label: 'VIP-silver',
			creation_date: '2024-10-11',
			isActive: 'true'
		},
		{
			id: 39,
			name: 'Janda Miloslav',
			event: 'Firemní večírek 2024',
			label: 'premium',
			creation_date: '2024-10-18',
			isActive: 'true'
		},
		{
			id: 40,
			name: 'Havel Ctibor',
			event: 'Hudební festival Kmochův Kolín',
			label: 'normal',
			creation_date: '2024-10-25',
			isActive: 'false'
		},
		{
			id: 41,
			name: 'Nováčková Simona',
			event: 'Ples města Pardubice',
			label: 'VIP-gold',
			creation_date: '2024-11-01',
			isActive: 'true'
		},
		{
			id: 42,
			name: 'Zemanová Tereza',
			event: 'Sportovní banket FC Pardubice',
			label: 'normal',
			creation_date: '2024-11-08',
			isActive: 'true'
		},
		{
			id: 43,
			name: 'Kopečná Monika',
			event: 'Konference TechSummit',
			label: 'VIP-silver',
			creation_date: '2024-11-15',
			isActive: 'true'
		},
		{
			id: 44,
			name: 'Pokorná Renata',
			event: 'Gala večer Nadace Světlo',
			label: 'premium',
			creation_date: '2024-11-22',
			isActive: 'false'
		},
		{
			id: 45,
			name: 'Blažková Andrea',
			event: 'Firemní večírek 2024',
			label: 'normal',
			creation_date: '2024-11-29',
			isActive: 'true'
		},
		{
			id: 46,
			name: 'Urbanová Lenka',
			event: 'Ples města Pardubice',
			label: 'VIP-gold',
			creation_date: '2024-12-06',
			isActive: 'true'
		},
		{
			id: 47,
			name: 'Holubová Veronika',
			event: 'Hudební festival Kmochův Kolín',
			label: 'normal',
			creation_date: '2024-12-13',
			isActive: 'false'
		},
		{
			id: 48,
			name: 'Králová Michaela',
			event: 'Sportovní banket FC Pardubice',
			label: 'VIP-silver',
			creation_date: '2024-12-20',
			isActive: 'true'
		},
		{
			id: 49,
			name: 'Fischerová Dagmar',
			event: 'Konference TechSummit',
			label: 'premium',
			creation_date: '2024-12-27',
			isActive: 'true'
		},
		{
			id: 50,
			name: 'Benešová Alena',
			event: 'Gala večer Nadace Světlo',
			label: 'normal',
			creation_date: '2025-01-03',
			isActive: 'false'
		},
		{
			id: 51,
			name: 'Šimánková Barbora',
			event: 'Ples města Pardubice',
			label: 'VIP-gold',
			creation_date: '2025-01-10',
			isActive: 'true'
		},
		{
			id: 52,
			name: 'Krejčová Helena',
			event: 'Firemní večírek 2024',
			label: 'normal',
			creation_date: '2025-01-17',
			isActive: 'true'
		},
		{
			id: 53,
			name: 'Kolářová Ivana',
			event: 'Hudební festival Kmochův Kolín',
			label: 'VIP-silver',
			creation_date: '2025-01-24',
			isActive: 'true'
		},
		{
			id: 54,
			name: 'Sedláčková Jitka',
			event: 'Sportovní banket FC Pardubice',
			label: 'premium',
			creation_date: '2025-01-31',
			isActive: 'false'
		},
		{
			id: 55,
			name: 'Musilová Klára',
			event: 'Konference TechSummit',
			label: 'normal',
			creation_date: '2025-02-07',
			isActive: 'true'
		},
		{
			id: 56,
			name: 'Hájková Libuše',
			event: 'Ples města Pardubice',
			label: 'VIP-gold',
			creation_date: '2025-02-14',
			isActive: 'true'
		},
		{
			id: 57,
			name: 'Růžičková Naděžda',
			event: 'Gala večer Nadace Světlo',
			label: 'normal',
			creation_date: '2025-02-21',
			isActive: 'false'
		},
		{
			id: 58,
			name: 'Kopecká Olga',
			event: 'Firemní večírek 2024',
			label: 'VIP-silver',
			creation_date: '2025-02-28',
			isActive: 'true'
		},
		{
			id: 59,
			name: 'Tomanová Pavla',
			event: 'Hudební festival Kmochův Kolín',
			label: 'premium',
			creation_date: '2025-03-07',
			isActive: 'true'
		},
		{
			id: 60,
			name: 'Jandová Růžena',
			event: 'Sportovní banket FC Pardubice',
			label: 'normal',
			creation_date: '2025-03-14',
			isActive: 'true'
		},
		{
			id: 61,
			name: 'Havlová Soňa',
			event: 'Ples města Pardubice',
			label: 'VIP-gold',
			creation_date: '2025-03-21',
			isActive: 'false'
		},
		{
			id: 62,
			name: 'Vlčková Taťána',
			event: 'Konference TechSummit',
			label: 'normal',
			creation_date: '2025-03-28',
			isActive: 'true'
		},
		{
			id: 63,
			name: 'Marků Uršula',
			event: 'Gala večer Nadace Světlo',
			label: 'VIP-silver',
			creation_date: '2025-04-04',
			isActive: 'true'
		},
		{
			id: 64,
			name: 'Pešková Věra',
			event: 'Firemní večírek 2024',
			label: 'premium',
			creation_date: '2025-04-11',
			isActive: 'false'
		},
		{
			id: 65,
			name: 'Fischerová Zuzana',
			event: 'Hudební festival Kmochův Kolín',
			label: 'normal',
			creation_date: '2025-04-18',
			isActive: 'true'
		},
		{
			id: 66,
			name: 'Kratochvílová Jana',
			event: 'Ples města Pardubice',
			label: 'VIP-gold',
			creation_date: '2025-04-25',
			isActive: 'true'
		},
		{
			id: 67,
			name: 'Fialová Hana',
			event: 'Sportovní banket FC Pardubice',
			label: 'normal',
			creation_date: '2025-05-02',
			isActive: 'true'
		},
		{
			id: 68,
			name: 'Veselá Irena',
			event: 'Konference TechSummit',
			label: 'VIP-silver',
			creation_date: '2025-05-09',
			isActive: 'false'
		},
		{
			id: 69,
			name: 'Čermák Radim',
			event: 'Gala večer Nadace Světlo',
			label: 'premium',
			creation_date: '2025-05-16',
			isActive: 'true'
		},
		{
			id: 70,
			name: 'Šuster Kamil',
			event: 'Firemní večírek 2024',
			label: 'normal',
			creation_date: '2025-05-23',
			isActive: 'true'
		},
		{
			id: 71,
			name: 'Brož Libor',
			event: 'Ples města Pardubice',
			label: 'VIP-gold',
			creation_date: '2025-05-30',
			isActive: 'false'
		},
		{
			id: 72,
			name: 'Ryba Norbert',
			event: 'Hudební festival Kmochův Kolín',
			label: 'normal',
			creation_date: '2025-06-06',
			isActive: 'true'
		},
		{
			id: 73,
			name: 'Šulc Oldřich',
			event: 'Sportovní banket FC Pardubice',
			label: 'VIP-silver',
			creation_date: '2025-06-13',
			isActive: 'true'
		},
		{
			id: 74,
			name: 'Havelka Přemysl',
			event: 'Konference TechSummit',
			label: 'premium',
			creation_date: '2025-06-20',
			isActive: 'true'
		},
		{
			id: 75,
			name: 'Doležal Quido',
			event: 'Gala večer Nadace Světlo',
			label: 'normal',
			creation_date: '2025-06-27',
			isActive: 'false'
		},
		{
			id: 76,
			name: 'Navrátil Slavomír',
			event: 'Ples města Pardubice',
			label: 'VIP-gold',
			creation_date: '2025-07-04',
			isActive: 'true'
		},
		{
			id: 77,
			name: 'Tesař Tibor',
			event: 'Firemní večírek 2024',
			label: 'normal',
			creation_date: '2025-07-11',
			isActive: 'true'
		},
		{
			id: 78,
			name: 'Janů Dalibor',
			event: 'Hudební festival Kmochův Kolín',
			label: 'VIP-silver',
			creation_date: '2025-07-18',
			isActive: 'false'
		},
		{
			id: 79,
			name: 'Souček Eduard',
			event: 'Sportovní banket FC Pardubice',
			label: 'premium',
			creation_date: '2025-07-25',
			isActive: 'true'
		},
		{
			id: 80,
			name: 'Blaha Ferdinand',
			event: 'Konference TechSummit',
			label: 'normal',
			creation_date: '2025-08-01',
			isActive: 'true'
		},
		{
			id: 81,
			name: 'Doležalová Gabriela',
			event: 'Ples města Pardubice',
			label: 'VIP-gold',
			creation_date: '2025-08-08',
			isActive: 'true'
		},
		{
			id: 82,
			name: 'Navrátiová Hana',
			event: 'Gala večer Nadace Světlo',
			label: 'normal',
			creation_date: '2025-08-15',
			isActive: 'false'
		},
		{
			id: 83,
			name: 'Tesařová Iveta',
			event: 'Firemní večírek 2024',
			label: 'VIP-silver',
			creation_date: '2025-08-22',
			isActive: 'true'
		},
		{
			id: 84,
			name: 'Janůová Jana',
			event: 'Hudební festival Kmochův Kolín',
			label: 'premium',
			creation_date: '2025-08-29',
			isActive: 'true'
		},
		{
			id: 85,
			name: 'Součková Karolína',
			event: 'Sportovní banket FC Pardubice',
			label: 'normal',
			creation_date: '2025-09-05',
			isActive: 'false'
		},
		{
			id: 86,
			name: 'Blahová Lada',
			event: 'Ples města Pardubice',
			label: 'VIP-gold',
			creation_date: '2025-09-12',
			isActive: 'true'
		},
		{
			id: 87,
			name: 'Rybanská Marie',
			event: 'Konference TechSummit',
			label: 'normal',
			creation_date: '2025-09-19',
			isActive: 'true'
		},
		{
			id: 88,
			name: 'Šulcová Natálie',
			event: 'Gala večer Nadace Světlo',
			label: 'VIP-silver',
			creation_date: '2025-09-26',
			isActive: 'true'
		},
		{
			id: 89,
			name: 'Havelková Olga',
			event: 'Firemní večírek 2024',
			label: 'premium',
			creation_date: '2025-10-03',
			isActive: 'false'
		},
		{
			id: 90,
			name: 'Brožová Petra',
			event: 'Hudební festival Kmochův Kolín',
			label: 'normal',
			creation_date: '2025-10-10',
			isActive: 'true'
		},
		{
			id: 91,
			name: 'Čermáková Radka',
			event: 'Ples města Pardubice',
			label: 'VIP-gold',
			creation_date: '2025-10-17',
			isActive: 'true'
		},
		{
			id: 92,
			name: 'Šusterová Sabina',
			event: 'Sportovní banket FC Pardubice',
			label: 'normal',
			creation_date: '2025-10-24',
			isActive: 'false'
		},
		{
			id: 93,
			name: 'Rybová Tamara',
			event: 'Konference TechSummit',
			label: 'VIP-silver',
			creation_date: '2025-10-31',
			isActive: 'true'
		},
		{
			id: 94,
			name: 'Seidlová Uršula',
			event: 'Gala večer Nadace Světlo',
			label: 'premium',
			creation_date: '2025-11-07',
			isActive: 'true'
		},
		{
			id: 95,
			name: 'Polák Viktor',
			event: 'Firemní večírek 2024',
			label: 'normal',
			creation_date: '2025-11-14',
			isActive: 'true'
		},
		{
			id: 96,
			name: 'Janáček Walter',
			event: 'Ples města Pardubice',
			label: 'VIP-gold',
			creation_date: '2025-11-21',
			isActive: 'false'
		},
		{
			id: 97,
			name: 'Hampl Xaver',
			event: 'Hudební festival Kmochův Kolín',
			label: 'normal',
			creation_date: '2025-11-28',
			isActive: 'true'
		},
		{
			id: 98,
			name: 'Šimůnek Yaroslav',
			event: 'Sportovní banket FC Pardubice',
			label: 'VIP-silver',
			creation_date: '2025-12-05',
			isActive: 'true'
		},
		{
			id: 99,
			name: 'Bureš Zbyněk',
			event: 'Konference TechSummit',
			label: 'premium',
			creation_date: '2025-12-12',
			isActive: 'false'
		},
		{
			id: 100,
			name: 'Vondráček Adam',
			event: 'Gala večer Nadace Světlo',
			label: 'VIP-gold',
			creation_date: '2025-12-19',
			isActive: 'true'
		}
	];

	let currentPage = $state(1);
	let maxItemsPerPage = $state(10);
	const totalPages = $derived(Math.ceil(events.length / maxItemsPerPage));

	let editOpen = $state(false);
	let duplicateOpen = $state(false);
	let deleteOpen = $state(false);
	let detailOpen = $state(false);
	let addOpen = $state(false);

	const uniquePeople = new Set<string>();
	const uniqueTags = new Set<string>();
	const uniqueEvents = new Set<string>();

	for (const event of events) {
		uniquePeople.add(event.name);
		uniqueTags.add(event.label);
		uniqueEvents.add(event.event);
	}

	const start = today(getLocalTimeZone());
	const end = start.add({ days: 7 });

	let value = $state({
		start,
		end
	});

	let selectedTags = $state<string[]>([]);
	let tagPopoverOpen = $state(false);
	const availableTags = ['VIP-gold', 'VIP-silver', 'premium', 'normal'];
</script>

<PageHeader breadcrumbs={[{ title: 'Home', url: '/' }, { title: 'Fans' }, { title: 'Event list' }]} />

<div class="flex justify-between mb-2">
	<div class="flex gap-2">
		<FilterBar {uniqueEvents} {uniqueTags} {uniquePeople} bind:dateRange={value} />
	</div>
	<Button size="sm" onclick={() => addOpen = true}>
		<Plus class="mr-2 size-4" />
		Vytvořit seznam událostí
	</Button>
</div>

<div class="overflow-hidden rounded-md border">
	<Table.Root>
		<Table.Header>
			<Table.Row>
				<Table.Head class="w-25">Název</Table.Head>
				<Table.Head>Štítky</Table.Head>
				<Table.Head>Vytvořil/a</Table.Head>
				<Table.Head>Datum vytvoření</Table.Head>
				<Table.Head>Aktivní</Table.Head>
			</Table.Row>
		</Table.Header>
		<Table.Body>
			{#each events.slice((currentPage - 1) * maxItemsPerPage, currentPage * maxItemsPerPage) as event (event)}
				<ContextMenu.Root>
					<ContextMenu.Trigger>
						{#snippet child({ props })}
							<Table.Row class="hover:cursor-context-menu" {...props}>
								<Table.Cell>{event.event}</Table.Cell>
								<Table.Cell>
									<Badge variant="outline">{event.label}</Badge>
								</Table.Cell>
								<Table.Cell>{event.name}</Table.Cell>
								<Table.Cell>{event.creation_date}</Table.Cell>
								<Table.Cell>
									{#if event.isActive === 'true'}
										<Check class="size-4 text-primary" />
									{:else}
										<X class="size-4 text-destructive" />
									{/if}
								</Table.Cell>
							</Table.Row>
						{/snippet}
					</ContextMenu.Trigger>
					<ContextMenu.Content>
						<ContextMenu.Item onSelect={() => editOpen = true}>
							<SquarePen /> Editovat
						</ContextMenu.Item>
						<ContextMenu.Item onSelect={() => duplicateOpen = true}>
							<Copy /> Duplikovat
						</ContextMenu.Item>
						<ContextMenu.Item onSelect={() => detailOpen = true}>
							<Eye /> Detail
						</ContextMenu.Item>
						<ContextMenu.Item
							onSelect={() => deleteOpen = true}
							class="text-destructive data-highlighted:text-destructive"
						>
							<Trash class="mr-2 h-4 w-4" />
							<span>Odstranit</span>
						</ContextMenu.Item>
					</ContextMenu.Content>
				</ContextMenu.Root>
			{/each}
		</Table.Body>
	</Table.Root>
</div>

<Pagination bind:currentPage bind:maxItemsPerPage {totalPages} />

<Dialog.Root bind:open={editOpen}>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Editace seznamu událostí</Dialog.Title>
		</Dialog.Header>

		<div class="flex flex-col gap-4">
			<Field.Field>
				<Field.Label for="name">Název</Field.Label>
				<Input id="name" autocomplete="off" placeholder="Název události" />
			</Field.Field>



			<Field.Field orientation="horizontal">
				<Field.Label for="active">Aktivní</Field.Label>
				<Switch id="active" />
			</Field.Field>

			<Field.Field>
				<Field.Label for="label">Štítky</Field.Label>
				<div class="flex flex-wrap items-center gap-1 min-h-9 w-full rounded-md border border-input px-3 py-1 text-sm shadow-sm">
					{#each selectedTags as tag (tag)}
						<Badge variant="secondary" class="gap-1">
							{tag}
							<button
								type="button"
								onclick={() => selectedTags = selectedTags.filter(t => t !== tag)}
								class="hover:text-destructive"
							>
								<X class="size-3" />
							</button>
						</Badge>
					{/each}
					<Popover.Root bind:open={tagPopoverOpen}>
						<Popover.Trigger>
							{#snippet child({ props })}
								<Button {...props} type="button" variant="ghost" size="icon" class="size-5 ml-auto shrink-0">
									<Plus class="size-3" />
								</Button>
							{/snippet}
						</Popover.Trigger>
						<Popover.Content class="p-0 w-48" align="end">
							<Command.Root>
								<Command.Input placeholder="Hledat štítek..." />
								<Command.List>
									<Command.Empty>Žádné výsledky.</Command.Empty>
									<Command.Group>
										{#each availableTags as tag (tag)}
											<Command.Item
												value={tag}
												onSelect={() => {
                                                    if (!selectedTags.includes(tag)) selectedTags = [...selectedTags, tag];
                                                    tagPopoverOpen = false;
                                                }}
											>
												{tag}
											</Command.Item>
										{/each}
									</Command.Group>
								</Command.List>
							</Command.Root>
						</Popover.Content>
					</Popover.Root>
				</div>
			</Field.Field>

			<Field.Field orientation="horizontal">
				<Field.Label for="ticketing">Aktualizovat podle ticketingu</Field.Label>
				<Switch id="ticketing" />
			</Field.Field>
		</div>

		<Dialog.Footer>
			<Button variant="outline" onclick={() => editOpen = false}>Zrušit</Button>
			<Button>Uložit</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>

<Dialog.Root bind:open={duplicateOpen}>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Duplikovat položku</Dialog.Title>
			<Dialog.Description>Opravdu chcete duplikovat tuto položku?</Dialog.Description>
		</Dialog.Header>
		<Dialog.Footer>
			<Button variant="outline" onclick={() => duplicateOpen = false}>Zrušit</Button>
			<Button>Duplikovat</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>

<Dialog.Root bind:open={deleteOpen}>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Odstranit položku</Dialog.Title>
			<Dialog.Description>Opravdu chcete odstranit tuto položku? Tuto akci nelze vzít zpět.</Dialog.Description>
		</Dialog.Header>
		<Dialog.Footer>
			<Button variant="outline" onclick={() => deleteOpen = false}>Zrušit</Button>
			<Button variant="destructive">Odstranit</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>

<Dialog.Root bind:open={detailOpen}>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Firemní večírek 2024</Dialog.Title>
		</Dialog.Header>

		<div class="flex flex-col gap-4">


			<Separator />

			<Field.Field>
				<h3>Vytvořil/a: Tomáš Bodina</h3>
			</Field.Field>

			<Field.Field>
				<h3>Vytvořeno: 25. 3. 2026</h3>
			</Field.Field>

			<Field.Field>
				<h3>Stav: aktivní</h3>
			</Field.Field>



			<div class="flex items-center gap-2 flex-wrap w-fit">
				<h3>Štítky:</h3>
				<Badge variant="secondary">VIP-gold</Badge>
				<Badge variant="default">VIP-silver</Badge>
			</div>

			<Separator />

			<Field.Field>
				<Field.Label for="label">Události</Field.Label>
				<Table.Root>
					<Table.Header>
						<Table.Row>
							<Table.Head>Název</Table.Head>
							<Table.Head>ID</Table.Head>
							<Table.Head>Datum konání</Table.Head>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						<Table.Row>
							<Table.Cell class="font-medium">Test Event Feb</Table.Cell>
							<Table.Cell>9876</Table.Cell>
							<Table.Cell>01.02.2026</Table.Cell>
						</Table.Row>
						<Table.Row>
							<Table.Cell class="font-medium">Test Event Zuz Feb</Table.Cell>
							<Table.Cell>9876</Table.Cell>
							<Table.Cell>01.02.2026</Table.Cell>
						</Table.Row>
						<Table.Row>
							<Table.Cell class="font-medium">Test Event Zuz Feb</Table.Cell>
							<Table.Cell>9876</Table.Cell>
							<Table.Cell>01.02.2026</Table.Cell>
						</Table.Row>
					</Table.Body>
				</Table.Root>
			</Field.Field>


		</div>


	</Dialog.Content>
</Dialog.Root>

<Dialog.Root bind:open={addOpen}>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Vytvořit seznam událostí</Dialog.Title>
		</Dialog.Header>

		<div class="flex flex-col gap-4">
			<Field.Field>
				<Field.Label for="name">Název</Field.Label>
				<Input id="name" autocomplete="off" placeholder="Název události" />
			</Field.Field>



			<Field.Field orientation="horizontal">
				<Field.Label for="active">Aktivní</Field.Label>
				<Switch id="active" />
			</Field.Field>

			<Field.Field>
				<Field.Label for="label">Štítky</Field.Label>
				<div class="flex flex-wrap items-center gap-1 min-h-9 w-full rounded-md border border-input px-3 py-1 text-sm shadow-sm">
					{#each selectedTags as tag (tag)}
						<Badge variant="secondary" class="gap-1">
							{tag}
							<button
								type="button"
								onclick={() => selectedTags = selectedTags.filter(t => t !== tag)}
								class="hover:text-destructive"
							>
								<X class="size-3" />
							</button>
						</Badge>
					{/each}
					<Popover.Root bind:open={tagPopoverOpen}>
						<Popover.Trigger>
							{#snippet child({ props })}
								<Button {...props} type="button" variant="ghost" size="icon" class="size-5 ml-auto shrink-0">
									<Plus class="size-3" />
								</Button>
							{/snippet}
						</Popover.Trigger>
						<Popover.Content class="p-0 w-48" align="end">
							<Command.Root>
								<Command.Input placeholder="Hledat štítek..." />
								<Command.List>
									<Command.Empty>Žádné výsledky.</Command.Empty>
									<Command.Group>
										{#each availableTags as tag (tag)}
											<Command.Item
												value={tag}
												onSelect={() => {
                                                    if (!selectedTags.includes(tag)) selectedTags = [...selectedTags, tag];
                                                    tagPopoverOpen = false;
                                                }}
											>
												{tag}
											</Command.Item>
										{/each}
									</Command.Group>
								</Command.List>
							</Command.Root>
						</Popover.Content>
					</Popover.Root>
				</div>
			</Field.Field>

			<Field.Field orientation="horizontal">
				<Field.Label for="ticketing">Aktualizovat podle ticketingu</Field.Label>
				<Switch id="ticketing" />
			</Field.Field>
		</div>

		<Dialog.Footer>
			<Button variant="outline" onclick={() => editOpen = false}>Zrušit</Button>
			<Button>Uložit</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>




