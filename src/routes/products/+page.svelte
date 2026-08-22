<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import Badge from '$lib/components/Badge.svelte';
	import Pagination from '$lib/components/Pagination.svelte';
	import Button from '$lib/components/Button.svelte';
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

<div class="px-8 py-8">
	<h1 class="mb-1 text-2xl font-semibold tracking-tight text-zinc-900">Produk</h1>
	<p class="mb-6 text-sm text-zinc-500">{data.products.meta.total} item tersinkron dari Accurate</p>

	<form
		onsubmit={applyFilters}
		class="mb-6 flex flex-wrap items-end gap-3 rounded-xl border border-zinc-100 bg-white p-4 shadow-resting"
	>
		<div class="flex-1 basis-48">
			<label for="q" class="mb-1 block text-xs font-medium text-zinc-500">Cari</label>
			<input
				id="q"
				type="text"
				placeholder="Nama atau SKU..."
				bind:value={q}
				class="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm focus:border-accent-500 focus:ring-4 focus:ring-accent-500/10 focus:outline-none"
			/>
		</div>
		<div>
			<label for="is_published" class="mb-1 block text-xs font-medium text-zinc-500">Status</label>
			<select
				id="is_published"
				bind:value={isPublished}
				class="rounded-lg border border-zinc-200 px-3 py-2 text-sm focus:border-accent-500 focus:ring-4 focus:ring-accent-500/10 focus:outline-none"
			>
				<option value="">Semua</option>
				<option value="true">Published</option>
				<option value="false">Belum Published</option>
			</select>
		</div>
		<label class="flex items-center gap-2 pb-2 text-sm text-zinc-700">
			<input type="checkbox" bind:checked={suspended} class="accent-accent-600" />
			Suspended saja
		</label>
		<Button type="submit" variant="dark">Terapkan</Button>
	</form>

	{#if data.products.data.length === 0}
		<p class="text-sm text-zinc-500">Tidak ada produk ditemukan.</p>
	{:else}
		<div class="overflow-x-auto rounded-xl border border-zinc-100 bg-white shadow-resting">
			<table class="w-full text-left text-sm">
				<thead>
					<tr class="border-b border-zinc-200 bg-zinc-50 text-xs text-zinc-500">
						<th class="px-4 py-2.5 font-medium">Nama</th>
						<th class="px-4 py-2.5 font-medium">SKU</th>
						<th class="px-4 py-2.5 font-medium">Harga</th>
						<th class="px-4 py-2.5 font-medium">Stok</th>
						<th class="px-4 py-2.5 font-medium">Kategori</th>
						<th class="px-4 py-2.5 font-medium">Status</th>
						<th class="px-4 py-2.5"></th>
					</tr>
				</thead>
				<tbody>
					{#each data.products.data as product (product.id)}
						<tr class="border-b border-zinc-100 transition last:border-0 hover:bg-zinc-50">
							<td class="max-w-xs truncate px-4 py-3 font-medium text-zinc-800">{product.name}</td>
							<td class="px-4 py-3 font-mono text-zinc-500">{product.sku ?? '—'}</td>
							<td class="px-4 py-3 font-mono text-zinc-700 tabular-nums"
								>{formatPrice(product.unit_price)}</td
							>
							<td class="px-4 py-3 font-mono text-zinc-700 tabular-nums">{product.stock}</td>
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
									class="text-sm font-medium text-accent-700 hover:underline"
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
