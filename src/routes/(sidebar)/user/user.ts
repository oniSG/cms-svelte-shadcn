export type Tag = 'TEST - LUKAS' | 'TEST - ZUZA' | 'VIP' | 'DEMO' | 'BETA';

export type User = {
	id: string;
	surname: string;
	first_name: string;
	email: string;
	phone: string | null;
	tags: Tag[];
	last_activity: Date;
	active: boolean;
	two_fa: boolean;
};

export const allTags: Tag[] = ['TEST - LUKAS', 'TEST - ZUZA', 'VIP', 'DEMO', 'BETA'];
