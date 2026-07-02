import type { Component, Snippet } from 'svelte';
import type { Pathname } from '$app/types';

export type ColumnType = 'text' | 'number' | 'date' | 'bool' | 'select';
export type Align = 'left' | 'right' | 'center';

type BaseColumn<Row> = {
	id: string;
	label: string;
	accessor?: (row: Row) => unknown;
	cell?: Component<{ value: unknown; row: Row }>;
	sortable?: boolean;
	hideable?: boolean;
	resizable?: boolean;
	width?: number;
	minWidth?: number;
	maxWidth?: number;
	align?: Align;
};

export type TextColumn<Row> = BaseColumn<Row> & { type?: 'text' };
export type NumberColumn<Row> = BaseColumn<Row> & { type: 'number' };
export type DateColumn<Row> = BaseColumn<Row> & { type: 'date' };
export type BoolColumn<Row> = BaseColumn<Row> & { type: 'bool' };
export type SelectColumn<Row> = BaseColumn<Row> & {
	type: 'select';
	options: Array<{ value: string; label: string }>;
	searchable?: boolean;
};

export type TableColumn<Row> =
	| TextColumn<Row>
	| NumberColumn<Row>
	| DateColumn<Row>
	| BoolColumn<Row>
	| SelectColumn<Row>;

export type SortDir = 'asc' | 'desc';
export type DefaultSort = { id: string; desc?: boolean };

export type MultiSelectShortcut = {
	kind: 'multi-select';
	id: string;
	label: string;
	icon?: Component;
	field: string;
	options: Array<{ value: string; label: string }>;
	searchable?: boolean;
	defaultHidden?: boolean;
};

export type DateRangeShortcut = {
	kind: 'date-range';
	id: string;
	label?: string;
	icon?: Component;
	field: string;
	defaultHidden?: boolean;
};

export type Shortcut = MultiSelectShortcut | DateRangeShortcut;

export type SearchConfig = {
	placeholder: string;
	fields: string[];
};

export type QueryFieldType = 'text' | 'number' | 'date' | 'bool' | 'select';

export type QueryFieldDef =
	| { value: string; label: string; type: 'text' }
	| { value: string; label: string; type: 'number' }
	| { value: string; label: string; type: 'date' }
	| { value: string; label: string; type: 'bool' }
	| {
			value: string;
			label: string;
			type: 'select';
			options: { value: string; label: string }[];
			searchable?: boolean;
	  };

export type ClickConfig<Row> = {
	sheet?: Snippet<[Row]>;
	href?: (row: Row) => Pathname;
	onClick?: (row: Row) => void;
	menu?: Snippet<[Row]>;
};

export type SelectionAction = {
	label: string;
	icon?: Component;
	onClick: (ids: string[]) => void;
};

export type Breadcrumb = { title: string; url?: Pathname };

export type TablePageResponse<Row> = {
	items: Row[];
	total: number;
	totalPages: number;
};

export type TableFetchArgs = {
	asOf: Date;
	page: number;
	limit: number;
	sort: string;
	dir: SortDir;
	q: unknown;
};

export type TableFetcher<Row> = (args: TableFetchArgs) => Promise<TablePageResponse<Row>>;
