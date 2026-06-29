import type { EntryGenerator } from './$types';
import { redirect } from '@sveltejs/kit';
import { fanActionEditTabHref } from '../edit-tabs';
import { fanActionIdEntries } from '../id-entries';

export const entries: EntryGenerator = fanActionIdEntries;

export function load({ params }) {
	redirect(307, fanActionEditTabHref(params.id, 'basic'));
}
