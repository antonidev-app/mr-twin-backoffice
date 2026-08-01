<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { PUBLIC_API_BASE_URL } from '$env/static/public';
	import { listDatabases, selectDatabase } from '$lib/api/accurate';
	import { ApiError } from '$lib/api/client';
	import { triggerCategories, triggerItems } from '$lib/api/sync';
	import type { AccurateDatabase } from '$lib/api/types';
	import Badge from '$lib/components/Badge.svelte';
	import { formatDate, syncStatusClass } from '$lib/format';
	import { auth } from '$lib/stores/auth.svelte';
	import { toast } from '$lib/stores/toast.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	let databases = $state<AccurateDatabase[] | null>(null);
	let loadingDatabases = $state(false);
	let selecting = $state(false);
	let triggeringItems = $state(false);
	let triggeringCategories = $state(false);

	async function loadDatabases() {
		loadingDatabases = true;
		try {
			const result = await listDatabases(auth.token!);
			databases = result.data;
		} catch (err) {
			toast.show(err instanceof ApiError ? err.message : 'Gagal memuat daftar database.', 'error');
		} finally {
			loadingDatabases = false;
		}
	}

	async function pickDatabase(db: AccurateDatabase) {
		selecting = true;
		try {
			await selectDatabase({ id_db: String(db.id), db_alias: db.alias }, auth.token!);
			toast.show(`Terhubung ke database "${db.alias}".`);
			databases = null;
			await invalidateAll();
		} catch (err) {
			toast.show(err instanceof ApiError ? err.message : 'Gagal memilih database.', 'error');
		} finally {
			selecting = false;
		}
	}

	async function runTriggerItems() {
		triggeringItems = true;
		try {
			await triggerItems(auth.token!);
			toast.show('Sync item dijadwalkan. Pastikan queue worker jalan untuk memprosesnya.');
			await invalidateAll();
		} catch (err) {
			toast.show(err instanceof ApiError ? err.message : 'Gagal menjadwalkan sync.', 'error');
		} finally {
			triggeringItems = false;
		}
	}

	async function runTriggerCategories() {
		triggeringCategories = true;
		try {
			await triggerCategories(auth.token!);
			toast.show('Sync kategori dijadwalkan. Pastikan queue worker jalan untuk memprosesnya.');
			await invalidateAll();
		} catch (err) {
			toast.show(err instanceof ApiError ? err.message : 'Gagal menjadwalkan sync.', 'error');
		} finally {
			triggeringCategories = false;
		}
	}
</script>

<svelte:head>
	<title>Dashboard — Mr. Twin Admin</title>
</svelte:head>

