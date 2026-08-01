<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { login } from '$lib/api/auth';
	import { ApiError } from '$lib/api/client';
	import { auth } from '$lib/stores/auth.svelte';

	let email = $state('');
	let password = $state('');
	let submitting = $state(false);
	let errorMessage = $state('');

	async function submit(e: SubmitEvent) {
		e.preventDefault();
		errorMessage = '';
		submitting = true;

		try {
			const { user, token } = await login({ email, password });
			auth.setSession(token, user);
			goto(resolve('/'));
		} catch (err) {
			errorMessage = err instanceof ApiError ? err.message : 'Terjadi kesalahan. Coba lagi.';
		} finally {
			submitting = false;
		}
	}
</script>

<svelte:head>
	<title>Login — Mr. Twin Admin</title>
</svelte:head>

<div class="mx-auto flex min-h-screen max-w-sm flex-col justify-center px-4">
	<span
		class="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-900 text-sm font-bold tracking-tight text-white"
	>
		MT
	</span>
	<h1 class="mb-1 text-2xl font-semibold tracking-tight text-zinc-900">Mr. Twin Admin</h1>
	<p class="mb-6 text-sm text-zinc-500">Masuk untuk mengelola katalog dan pesanan.</p>

	{#if errorMessage}
		<div class="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
			{errorMessage}
		</div>
	{/if}

	<form onsubmit={submit} class="space-y-4">
		<div>
			<label for="email" class="mb-1 block text-sm font-medium text-zinc-700">Email</label>
			<input
				id="email"
				type="email"
				required
				bind:value={email}
				class="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm focus:border-accent-500 focus:ring-2 focus:ring-accent-400/40 focus:outline-none"
			/>
		</div>
		<div>
			<label for="password" class="mb-1 block text-sm font-medium text-zinc-700">Password</label>
			<input
				id="password"
				type="password"
				required
				bind:value={password}
				class="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm focus:border-accent-500 focus:ring-2 focus:ring-accent-400/40 focus:outline-none"
			/>
		</div>
		<button
			type="submit"
			disabled={submitting}
			class="w-full rounded-lg bg-accent-400 px-4 py-2.5 text-sm font-semibold text-zinc-900 transition hover:bg-accent-300 active:scale-[0.98] disabled:opacity-50"
		>
			{submitting ? 'Memproses...' : 'Login'}
		</button>
	</form>
</div>
