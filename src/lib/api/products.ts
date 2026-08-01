import { apiFetch } from './client';
import type { AdminProduct, Paginated } from './types';

export type ProductFilters = {
	q?: string;
	is_published?: boolean;
	suspended?: boolean;
	item_type?: string;
	page?: number | string;
};

export function list(filters: ProductFilters, token: string, fetchFn?: typeof fetch) {
	return apiFetch<Paginated<AdminProduct>>('/api/admin/products', {
		params: filters,
		token,
		fetch: fetchFn
	});
}

export function get(id: number | string, token: string, fetchFn?: typeof fetch) {
	return apiFetch<{ data: AdminProduct }>(`/api/admin/products/${id}`, { token, fetch: fetchFn });
}

export type ProductUpdatePayload = {
	is_published: boolean;
	display_name?: string | null;
	description?: string | null;
	display_category?: string | null;
	brand?: string | null;
	sort_order?: number | null;
};

export function update(
	id: number | string,
	payload: ProductUpdatePayload,
	token: string,
	fetchFn?: typeof fetch
) {
	return apiFetch<{ data: AdminProduct }>(`/api/admin/products/${id}`, {
		method: 'PUT',
		body: payload,
		token,
		fetch: fetchFn
	});
}

export function uploadImage(
	id: number | string,
	file: File,
	token: string,
	fetchFn?: typeof fetch
) {
	const formData = new FormData();
	formData.append('image', file);

	return apiFetch<{ data: AdminProduct }>(`/api/admin/products/${id}/images`, {
		method: 'POST',
		body: formData,
		token,
		fetch: fetchFn
	});
}

export function deleteImage(
	id: number | string,
	url: string,
	token: string,
	fetchFn?: typeof fetch
) {
	return apiFetch<{ data: AdminProduct }>(`/api/admin/products/${id}/images`, {
		method: 'DELETE',
		body: { url },
		token,
		fetch: fetchFn
	});
}
