import { apiFetch } from './client';
import type { AdminOrder, Paginated } from './types';

export type OrderFilters = {
	status?: string;
	page?: number | string;
};

export function list(filters: OrderFilters, token: string, fetchFn?: typeof fetch) {
	return apiFetch<Paginated<AdminOrder>>('/api/admin/orders', {
		params: filters,
		token,
		fetch: fetchFn
	});
}

export function get(id: number | string, token: string, fetchFn?: typeof fetch) {
	return apiFetch<{ data: AdminOrder }>(`/api/admin/orders/${id}`, { token, fetch: fetchFn });
}

export function updateStatus(
	id: number | string,
	status: string,
	token: string,
	fetchFn?: typeof fetch
) {
	return apiFetch<{ data: AdminOrder }>(`/api/admin/orders/${id}`, {
		method: 'PATCH',
		body: { status },
		token,
		fetch: fetchFn
	});
}
