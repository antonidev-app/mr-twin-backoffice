<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
</script>

<svelte:head>
	<title>Error {page.status} — Mr. Twin Admin</title>
</svelte:head>

<div
	class="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-4 text-center"
>
	<p class="mb-2 font-mono text-6xl font-bold text-accent-200">{page.status}</p>
	<h1 class="mb-2 text-lg font-semibold text-zinc-900">
		{page.error?.message || 'Terjadi kesalahan yang tidak terduga.'}
	</h1>
	<a
		href={resolve('/')}
		class="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-700 active:scale-[0.98]"
	>
		Kembali ke Dashboard
	</a>
</div>