<div class="space-y-6 px-8 py-8">
	<h1 class="text-2xl font-semibold tracking-tight text-zinc-900">Dashboard</h1>

	<section class="rounded-lg bg-white p-5">
		<h2 class="mb-4 text-sm font-semibold text-zinc-700">Koneksi Accurate</h2>

		<div class="mb-4 grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
			<div>
				<p class="text-xs text-zinc-500">Status</p>
				<p class="font-medium {data.connection.connected ? 'text-green-700' : 'text-red-600'}">
					{data.connection.connected ? 'Terhubung' : 'Belum terhubung'}
				</p>
			</div>
			<div>
				<p class="text-xs text-zinc-500">Database</p>
				<p class="font-medium text-zinc-900">{data.connection.db_alias ?? '—'}</p>
			</div>
			<div>
				<p class="text-xs text-zinc-500">Token Berlaku Hingga</p>
				<p class="font-medium text-zinc-900">
					{data.connection.token_expires_at ? formatDate(data.connection.token_expires_at) : '—'}
				</p>
			</div>
			<div>
				<p class="text-xs text-zinc-500">Error Terakhir</p>
				<p class="font-medium text-zinc-900">{data.connection.last_refresh_error ?? '—'}</p>
			</div>
		</div>

		<div class="flex flex-wrap items-center gap-3">
			<a
				href="{PUBLIC_API_BASE_URL}/accurate/connect"
				target="_blank"
				rel="noopener noreferrer external"
				class="rounded-lg bg-accent-400 px-4 py-2 text-sm font-semibold text-zinc-900 transition hover:bg-accent-300 active:scale-[0.98]"
			>
				Hubungkan ke Accurate
			</a>
			<button
				onclick={loadDatabases}
				disabled={loadingDatabases}
				class="rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 active:scale-[0.98] disabled:opacity-50"
			>
				{loadingDatabases ? 'Memuat...' : 'Muat Daftar Database'}
			</button>
		</div>
		<p class="mt-2 text-xs text-zinc-500">
			Setelah login Accurate berhasil di tab baru, kembali ke sini dan klik "Muat Daftar Database".
		</p>

		{#if databases}
			<div class="mt-4 space-y-2">
				{#each databases as db (db.id)}
					<div class="flex items-center justify-between rounded-lg bg-zinc-50 p-3 text-sm">
						<span class="font-medium text-zinc-800">{db.alias}</span>
						<button
							onclick={() => pickDatabase(db)}
							disabled={selecting}
							class="rounded-lg bg-accent-400 px-3 py-1.5 text-xs font-semibold text-zinc-900 transition hover:bg-accent-300 active:scale-[0.98] disabled:opacity-50"
						>
							Pilih
						</button>
					</div>
				{/each}
			</div>
		{/if}
	</section>

	<section class="rounded-lg bg-white p-5">
		<h2 class="mb-4 text-sm font-semibold text-zinc-700">Sinkronisasi Data</h2>

		<div class="mb-4 grid grid-cols-2 gap-4 text-sm">
			<div class="rounded-lg bg-zinc-50 p-3">
				<p class="text-xs text-zinc-500">Total Item Tersinkron</p>
				<p class="font-mono text-lg font-semibold text-zinc-900 tabular-nums">
					{data.syncStatus.items.total}
				</p>
			</div>
			<div class="rounded-lg bg-zinc-50 p-3">
				<p class="text-xs text-zinc-500">Total Kategori Tersinkron</p>
				<p class="font-mono text-lg font-semibold text-zinc-900 tabular-nums">
					{data.syncStatus.categories.total}
				</p>
			</div>
		</div>

		<div class="mb-4 flex flex-wrap gap-3">
			<button
				onclick={runTriggerItems}
				disabled={triggeringItems}
				class="rounded-lg bg-accent-400 px-4 py-2 text-sm font-semibold text-zinc-900 transition hover:bg-accent-300 active:scale-[0.98] disabled:opacity-50"
			>
				{triggeringItems ? 'Menjadwalkan...' : 'Sync Item Sekarang'}
			</button>
			<button
				onclick={runTriggerCategories}
				disabled={triggeringCategories}
				class="rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 active:scale-[0.98] disabled:opacity-50"
			>
				{triggeringCategories ? 'Menjadwalkan...' : 'Sync Kategori Sekarang'}
			</button>
		</div>

		<h3 class="mb-2 text-xs font-semibold tracking-wide text-zinc-500 uppercase">
			Log Sinkronisasi Terbaru
		</h3>
		{#if data.syncLogs.data.length === 0}
			<p class="text-sm text-zinc-500">Belum ada log sinkronisasi.</p>
		{:else}
			<div class="overflow-x-auto">
				<table class="w-full text-left text-sm">
					<thead>
						<tr class="text-xs text-zinc-500">
							<th class="pb-2 font-medium">Tipe</th>
							<th class="pb-2 font-medium">Status</th>
							<th class="pb-2 font-medium">Jumlah</th>
							<th class="pb-2 font-medium">Mulai</th>
						</tr>
					</thead>
					<tbody>
						{#each data.syncLogs.data.slice(0, 10) as log (log.id)}
							<tr class="border-t border-zinc-100">
								<td class="py-2 capitalize">{log.type}</td>
								<td class="py-2">
									<Badge class={syncStatusClass(log.status)}>{log.status}</Badge>
								</td>
								<td class="py-2 font-mono tabular-nums">{log.synced_count ?? '—'}</td>
								<td class="py-2 text-zinc-500">{formatDate(log.started_at)}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{/if}
	</section>
</div>
