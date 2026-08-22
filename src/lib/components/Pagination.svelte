<script lang="ts">
	import type { PaginationMeta } from '$lib/api/types';

	let { meta, onNavigate }: { meta: PaginationMeta; onNavigate: (page: number) => void } = $props();

	const SIBLINGS = 1;

	function buildPageList(current: number, last: number): (number | '…')[] {
		const middle: number[] = [];
		for (
			let i = Math.max(2, current - SIBLINGS);
			i <= Math.min(last - 1, current + SIBLINGS);
			i++
		) {
			middle.push(i);
		}

		const items: (number | '…')[] = [1];
		if (middle[0] > 2) items.push('…');
		items.push(...middle);
		if (middle[middle.length - 1] < last - 1) items.push('…');
		if (last > 1) items.push(last);
		return items;
	}

	let pages = $derived(buildPageList(meta.current_page, meta.last_page));
</script>

{#if meta.last_page > 1}
	<div class="mt-6 flex items-center justify-center gap-1">
		<button
			onclick={() => onNavigate(meta.current_page - 1)}
			disabled={meta.current_page <= 1}
			aria-label="Halaman sebelumnya"
			class="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-500 transition hover:bg-zinc-100 disabled:pointer-events-none disabled:opacity-30"
		>
			<svg viewBox="0 0 20 20" fill="currentColor" class="h-4 w-4">
				<path
					fill-rule="evenodd"
					d="M12.79 5.23a.75.75 0 0 1 0 1.06L9.06 10l3.73 3.71a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z"
					clip-rule="evenodd"
				/>
			</svg>
		</button>

		{#each pages as p, i (i)}
			{#if p === '…'}
				<span class="flex h-8 w-8 items-center justify-center text-sm text-zinc-400">…</span>
			{:else}
				<button
					onclick={() => onNavigate(p)}
					class="h-8 w-8 rounded-lg text-sm font-medium transition active:scale-[0.98] {meta.current_page ===
					p
						? 'bg-accent-600 text-white'
						: 'text-zinc-600 hover:bg-zinc-100'}"
				>
					{p}
				</button>
			{/if}
		{/each}

		<button
			onclick={() => onNavigate(meta.current_page + 1)}
			disabled={meta.current_page >= meta.last_page}
			aria-label="Halaman berikutnya"
			class="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-500 transition hover:bg-zinc-100 disabled:pointer-events-none disabled:opacity-30"
		>
			<svg viewBox="0 0 20 20" fill="currentColor" class="h-4 w-4">
				<path
					fill-rule="evenodd"
					d="M7.21 14.77a.75.75 0 0 1 0-1.06L10.94 10 7.21 6.29a.75.75 0 1 1 1.06-1.06l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0Z"
					clip-rule="evenodd"
				/>
			</svg>
		</button>
	</div>
{/if}
