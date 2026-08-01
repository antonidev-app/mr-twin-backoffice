<script lang="ts">
	import './layout.css';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import favicon from '$lib/assets/favicon.svg';
	import ToastStack from '$lib/components/ToastStack.svelte';
	import { auth } from '$lib/stores/auth.svelte';

	let { children } = $props();

	const navItems = [
		{ href: resolve('/'), label: 'Dashboard' },
		{ href: resolve('/products'), label: 'Produk' },
		{ href: resolve('/orders'), label: 'Pesanan' }
	];

	function handleLogout() {
		auth.clear();
		goto(resolve('/login'));
	}
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

{#if auth.isLoggedIn && page.url.pathname !== '/login'}
	<div class="flex h-screen overflow-hidden bg-zinc-50">
		<aside class="flex w-56 shrink-0 flex-col border-r border-zinc-200 bg-white">
			<div class="flex shrink-0 items-center gap-2 border-b border-zinc-200 px-4 py-4">
				<span
					class="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900 text-xs font-bold tracking-tight text-white"
				>
					MT
				</span>
				<span class="text-sm font-semibold tracking-tight text-zinc-900">Mr. Twin Admin</span>
			</div>

			<nav class="min-h-0 flex-1 space-y-1 overflow-y-auto p-3 text-sm">
				{#each navItems as item (item.href)}
					<a
						href={item.href}
						class="block rounded-lg px-3 py-2 font-medium transition active:scale-[0.98] {page.url
							.pathname === item.href
							? 'bg-accent-50 text-accent-800'
							: 'text-zinc-700 hover:bg-zinc-100'}"
					>
						{item.label}
					</a>
				{/each}
			</nav>

			<div class="shrink-0 border-t border-zinc-200 p-3">
				<p class="truncate px-3 text-xs text-zinc-500">{auth.user?.email}</p>
				<button
					onclick={handleLogout}
					class="mt-1 w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 active:scale-[0.98]"
				>
					Logout
				</button>
			</div>
		</aside>

		<main class="flex-1 overflow-y-auto">
			{@render children()}
		</main>
	</div>
{:else}
	{@render children()}
{/if}

<ToastStack />
