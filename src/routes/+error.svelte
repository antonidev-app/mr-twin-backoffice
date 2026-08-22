<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import Logo from '$lib/components/Logo.svelte';
	import Button from '$lib/components/Button.svelte';
</script>

<svelte:head>
	<title>Error {page.status} — Mr. Twin Admin</title>
</svelte:head>

<div
	class="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-4 text-center"
>
	<Logo class="mb-5 h-10 w-10" />
	<p class="mb-3 font-mono text-6xl font-semibold tracking-tight text-zinc-200">{page.status}</p>
	<h1 class="mb-6 text-lg font-semibold text-zinc-900">
		{page.error?.message || 'Terjadi kesalahan yang tidak terduga.'}
	</h1>
	<Button href={resolve('/')} variant="dark">Kembali ke Dashboard</Button>
</div>
