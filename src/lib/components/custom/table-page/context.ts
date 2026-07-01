import type { Component, Snippet } from 'svelte';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyComponent = Component<any>;

export type ActionWrap = {
	Item: AnyComponent;
	Separator: AnyComponent;
};

export type RowActions<Row> = Snippet<[Row, ActionWrap]>;

export const ROW_ACTIONS_KEY = Symbol('table-page:row-actions');

export type RowActionsContext = {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	get(): RowActions<any> | undefined;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	title(row: any): string | undefined;
};
