import { list } from '$lib/api/banners';
import { auth } from '$lib/stores/auth.svelte';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ url, fetch }) => {
	const filters = {
		q: url.searchParams.get('q') ?? undefined,
		is_active: url.searchParams.has('is_active')
			? url.searchParams.get('is_active') === 'true'
			: undefined,
		page: url.searchParams.get('page') ?? undefined
	};

	const banners = await list(filters, auth.token!, fetch);

	return { banners, filters };
};
