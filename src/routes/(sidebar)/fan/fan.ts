export type FanTag = 'VIP' | 'VIP GOLD' | 'INVITED' | 'PARTNER' | 'INFLUENCER' | 'INTERNAL';

export const allTags: FanTag[] = [
	'VIP',
	'VIP GOLD',
	'INVITED',
	'PARTNER',
	'INFLUENCER',
	'INTERNAL'
];

export type RegistrationSource =
	| 'TICKETING'
	| 'ONEID'
	| 'WEB_FORM'
	| 'INTERNAL'
	| 'BUSINESS'
	| 'IMPORT';

export const allSources: RegistrationSource[] = [
	'TICKETING',
	'ONEID',
	'WEB_FORM',
	'INTERNAL',
	'BUSINESS',
	'IMPORT'
];

export type Fan = {
	id: string;
	surname: string;
	first_name: string;
	email: string;
	phone: string | null;
	city: string | null;
	tags: FanTag[];
	date_added: Date;
	registration_source: RegistrationSource;
	partner: string | null;
	segment_match: boolean;
};
