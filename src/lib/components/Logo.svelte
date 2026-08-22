<script lang="ts">
	let { class: className = 'h-8 w-8' }: { class?: string } = $props();
</script>

<span
	class={`relative flex shrink-0 items-center justify-center overflow-hidden rounded-xl bg-zinc-900 ${className}`}
>
	<svg viewBox="0 0 24 24" class="h-[62%] w-[62%]" fill="none">
		<rect x="2.5" y="2.5" width="12" height="12" rx="3.5" fill="var(--color-accent-400)" />
		<rect x="9.5" y="9.5" width="12" height="12" rx="3.5" fill="var(--color-accent-600)" />
	</svg>
</span>
