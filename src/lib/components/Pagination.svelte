<script lang="ts">
	import type { PaginationMeta } from '$lib/api/types';

	let { meta, onNavigate }: { meta: PaginationMeta; onNavigate: (page: number) => void } = $props();
</script>

{#if meta.last_page > 1}
	<div class="mt-6 flex items-center justify-center gap-1">
		{#each Array.from({ length: meta.last_page }, (_, i) => i + 1) as pageNumber (pageNumber)}
			<button
				onclick={() => onNavigate(pageNumber)}
				class="h-8 w-8 rounded-md text-sm {meta.current_page === pageNumber
					? 'bg-zinc-900 text-white'
					: 'text-zinc-600 hover:bg-zinc-100'}"
			>
				{pageNumber}
			</button>
		{/each}
	</div>
{/if}
