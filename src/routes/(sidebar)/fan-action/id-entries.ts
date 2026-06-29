import { data } from './data';

export function fanActionIdEntries() {
	return data.map((action) => ({ id: String(action.id) }));
}
