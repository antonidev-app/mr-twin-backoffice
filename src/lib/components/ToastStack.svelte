<script lang="ts">
	import { fly } from 'svelte/transition';
	import { toast } from '$lib/stores/toast.svelte';
</script>

<div
	class="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex flex-col items-center gap-2 px-4"
>
	{#each toast.items as item (item.id)}
		<div
			transition:fly|local={{ y: 16, duration: 200 }}
			class="pointer-events-auto flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-medium text-white shadow-lg {item.variant ===
			'success'
				? 'bg-zinc-900'
				: 'bg-red-600'}"
		>
			{#if item.variant === 'success'}
				<svg viewBox="0 0 20 20" fill="currentColor" class="h-4 w-4 shrink-0">
					<path
						fill-rule="evenodd"
						d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
						clip-rule="evenodd"
					/>
				</svg>
			{/if}
			{item.message}
		</div>
	{/each}
</div>
