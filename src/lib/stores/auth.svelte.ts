import { browser } from '$app/environment';
import type { AdminUser } from '$lib/api/types';

const STORAGE_KEY = 'mr_twin_admin_auth';

type Session = { token: string; user: AdminUser };

function loadInitial(): Session | null {
	if (!browser) return null;
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		return raw ? JSON.parse(raw) : null;
	} catch {
		return null;
	}
}

class AuthStore {
	#session = $state<Session | null>(loadInitial());

	get token() {
		return this.#session?.token ?? null;
	}

	get user() {
		return this.#session?.user ?? null;
	}

	get isLoggedIn() {
		return this.#session !== null;
	}

	setSession(token: string, user: AdminUser) {
		this.#session = { token, user };
		if (browser) localStorage.setItem(STORAGE_KEY, JSON.stringify(this.#session));
	}

	clear() {
		this.#session = null;
		if (browser) localStorage.removeItem(STORAGE_KEY);
	}
}

export const auth = new AuthStore();
