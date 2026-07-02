export type FanAction = {
	id: number;
	event: string;
	tags: string[];
	description: string;
	created_at: Date;
	created_by: string;
	active: boolean;
};
