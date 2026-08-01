import { list } from '$lib/api/orders';
import { auth } from '$lib/stores/auth.svelte';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ url, fetch }) => {
	const filters = {
		status: url.searchParams.get('status') ?? undefined,
		page: url.searchParams.get('page') ?? undefined
	};

	const orders = await list(filters, auth.token!, fetch);

	return { orders, filters };
};
