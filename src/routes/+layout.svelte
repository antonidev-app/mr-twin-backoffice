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
	<div class="flex min-h-screen">
		<aside class="flex w-56 shrink-0 flex-col border-r border-zinc-200 bg-white">
			<div class="border-b border-zinc-200 px-4 py-4">
				<span class="text-lg font-bold tracking-tight text-zinc-900">Mr. Twin Admin</span>
			</div>

			<nav class="flex-1 space-y-1 p-3 text-sm">
				{#each navItems as item (item.href)}
					<a
						href={item.href}
						class="block rounded-md px-3 py-2 font-medium {page.url.pathname === item.href
							? 'bg-zinc-900 text-white'
							: 'text-zinc-700 hover:bg-zinc-100'}"
					>
						{item.label}
					</a>
				{/each}
			</nav>

			<div class="border-t border-zinc-200 p-3">
				<p class="truncate px-3 text-xs text-zinc-500">{auth.user?.email}</p>
				<button
					onclick={handleLogout}
					class="mt-1 w-full rounded-md px-3 py-2 text-left text-sm font-medium text-zinc-700 hover:bg-zinc-100"
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
