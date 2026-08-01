import { status as getConnectionStatus } from '$lib/api/accurate';
import { logs as getSyncLogs, status as getSyncStatus } from '$lib/api/sync';
import { auth } from '$lib/stores/auth.svelte';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
	const token = auth.token!;

	const [connection, syncStatus, syncLogs] = await Promise.all([
		getConnectionStatus(token, fetch),
		getSyncStatus(token, fetch),
		getSyncLogs(token, fetch)
	]);

	return { connection, syncStatus, syncLogs };
};
