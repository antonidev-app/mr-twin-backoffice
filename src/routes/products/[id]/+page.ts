import { error } from '@sveltejs/kit';
import { ApiError } from '$lib/api/client';
import { get } from '$lib/api/products';
import { auth } from '$lib/stores/auth.svelte';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params, fetch }) => {
	try {
		const { data: product } = await get(params.id, auth.token!, fetch);
		return { product };
	} catch (err) {
		if (err instanceof ApiError && err.status === 404) {
			error(404, 'Produk tidak ditemukan.');
		}
		error(503, 'Tidak bisa memuat produk saat ini.');
	}
};
