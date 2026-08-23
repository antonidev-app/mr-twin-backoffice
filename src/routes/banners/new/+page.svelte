<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { ApiError } from '$lib/api/client';
	import { create } from '$lib/api/banners';
	import Button from '$lib/components/Button.svelte';
	import { auth } from '$lib/stores/auth.svelte';
	import { toast } from '$lib/stores/toast.svelte';

	let title = $state('');
	let linkUrl = $state('');
	let isActive = $state(true);
	let sortOrder = $state(0);
	let image = $state<File | null>(null);
	let saving = $state(false);

	function handleFile(e: Event) {
		const input = e.currentTarget as HTMLInputElement;
		image = input.files?.[0] ?? null;
	}

	async function save(e: SubmitEvent) {
		e.preventDefault();
		if (!image) {
			toast.show('Gambar wajib diunggah.', 'error');
			return;
		}

		saving = true;
		try {
			await create(
				{ title, link_url: linkUrl, is_active: isActive, sort_order: sortOrder, image },
				auth.token!
			);
			toast.show('Banner ditambahkan.');
			goto(resolve('/banners'));
		} catch (err) {
			toast.show(err instanceof ApiError ? err.message : 'Gagal menambahkan banner.', 'error');
		} finally {
			saving = false;
		}
	}
</script>

<svelte:head>
	<title>Tambah Banner — Mr. Twin Admin</title>
</svelte:head>

<div class="px-8 py-8">
	<div class="mx-auto">
		<a
			href={resolve('/banners')}
			class="mb-4 inline-block text-sm text-zinc-500 transition hover:text-accent-700"
		>
			&larr; Kembali ke Banner
		</a>

		<h1 class="mb-6 text-2xl font-semibold tracking-tight text-zinc-900">Tambah Banner</h1>

		<form onsubmit={save} class="space-y-4 rounded-2xl border border-zinc-100 bg-white p-6 shadow-resting">
			<div>
				<label for="title" class="mb-1.5 block text-sm font-medium text-zinc-700">Judul</label>
				<input
					id="title"
					type="text"
					required
					bind:value={title}
					class="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm focus:border-accent-500 focus:ring-4 focus:ring-accent-500/10 focus:outline-none"
				/>
			</div>

			<div>
				<label for="link_url" class="mb-1.5 block text-sm font-medium text-zinc-700"
					>Link Tujuan (opsional)</label
				>
				<input
					id="link_url"
					type="text"
					placeholder="https://..."
					bind:value={linkUrl}
					class="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm focus:border-accent-500 focus:ring-4 focus:ring-accent-500/10 focus:outline-none"
				/>
			</div>

			<div class="grid grid-cols-2 gap-4">
				<label class="flex items-center gap-2 text-sm text-zinc-700">
					<input type="checkbox" bind:checked={isActive} class="accent-accent-600" />
					Aktif
				</label>
				<div>
					<label for="sort_order" class="mb-1.5 block text-sm font-medium text-zinc-700"
						>Urutan Tampil</label
					>
					<input
						id="sort_order"
						type="number"
						bind:value={sortOrder}
						class="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm focus:border-accent-500 focus:ring-4 focus:ring-accent-500/10 focus:outline-none"
					/>
				</div>
			</div>

			<div>
				<label for="image" class="mb-1.5 block text-sm font-medium text-zinc-700">Gambar</label>
				<input
					id="image"
					type="file"
					accept="image/*"
					required
					onchange={handleFile}
					class="block w-full text-sm text-zinc-600"
				/>
			</div>

			<Button type="submit" disabled={saving}>
				{saving ? 'Menyimpan...' : 'Simpan Banner'}
			</Button>
		</form>
	</div>
</div>
