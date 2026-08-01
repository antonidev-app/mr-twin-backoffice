import { apiFetch } from './client';
import type { Paginated, SyncLog, SyncStatus } from './types';

export function triggerItems(token: string, fetchFn?: typeof fetch) {
	return apiFetch<{ message: string }>('/api/admin/sync/items', {
		method: 'POST',
		token,
		fetch: fetchFn
	});
}

export function triggerCategories(token: string, fetchFn?: typeof fetch) {
	return apiFetch<{ message: string }>('/api/admin/sync/categories', {
		method: 'POST',
		token,
		fetch: fetchFn
	});
}

export function logs(token: string, fetchFn?: typeof fetch) {
	return apiFetch<Paginated<SyncLog>>('/api/admin/sync/logs', { token, fetch: fetchFn });
}

export function status(token: string, fetchFn?: typeof fetch) {
	return apiFetch<SyncStatus>('/api/admin/sync/status', { token, fetch: fetchFn });
}
