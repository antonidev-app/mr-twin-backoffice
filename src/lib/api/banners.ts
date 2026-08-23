import { apiFetch } from './client';
import type { AdminBanner, Paginated } from './types';

export type BannerFilters = {
	q?: string;
	is_active?: boolean;
	page?: number | string;
};

export function list(filters: BannerFilters, token: string, fetchFn?: typeof fetch) {
	return apiFetch<Paginated<AdminBanner>>('/api/admin/banners', {
		params: filters,
		token,
		fetch: fetchFn
	});
}

export function get(id: number | string, token: string, fetchFn?: typeof fetch) {
	return apiFetch<{ data: AdminBanner }>(`/api/admin/banners/${id}`, { token, fetch: fetchFn });
}

export type BannerPayload = {
	title: string;
	link_url: string;
	is_active: boolean;
	sort_order: number;
	image: File | null;
};

function toFormData(payload: BannerPayload) {
	const formData = new FormData();
	formData.append('title', payload.title);
	formData.append('link_url', payload.link_url);
	formData.append('is_active', payload.is_active ? '1' : '0');
	formData.append('sort_order', String(payload.sort_order));
	if (payload.image) formData.append('image', payload.image);
	return formData;
}

export function create(payload: BannerPayload, token: string, fetchFn?: typeof fetch) {
	return apiFetch<{ data: AdminBanner }>('/api/admin/banners', {
		method: 'POST',
		body: toFormData(payload),
		token,
		fetch: fetchFn
	});
}

export function update(
	id: number | string,
	payload: BannerPayload,
	token: string,
	fetchFn?: typeof fetch
) {
	const formData = toFormData(payload);
	formData.append('_method', 'PUT');

	return apiFetch<{ data: AdminBanner }>(`/api/admin/banners/${id}`, {
		method: 'POST',
		body: formData,
		token,
		fetch: fetchFn
	});
}

export function remove(id: number | string, token: string, fetchFn?: typeof fetch) {
	return apiFetch<null>(`/api/admin/banners/${id}`, {
		method: 'DELETE',
		token,
		fetch: fetchFn
	});
}
