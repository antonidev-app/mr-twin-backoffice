import { error } from '@sveltejs/kit';
import { ApiError } from '$lib/api/client';
import { get } from '$lib/api/orders';
import { auth } from '$lib/stores/auth.svelte';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params, fetch }) => {
	try {
		const { data: order } = await get(params.id, auth.token!, fetch);
		return { order };
	} catch (err) {
		if (err instanceof ApiError && err.status === 404) {
			error(404, 'Pesanan tidak ditemukan.');
		}
		error(503, 'Tidak bisa memuat pesanan saat ini.');
	}
};
