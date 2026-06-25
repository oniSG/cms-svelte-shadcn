// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Icon = any;

export type NavSubItem = {
	title: string;
	url: string;
	isActive?: boolean;
};

export type NavItem = {
	title: string;
	url: string;
	icon?: Icon;
	isActive?: boolean;
	items?: NavSubItem[];
};

export type NavGroup = {
	label?: string;
	items: NavItem[];
};

export type Module = 'business' | 'fans' | 'settings';
