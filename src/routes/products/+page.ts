import { list } from '$lib/api/products';
import { auth } from '$lib/stores/auth.svelte';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ url, fetch }) => {
	const filters = {
		q: url.searchParams.get('q') ?? undefined,
		is_published: url.searchParams.has('is_published')
			? url.searchParams.get('is_published') === 'true'
			: undefined,
		suspended: url.searchParams.has('suspended')
			? url.searchParams.get('suspended') === 'true'
			: undefined,
		page: url.searchParams.get('page') ?? undefined
	};

	const products = await list(filters, auth.token!, fetch);

	return { products, filters };
};
