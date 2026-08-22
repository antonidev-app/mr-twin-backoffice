<script lang="ts">
	import type { Snippet } from 'svelte';

	let { class: className = '', children }: { class?: string; children: Snippet } = $props();
</script>

<span class="rounded-full px-2.5 py-1 text-xs font-medium tracking-wide capitalize {className}">
	{@render children()}
</span>
