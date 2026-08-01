<script lang="ts">
	import type { Snippet } from 'svelte';

	let { class: className = '', children }: { class?: string; children: Snippet } = $props();
</script>

<span class="rounded-full px-2 py-0.5 text-xs font-medium capitalize {className}">
	{@render children()}
</span>
