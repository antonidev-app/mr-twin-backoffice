<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import Badge from '$lib/components/Badge.svelte';
	import Pagination from '$lib/components/Pagination.svelte';
	import { formatDate, formatPrice, orderStatusClass } from '$lib/format';
	import { SvelteURLSearchParams } from 'svelte/reactivity';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	let status = $derived(data.filters.status ?? '');

	function applyFilters() {
		const params = new SvelteURLSearchParams();
		if (status) params.set('status', status);
		goto(resolve(`/orders?${params.toString()}`));
	}

	function goToPage(pageNumber: number) {
		const params = new SvelteURLSearchParams();
		if (status) params.set('status', status);
		params.set('page', String(pageNumber));
		goto(resolve(`/orders?${params.toString()}`));
	}
</script>

<svelte:head>
	<title>Pesanan — Mr. Twin Admin</title>
</svelte:head>

<div class="px-8 py-8">
	<h1 class="mb-1 text-2xl font-semibold tracking-tight text-zinc-900">Pesanan</h1>
	<p class="mb-6 text-sm text-zinc-500">{data.orders.meta.total} pesanan</p>

	<div class="mb-6 flex items-end gap-3 rounded-lg bg-white p-4">
		<div>
			<label for="status" class="mb-1 block text-xs font-medium text-zinc-500">Status</label>
			<select
				id="status"
				bind:value={status}
				onchange={applyFilters}
				class="rounded-lg border border-zinc-200 px-3 py-2 text-sm focus:border-accent-500 focus:ring-2 focus:ring-accent-400/40 focus:outline-none"
			>
				<option value="">Semua</option>
				<option value="pending">Pending</option>
				<option value="processing">Processing</option>
				<option value="shipped">Shipped</option>
				<option value="completed">Completed</option>
				<option value="cancelled">Cancelled</option>
			</select>
		</div>
	</div>

	{#if data.orders.data.length === 0}
		<p class="text-sm text-zinc-500">Belum ada pesanan.</p>
	{:else}
		<div class="overflow-x-auto rounded-lg bg-white">
			<table class="w-full text-left text-sm">
				<thead>
					<tr class="border-b border-zinc-200 bg-zinc-50 text-xs text-zinc-500">
						<th class="px-4 py-2 font-medium">No. Order</th>
						<th class="px-4 py-2 font-medium">Customer</th>
						<th class="px-4 py-2 font-medium">Total</th>
						<th class="px-4 py-2 font-medium">Status</th>
						<th class="px-4 py-2 font-medium">Tanggal</th>
					</tr>
				</thead>
				<tbody>
					{#each data.orders.data as order (order.id)}
						<tr
							class="cursor-pointer border-b border-zinc-100 transition last:border-0 hover:bg-zinc-50"
						>
							<td class="px-4 py-3">
								<a
									href={resolve('/orders/[id]', { id: String(order.id) })}
									class="font-mono font-medium text-accent-700 hover:underline"
								>
									{order.order_number}
								</a>
							</td>
							<td class="px-4 py-3 text-zinc-700">
								{order.customer.name}
								<span class="block text-xs text-zinc-500">{order.customer.email}</span>
							</td>
							<td class="px-4 py-3 font-mono text-zinc-700 tabular-nums"
								>{formatPrice(order.total_amount)}</td
							>
							<td class="px-4 py-3">
								<Badge class={orderStatusClass(order.status)}>{order.status}</Badge>
							</td>
							<td class="px-4 py-3 text-zinc-500">{formatDate(order.created_at)}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>

		<Pagination meta={data.orders.meta} onNavigate={goToPage} />
	{/if}
</div>
