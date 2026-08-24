import { list, listPriceCategories } from '$lib/api/customers';
import { auth } from '$lib/stores/auth.svelte';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ url, fetch }) => {
	const filters = {
		q: url.searchParams.get('q') ?? undefined,
		page: url.searchParams.get('page') ?? undefined
	};

	const [customers, priceCategories] = await Promise.all([
		list(filters, auth.token!, fetch),
		listPriceCategories(auth.token!, fetch)
	]);

	return { customers, priceCategories, filters };
};
