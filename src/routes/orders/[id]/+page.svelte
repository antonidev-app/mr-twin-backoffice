<script lang="ts">
	import { resolve } from '$app/paths';
	import { ApiError } from '$lib/api/client';
	import { updateStatus } from '$lib/api/orders';
	import Badge from '$lib/components/Badge.svelte';
	import { formatDate, formatPrice, orderStatusClass } from '$lib/format';
	import { auth } from '$lib/stores/auth.svelte';
	import { toast } from '$lib/stores/toast.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	// Writable $derived: tracks data.order reactively (e.g. navigating
	// between /orders/[id] pages, which SvelteKit reuses this component
	// instance for), but can also be reassigned directly after a status
	// update to reflect the result without a full reload.
	let order = $derived(data.order);
	let newStatus = $derived(order.status);
	let updating = $state(false);

	async function saveStatus() {
		updating = true;
		try {
			const result = await updateStatus(order.id, newStatus, auth.token!);
			order = result.data;
			toast.show('Status pesanan diperbarui.');
		} catch (err) {
			toast.show(err instanceof ApiError ? err.message : 'Gagal memperbarui status.', 'error');
		} finally {
			updating = false;
		}
	}
</script>

<svelte:head>
	<title>{order.order_number} — Mr. Twin Admin</title>
</svelte:head>

<div class="px-8 py-8">
	<div class="mx-auto">
		<a
			href={resolve('/orders')}
			class="mb-4 inline-block text-sm text-zinc-500 transition hover:text-accent-700"
		>
			&larr; Kembali ke Pesanan
		</a>

		<div class="rounded-lg bg-white p-5">
			<div class="mb-4 flex items-start justify-between">
				<div>
					<h1 class="font-mono text-lg font-bold text-zinc-900">{order.order_number}</h1>
					<p class="text-xs text-zinc-500">{formatDate(order.created_at)}</p>
				</div>
				<Badge class={orderStatusClass(order.status)}>{order.status}</Badge>
			</div>

			<div class="mb-4 border-t border-zinc-100 pt-4">
				<h2 class="mb-2 text-sm font-semibold text-zinc-700">Customer</h2>
				<p class="text-sm text-zinc-700">{order.customer.name}</p>
				<p class="text-sm text-zinc-500">{order.customer.email}</p>
				{#if order.customer.phone}
					<p class="text-sm text-zinc-500">{order.customer.phone}</p>
				{/if}
			</div>

			<div class="mb-4 border-t border-zinc-100 pt-4">
				<h2 class="mb-2 text-sm font-semibold text-zinc-700">Item</h2>
				{#each order.items as item (item.sku)}
					<div class="flex justify-between py-1 text-sm text-zinc-600">
						<span>{item.item_name} × {item.quantity}</span>
						<span class="font-mono tabular-nums">{formatPrice(item.subtotal)}</span>
					</div>
				{/each}
				<div
					class="mt-2 flex justify-between border-t border-zinc-100 pt-2 text-sm font-semibold text-zinc-900"
				>
					<span>Total</span>
					<span class="font-mono tabular-nums">{formatPrice(order.total_amount)}</span>
				</div>
			</div>

			<div class="mb-4 border-t border-zinc-100 pt-4">
				<h2 class="mb-2 text-sm font-semibold text-zinc-700">Pengiriman</h2>
				<p class="text-sm text-zinc-600">{order.shipping_name}</p>
				<p class="text-sm text-zinc-600">{order.shipping_phone}</p>
				<p class="text-sm text-zinc-600">{order.shipping_address}</p>
			</div>

			<div class="border-t border-zinc-100 pt-4">
				<h2 class="mb-2 text-sm font-semibold text-zinc-700">Ubah Status</h2>
				<div class="flex items-center gap-3">
					<select
						bind:value={newStatus}
						class="rounded-lg border border-zinc-200 px-3 py-2 text-sm focus:border-accent-500 focus:ring-2 focus:ring-accent-400/40 focus:outline-none"
					>
						<option value="pending">Pending</option>
						<option value="processing">Processing</option>
						<option value="shipped">Shipped</option>
						<option value="completed">Completed</option>
						<option value="cancelled">Cancelled</option>
					</select>
					<button
						onclick={saveStatus}
						disabled={updating || newStatus === order.status}
						class="rounded-lg bg-accent-400 px-4 py-2 text-sm font-semibold text-zinc-900 transition hover:bg-accent-300 active:scale-[0.98] disabled:opacity-50"
					>
						{updating ? 'Menyimpan...' : 'Update Status'}
					</button>
				</div>
			</div>
		</div>
	</div>
</div>
