import type { EntryGenerator } from './$types';
import { data } from '../data';

export const entries: EntryGenerator = () => {
	return data.map((action) => ({ id: String(action.id) }));
};
