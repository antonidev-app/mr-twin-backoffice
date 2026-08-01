<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import Badge from '$lib/components/Badge.svelte';
	import Pagination from '$lib/components/Pagination.svelte';
	import { formatPrice, publishedClass } from '$lib/format';
	import { SvelteURLSearchParams } from 'svelte/reactivity';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	let q = $state('');
	let isPublished = $state('');
	let suspended = $state(false);

	$effect(() => {
		q = data.filters.q ?? '';
		isPublished = data.filters.is_published === undefined ? '' : String(data.filters.is_published);
		suspended = data.filters.suspended ?? false;
	});

	function applyFilters(e: SubmitEvent) {
		e.preventDefault();
		const params = new SvelteURLSearchParams();
		if (q) params.set('q', q);
		if (isPublished) params.set('is_published', isPublished);
		if (suspended) params.set('suspended', 'true');
		goto(resolve(`/products?${params.toString()}`));
	}

	function goToPage(pageNumber: number) {
		const params = new SvelteURLSearchParams();
		if (q) params.set('q', q);
		if (isPublished) params.set('is_published', isPublished);
		if (suspended) params.set('suspended', 'true');
		params.set('page', String(pageNumber));
		goto(resolve(`/products?${params.toString()}`));
	}
</script>

<svelte:head>
	<title>Produk — Mr. Twin Admin</title>
</svelte:head>

<div class="mx-auto max-w-5xl px-6 py-6">
	<h1 class="mb-1 text-2xl font-bold tracking-tight text-zinc-900">Produk</h1>
	<p class="mb-6 text-sm text-zinc-500">{data.products.meta.total} item tersinkron dari Accurate</p>

	<form
		onsubmit={applyFilters}
		class="mb-6 flex flex-wrap items-end gap-3 rounded-xl border border-zinc-200 p-4"
	>
		<div class="flex-1 basis-48">
			<label for="q" class="mb-1 block text-xs font-medium text-zinc-500">Cari</label>
			<input
				id="q"
				type="text"
				placeholder="Nama atau SKU..."
				bind:value={q}
				class="w-full rounded-md border border-zinc-200 px-3 py-2 text-sm"
			/>
		</div>
		<div>
			<label for="is_published" class="mb-1 block text-xs font-medium text-zinc-500">Status</label>
			<select
				id="is_published"
				bind:value={isPublished}
				class="rounded-md border border-zinc-200 px-3 py-2 text-sm"
			>
				<option value="">Semua</option>
				<option value="true">Published</option>
				<option value="false">Belum Published</option>
			</select>
		</div>
		<label class="flex items-center gap-2 pb-2 text-sm text-zinc-700">
			<input type="checkbox" bind:checked={suspended} class="accent-blue-600" />
			Suspended saja
		</label>
		<button
			type="submit"
			class="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700"
		>
			Terapkan
		</button>
	</form>

	{#if data.products.data.length === 0}
		<p class="text-sm text-zinc-500">Tidak ada produk ditemukan.</p>
	{:else}
		<div class="overflow-x-auto rounded-xl border border-zinc-200">
			<table class="w-full text-left text-sm">
				<thead>
					<tr class="border-b border-zinc-200 bg-zinc-50 text-xs text-zinc-500">
						<th class="px-4 py-2 font-medium">Nama</th>
						<th class="px-4 py-2 font-medium">SKU</th>
						<th class="px-4 py-2 font-medium">Harga</th>
						<th class="px-4 py-2 font-medium">Stok</th>
						<th class="px-4 py-2 font-medium">Kategori</th>
						<th class="px-4 py-2 font-medium">Status</th>
						<th class="px-4 py-2"></th>
					</tr>
				</thead>
				<tbody>
					{#each data.products.data as product (product.id)}
						<tr class="border-b border-zinc-100 last:border-0">
							<td class="max-w-xs truncate px-4 py-3 font-medium text-zinc-800">{product.name}</td>
							<td class="px-4 py-3 text-zinc-500">{product.sku ?? '—'}</td>
							<td class="px-4 py-3 text-zinc-700">{formatPrice(product.unit_price)}</td>
							<td class="px-4 py-3 text-zinc-700">{product.stock}</td>
							<td class="px-4 py-3 text-zinc-500"
								>{product.product_display?.display_category ?? '—'}</td
							>
							<td class="px-4 py-3">
								<Badge class={publishedClass(product.product_display?.is_published ?? false)}>
									{product.product_display?.is_published ? 'Published' : 'Draft'}
								</Badge>
							</td>
							<td class="px-4 py-3 text-right">
								<a
									href={resolve('/products/[id]', { id: String(product.id) })}
									class="text-sm font-medium text-blue-600 hover:underline"
								>
									Edit
								</a>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>

		<Pagination meta={data.products.meta} onNavigate={goToPage} />
	{/if}
</div>
