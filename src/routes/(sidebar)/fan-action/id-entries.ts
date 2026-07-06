import { data } from './temp/data';

export function fanActionIdEntries() {
	return data.map((action) => ({ id: String(action.id) }));
}
