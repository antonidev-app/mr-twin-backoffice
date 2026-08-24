import { apiFetch } from './client';
import type { AdminCustomer, Paginated, PriceCategory } from './types';

export type CustomerFilters = {
	q?: string;
	page?: number | string;
};

export function list(filters: CustomerFilters, token: string, fetchFn?: typeof fetch) {
	return apiFetch<Paginated<AdminCustomer>>('/api/admin/customers', {
		params: filters,
		token,
		fetch: fetchFn
	});
}

export function updatePriceCategory(
	id: number | string,
	priceCategoryId: number | null,
	token: string,
	fetchFn?: typeof fetch
) {
	return apiFetch<{ data: AdminCustomer }>(`/api/admin/customers/${id}`, {
		method: 'PUT',
		body: { price_category_id: priceCategoryId },
		token,
		fetch: fetchFn
	});
}

export function listPriceCategories(token: string, fetchFn?: typeof fetch) {
	return apiFetch<PriceCategory[]>('/api/admin/price-categories', { token, fetch: fetchFn });
}
