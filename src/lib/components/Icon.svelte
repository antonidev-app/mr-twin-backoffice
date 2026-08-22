<script lang="ts">
	type Name = 'dashboard' | 'products' | 'orders' | 'logout';

	let { name, class: className = 'h-4.5 w-4.5' }: { name: Name; class?: string } = $props();
</script>

{#if name === 'dashboard'}
	<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" class={className}>
		<rect x="3.5" y="3.5" width="7.5" height="7.5" rx="1.5" />
		<rect x="13" y="3.5" width="7.5" height="4.5" rx="1.5" />
		<rect x="13" y="10.5" width="7.5" height="10" rx="1.5" />
		<rect x="3.5" y="13.5" width="7.5" height="7" rx="1.5" />
	</svg>
{:else if name === 'products'}
	<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" class={className}>
		<path
			stroke-linecap="round"
			stroke-linejoin="round"
			d="M3.75 8.25 12 3.75l8.25 4.5-8.25 4.5-8.25-4.5Z"
		/>
		<path stroke-linecap="round" stroke-linejoin="round" d="M3.75 8.25v7.5L12 20.25l8.25-4.5v-7.5" />
		<path stroke-linecap="round" stroke-linejoin="round" d="M12 12.75v7.5" />
	</svg>
{:else if name === 'orders'}
	<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" class={className}>
		<path
			stroke-linecap="round"
			stroke-linejoin="round"
			d="M6 3.75h9.75L18.75 6.75V19.5a.75.75 0 0 1-.75.75H6a.75.75 0 0 1-.75-.75V4.5a.75.75 0 0 1 .75-.75Z"
		/>
		<path stroke-linecap="round" stroke-linejoin="round" d="M9 9.75h6M9 13.25h6M9 16.75h3.5" />
	</svg>
{:else if name === 'logout'}
	<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" class={className}>
		<path
			stroke-linecap="round"
			stroke-linejoin="round"
			d="M9 20.25H5.25a1.5 1.5 0 0 1-1.5-1.5V5.25a1.5 1.5 0 0 1 1.5-1.5H9"
		/>
		<path stroke-linecap="round" stroke-linejoin="round" d="M15.75 8.25 20.25 12l-4.5 3.75M20.25 12H9" />
	</svg>
{/if}
