import { apiFetch } from './client';
import type { AdminUser } from './types';

type AuthResponse = { user: AdminUser; token: string };

export function login(payload: { email: string; password: string }, fetchFn?: typeof fetch) {
	return apiFetch<AuthResponse>('/api/admin/login', {
		method: 'POST',
		body: payload,
		fetch: fetchFn
	});
}

export function logout(token: string, fetchFn?: typeof fetch) {
	return apiFetch<{ message: string }>('/api/admin/logout', {
		method: 'POST',
		token,
		fetch: fetchFn
	});
}
