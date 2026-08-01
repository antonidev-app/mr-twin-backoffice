import { redirect } from '@sveltejs/kit';
import { auth } from '$lib/stores/auth.svelte';
import type { LayoutLoad } from './$types';

export const ssr = false;

export const load: LayoutLoad = ({ url }) => {
	if (!auth.isLoggedIn && url.pathname !== '/login') {
		redirect(302, '/login');
	}
	if (auth.isLoggedIn && url.pathname === '/login') {
		redirect(302, '/');
	}
};
