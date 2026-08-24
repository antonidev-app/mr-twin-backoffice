<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { updatePriceCategory } from '$lib/api/customers';
	import { ApiError } from '$lib/api/client';
	import Pagination from '$lib/components/Pagination.svelte';
	import Button from '$lib/components/Button.svelte';
	import { auth } from '$lib/stores/auth.svelte';
	import { toast } from '$lib/stores/toast.svelte';
	import { SvelteURLSearchParams } from 'svelte/reactivity';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	let q = $derived(data.filters.q ?? '');
	let savingId = $state<number | null>(null);

	function applyFilters(e: SubmitEvent) {
		e.preventDefault();
		const params = new SvelteURLSearchParams();
		if (q) params.set('q', q);
		goto(resolve(`/customers?${params.toString()}`));
	}

	function goToPage(pageNumber: number) {
		const params = new SvelteURLSearchParams();
		if (q) params.set('q', q);
		params.set('page', String(pageNumber));
		goto(resolve(`/customers?${params.toString()}`));
	}

	async function changeTier(customerId: number, value: string) {
		savingId = customerId;
		try {
			await updatePriceCategory(customerId, value ? Number(value) : null, auth.token!);
			toast.show('Tier harga customer diperbarui.');
			await invalidateAll();
		} catch (err) {
			toast.show(err instanceof ApiError ? err.message : 'Gagal memperbarui tier harga.', 'error');
		} finally {
			savingId = null;
		}
	}
</script>

<svelte:head>
	<title>Customer — Mr. Twin Admin</title>
</svelte:head>

<div class="px-8 py-8">
	<h1 class="mb-1 text-2xl font-semibold tracking-tight text-zinc-900">Customer</h1>
	<p class="mb-6 text-sm text-zinc-500">
		{data.customers.meta.total} customer terdaftar. Assign tier harga supaya customer melihat harga
		sesuai price category Accurate.
	</p>

	<form
		onsubmit={applyFilters}
		class="mb-6 flex flex-wrap items-end gap-3 rounded-xl border border-zinc-100 bg-white p-4 shadow-resting"
	>
		<div class="flex-1 basis-48">
			<label for="q" class="mb-1 block text-xs font-medium text-zinc-500">Cari</label>
			<input
				id="q"
				type="text"
				placeholder="Nama atau email..."
				bind:value={q}
				class="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm focus:border-accent-500 focus:ring-4 focus:ring-accent-500/10 focus:outline-none"
			/>
		</div>
		<Button type="submit" variant="dark">Terapkan</Button>
	</form>

	{#if data.customers.data.length === 0}
		<p class="text-sm text-zinc-500">Tidak ada customer ditemukan.</p>
	{:else}
		<div class="overflow-x-auto rounded-xl border border-zinc-100 bg-white shadow-resting">
			<table class="w-full text-left text-sm">
				<thead>
					<tr class="border-b border-zinc-200 bg-zinc-50 text-xs text-zinc-500">
						<th class="px-4 py-2.5 font-medium">Nama</th>
						<th class="px-4 py-2.5 font-medium">Email</th>
						<th class="px-4 py-2.5 font-medium">Telepon</th>
						<th class="px-4 py-2.5 font-medium">Tier Harga</th>
					</tr>
				</thead>
				<tbody>
					{#each data.customers.data as customer (customer.id)}
						<tr class="border-b border-zinc-100 transition last:border-0 hover:bg-zinc-50">
							<td class="px-4 py-3 font-medium text-zinc-800">{customer.name}</td>
							<td class="px-4 py-3 text-zinc-500">{customer.email}</td>
							<td class="px-4 py-3 text-zinc-500">{customer.phone ?? '—'}</td>
							<td class="px-4 py-3">
								<select
									value={customer.price_category_id ?? ''}
									disabled={savingId === customer.id}
									onchange={(e) => changeTier(customer.id, e.currentTarget.value)}
									class="rounded-lg border border-zinc-200 px-3 py-1.5 text-sm focus:border-accent-500 focus:ring-4 focus:ring-accent-500/10 focus:outline-none"
								>
									<option value="">Default (harga umum)</option>
									{#each data.priceCategories as category (category.id)}
										<option value={category.id}>{category.name ?? `#${category.accurate_id}`}</option
										>
									{/each}
								</select>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>

		<Pagination meta={data.customers.meta} onNavigate={goToPage} />
	{/if}
</div>
