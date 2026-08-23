<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import Badge from '$lib/components/Badge.svelte';
	import Pagination from '$lib/components/Pagination.svelte';
	import Button from '$lib/components/Button.svelte';
	import { publishedClass } from '$lib/format';
	import { SvelteURLSearchParams } from 'svelte/reactivity';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	let q = $state('');
	let isActive = $state('');

	$effect(() => {
		q = data.filters.q ?? '';
		isActive = data.filters.is_active === undefined ? '' : String(data.filters.is_active);
	});

	function applyFilters(e: SubmitEvent) {
		e.preventDefault();
		const params = new SvelteURLSearchParams();
		if (q) params.set('q', q);
		if (isActive) params.set('is_active', isActive);
		goto(resolve(`/banners?${params.toString()}`));
	}

	function goToPage(pageNumber: number) {
		const params = new SvelteURLSearchParams();
		if (q) params.set('q', q);
		if (isActive) params.set('is_active', isActive);
		params.set('page', String(pageNumber));
		goto(resolve(`/banners?${params.toString()}`));
	}
</script>

<svelte:head>
	<title>Banner — Mr. Twin Admin</title>
</svelte:head>

<div class="px-8 py-8">
	<div class="mb-6 flex items-start justify-between gap-4">
		<div>
			<h1 class="mb-1 text-2xl font-semibold tracking-tight text-zinc-900">Banner</h1>
			<p class="text-sm text-zinc-500">{data.banners.meta.total} banner promosi</p>
		</div>
		<Button href={resolve('/banners/new')}>+ Tambah Banner</Button>
	</div>

	<form
		onsubmit={applyFilters}
		class="mb-6 flex flex-wrap items-end gap-3 rounded-xl border border-zinc-100 bg-white p-4 shadow-resting"
	>
		<div class="flex-1 basis-48">
			<label for="q" class="mb-1 block text-xs font-medium text-zinc-500">Cari</label>
			<input
				id="q"
				type="text"
				placeholder="Judul banner..."
				bind:value={q}
				class="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm focus:border-accent-500 focus:ring-4 focus:ring-accent-500/10 focus:outline-none"
			/>
		</div>
		<div>
			<label for="is_active" class="mb-1 block text-xs font-medium text-zinc-500">Status</label>
			<select
				id="is_active"
				bind:value={isActive}
				class="rounded-lg border border-zinc-200 px-3 py-2 text-sm focus:border-accent-500 focus:ring-4 focus:ring-accent-500/10 focus:outline-none"
			>
				<option value="">Semua</option>
				<option value="true">Aktif</option>
				<option value="false">Nonaktif</option>
			</select>
		</div>
		<Button type="submit" variant="dark">Terapkan</Button>
	</form>

	{#if data.banners.data.length === 0}
		<p class="text-sm text-zinc-500">Belum ada banner.</p>
	{:else}
		<div class="overflow-x-auto rounded-xl border border-zinc-100 bg-white shadow-resting">
			<table class="w-full text-left text-sm">
				<thead>
					<tr class="border-b border-zinc-200 bg-zinc-50 text-xs text-zinc-500">
						<th class="px-4 py-2.5 font-medium">Gambar</th>
						<th class="px-4 py-2.5 font-medium">Judul</th>
						<th class="px-4 py-2.5 font-medium">Urutan</th>
						<th class="px-4 py-2.5 font-medium">Status</th>
						<th class="px-4 py-2.5"></th>
					</tr>
				</thead>
				<tbody>
					{#each data.banners.data as banner (banner.id)}
						<tr class="border-b border-zinc-100 transition last:border-0 hover:bg-zinc-50">
							<td class="px-4 py-3">
								{#if banner.image}
									<img
										src={banner.image}
										alt={banner.title}
										class="h-10 w-20 rounded-md object-cover"
									/>
								{:else}
									<div class="h-10 w-20 rounded-md bg-zinc-100"></div>
								{/if}
							</td>
							<td class="max-w-xs truncate px-4 py-3 font-medium text-zinc-800">{banner.title}</td>
							<td class="px-4 py-3 font-mono text-zinc-700 tabular-nums">{banner.sort_order}</td>
							<td class="px-4 py-3">
								<Badge class={publishedClass(banner.is_active)}>
									{banner.is_active ? 'Aktif' : 'Nonaktif'}
								</Badge>
							</td>
							<td class="px-4 py-3 text-right">
								<a
									href={resolve('/banners/[id]', { id: String(banner.id) })}
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

		<Pagination meta={data.banners.meta} onNavigate={goToPage} />
	{/if}
</div>
