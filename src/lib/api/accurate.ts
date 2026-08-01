import { apiFetch } from './client';
import type { AccurateDatabase, ConnectionStatus } from './types';

export function listDatabases(token: string, fetchFn?: typeof fetch) {
	return apiFetch<{ data: AccurateDatabase[] }>('/api/admin/accurate/databases', {
		token,
		fetch: fetchFn
	});
}

export function selectDatabase(
	payload: { id_db: string; db_alias?: string },
	token: string,
	fetchFn?: typeof fetch
) {
	return apiFetch<ConnectionStatus>('/api/admin/accurate/databases/select', {
		method: 'POST',
		body: payload,
		token,
		fetch: fetchFn
	});
}

export function status(token: string, fetchFn?: typeof fetch) {
	return apiFetch<ConnectionStatus>('/api/admin/accurate/status', { token, fetch: fetchFn });
}
