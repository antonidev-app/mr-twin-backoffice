<script lang="ts">
	import { resolve } from '$app/paths';
	import { ApiError } from '$lib/api/client';
	import { aiDraft, deleteImage, update, uploadImage } from '$lib/api/products';
	import Badge from '$lib/components/Badge.svelte';
	import { formatPrice, publishedClass } from '$lib/format';
	import { auth } from '$lib/stores/auth.svelte';
	import { toast } from '$lib/stores/toast.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	// Writable $derived: tracks data.product reactively (e.g. navigating
	// between /products/[id] pages, which SvelteKit reuses this component
	// instance for), but can also be reassigned directly after a
	// save/upload/delete to reflect the result without a full reload.
	let product = $derived(data.product);

	let isPublished = $state(false);
	let displayName = $state('');
	let description = $state('');
	let displayCategory = $state('');
	let brand = $state('');
	let sortOrder = $state(0);
	let saving = $state(false);
	let uploading = $state(false);
	let drafting = $state(false);
	let aiSources = $state<string[] | null>(null);

	$effect(() => {
		const curation = product.product_display;
		isPublished = curation?.is_published ?? false;
		displayName = curation?.display_name ?? '';
		description = curation?.description ?? '';
		displayCategory = curation?.display_category ?? '';
		brand = curation?.brand ?? '';
		sortOrder = curation?.sort_order ?? 0;
	});

	async function save(e: SubmitEvent) {
		e.preventDefault();
		saving = true;

		try {
			const result = await update(
				product.id,
				{
					is_published: isPublished,
					display_name: displayName || null,
					description: description || null,
					display_category: displayCategory || null,
					brand: brand || null,
					sort_order: sortOrder
				},
				auth.token!
			);
			product = result.data;
			aiSources = null;
			toast.show('Perubahan disimpan.');
		} catch (err) {
			toast.show(err instanceof ApiError ? err.message : 'Gagal menyimpan perubahan.', 'error');
		} finally {
			saving = false;
		}
	}

	async function runAiDraft() {
		drafting = true;
		try {
			const draft = await aiDraft(product.id, auth.token!);
			displayName = draft.display_name;
			description = draft.description;
			displayCategory = draft.display_category;
			brand = draft.brand;
			aiSources = draft.sources;
			toast.show('Draft AI siap, review sebelum menyimpan.');
		} catch (err) {
			toast.show(err instanceof ApiError ? err.message : 'Gagal menghasilkan draft AI.', 'error');
		} finally {
			drafting = false;
		}
	}

	async function handleUpload(e: Event) {
		const input = e.currentTarget as HTMLInputElement;
		const file = input.files?.[0];
		if (!file) return;

		uploading = true;
		try {
			const result = await uploadImage(product.id, file, auth.token!);
			product = result.data;
			toast.show('Gambar ditambahkan.');
		} catch (err) {
			toast.show(err instanceof ApiError ? err.message : 'Gagal mengunggah gambar.', 'error');
		} finally {
			uploading = false;
			input.value = '';
		}
	}

	async function removeImage(url: string) {
		try {
			const result = await deleteImage(product.id, url, auth.token!);
			product = result.data;
			toast.show('Gambar dihapus.');
		} catch (err) {
			toast.show(err instanceof ApiError ? err.message : 'Gagal menghapus gambar.', 'error');
		}
	}
</script>

<svelte:head>
	<title>{product.name} — Mr. Twin Admin</title>
</svelte:head>

