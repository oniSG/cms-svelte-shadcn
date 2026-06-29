import { redirect } from '@sveltejs/kit';
import { fanActionEditTabHref } from '../edit-tabs';

export function load({ params }) {
	redirect(307, fanActionEditTabHref(params.id, 'basic'));
}
