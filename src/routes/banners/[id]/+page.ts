import { error } from '@sveltejs/kit';
import { ApiError } from '$lib/api/client';
import { get } from '$lib/api/banners';
import { auth } from '$lib/stores/auth.svelte';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params, fetch }) => {
	try {
		const { data: banner } = await get(params.id, auth.token!, fetch);
		return { banner };
	} catch (err) {
		if (err instanceof ApiError && err.status === 404) {
			error(404, 'Banner tidak ditemukan.');
		}
		error(503, 'Tidak bisa memuat banner saat ini.');
	}
};