<div class="px-8 py-8">
	<div class="mx-auto">
		<a
			href={resolve('/products')}
			class="mb-4 inline-block text-sm text-zinc-500 transition hover:text-accent-700"
		>
			&larr; Kembali ke Produk
		</a>

		<div class="mb-6 flex items-start justify-between gap-4">
			<div>
				<h1 class="mb-1 text-2xl font-semibold tracking-tight text-zinc-900">{product.name}</h1>
				<p class="font-mono text-sm text-zinc-500">SKU {product.sku ?? '—'}</p>
			</div>
			<Badge class={publishedClass(product.product_display?.is_published ?? false)}>
				{product.product_display?.is_published ? 'Published' : 'Draft'}
			</Badge>
		</div>

		<div class="mb-6 rounded-lg bg-white p-5">
			<h2 class="mb-3 text-sm font-semibold text-zinc-700">Data Accurate (read-only)</h2>
			<div class="grid grid-cols-2 gap-4 text-sm sm:grid-cols-3">
				<div>
					<p class="text-xs text-zinc-500">Nama</p>
					<p class="font-medium text-zinc-900">{product.name}</p>
				</div>
				<div>
					<p class="text-xs text-zinc-500">SKU</p>
					<p class="font-mono font-medium text-zinc-900">{product.sku ?? '—'}</p>
				</div>
				<div>
					<p class="text-xs text-zinc-500">Harga</p>
					<p class="font-mono font-medium text-zinc-900 tabular-nums">
						{formatPrice(product.unit_price)}
					</p>
				</div>
				<div>
					<p class="text-xs text-zinc-500">Stok</p>
					<p class="font-mono font-medium text-zinc-900 tabular-nums">{product.stock}</p>
				</div>
				<div>
					<p class="text-xs text-zinc-500">Tipe</p>
					<p class="font-medium text-zinc-900">{product.item_type ?? '—'}</p>
				</div>
				<div>
					<p class="text-xs text-zinc-500">Suspended</p>
					<p class="font-medium text-zinc-900">{product.suspended ? 'Ya' : 'Tidak'}</p>
				</div>
			</div>
		</div>

		<form onsubmit={save} class="mb-6 space-y-4 rounded-lg bg-white p-5">
			<div class="flex items-center justify-between gap-4">
				<h2 class="text-sm font-semibold text-zinc-700">Kurasi Storefront</h2>
				<button
					type="button"
					disabled={drafting}
					onclick={runAiDraft}
					class="rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 active:scale-[0.98] disabled:opacity-50"
				>
					{drafting ? 'Menghasilkan draft...' : '✨ Draft dengan AI'}
				</button>
			</div>

			<label class="flex items-center gap-2 text-sm text-zinc-700">
				<input type="checkbox" bind:checked={isPublished} class="accent-accent-600" />
				Tampilkan di storefront (published)
			</label>

			<div>
				<label for="display_name" class="mb-1 block text-sm font-medium text-zinc-700"
					>Nama Tampilan (opsional)</label
				>
				<input
					id="display_name"
					type="text"
					bind:value={displayName}
					placeholder={product.name}
					class="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm focus:border-accent-500 focus:ring-2 focus:ring-accent-400/40 focus:outline-none"
				/>
			</div>

			<div>
				<label for="description" class="mb-1 block text-sm font-medium text-zinc-700"
					>Deskripsi</label
				>
				<textarea
					id="description"
					rows="7"
					bind:value={description}
					class="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm focus:border-accent-500 focus:ring-2 focus:ring-accent-400/40 focus:outline-none"
				></textarea>
				{#if aiSources && aiSources.length > 0}
					<div class="mt-1 text-xs text-zinc-500">
						Sumber referensi AI:
						{#each aiSources as url, i (url)}
							<!-- prettier-ignore -->
							{i > 0 ? ', ' : ' '}<a href={url} target="_blank" rel="noopener noreferrer" class="underline hover:text-accent-700">{url}</a><!-- eslint-disable-line svelte/no-navigation-without-resolve -- external AI-supplied source URL, not a SvelteKit route -->
						{/each}
					</div>
				{/if}
			</div>

			<div class="grid grid-cols-2 gap-4">
				<div>
					<label for="display_category" class="mb-1 block text-sm font-medium text-zinc-700"
						>Kategori Storefront</label
					>
					<input
						id="display_category"
						type="text"
						bind:value={displayCategory}
						class="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm focus:border-accent-500 focus:ring-2 focus:ring-accent-400/40 focus:outline-none"
					/>
				</div>
				<div>
					<label for="brand" class="mb-1 block text-sm font-medium text-zinc-700">Brand</label>
					<input
						id="brand"
						type="text"
						bind:value={brand}
						class="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm focus:border-accent-500 focus:ring-2 focus:ring-accent-400/40 focus:outline-none"
					/>
				</div>
			</div>

			<div>
				<label for="sort_order" class="mb-1 block text-sm font-medium text-zinc-700"
					>Urutan Tampil</label
				>
				<input
					id="sort_order"
					type="number"
					bind:value={sortOrder}
					class="w-32 rounded-lg border border-zinc-200 px-3 py-2 text-sm focus:border-accent-500 focus:ring-2 focus:ring-accent-400/40 focus:outline-none"
				/>
			</div>

			<button
				type="submit"
				disabled={saving}
				class="rounded-lg bg-accent-400 px-4 py-2 text-sm font-semibold text-zinc-900 transition hover:bg-accent-300 active:scale-[0.98] disabled:opacity-50"
			>
				{saving ? 'Menyimpan...' : 'Simpan Perubahan'}
			</button>
		</form>

		<div class="rounded-lg bg-white p-5">
			<h2 class="mb-3 text-sm font-semibold text-zinc-700">Gambar Produk</h2>

			{#if product.product_display && product.product_display.images.length > 0}
				<div class="mb-4 grid grid-cols-3 gap-3 sm:grid-cols-4">
					{#each product.product_display.images as url (url)}
						<div class="group relative aspect-square overflow-hidden rounded-lg bg-zinc-100">
							<img src={url} alt={product.name} class="h-full w-full object-cover" />
							<button
								onclick={() => removeImage(url)}
								class="absolute top-1 right-1 rounded-full bg-zinc-900/70 p-1 text-white opacity-0 transition group-hover:opacity-100"
								aria-label="Hapus gambar"
							>
								<svg viewBox="0 0 20 20" fill="currentColor" class="h-4 w-4">
									<path
										d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z"
									/>
								</svg>
							</button>
						</div>
					{/each}
				</div>
			{:else}
				<p class="mb-4 text-sm text-zinc-500">Belum ada gambar.</p>
			{/if}

			<label class="block text-sm font-medium text-zinc-700">
				Tambah gambar
				<input
					type="file"
					accept="image/*"
					disabled={uploading}
					onchange={handleUpload}
					class="mt-1 block w-full text-sm text-zinc-600"
				/>
			</label>
			{#if uploading}
				<p class="mt-1 text-xs text-zinc-500">Mengunggah...</p>
			{/if}
		</div>
	</div>
</div>
