<script lang="ts">
	import type { Snippet } from 'svelte';

	type Variant = 'primary' | 'dark' | 'outline' | 'ghost';

	let {
		variant = 'primary',
		href,
		type = 'button',
		disabled = false,
		class: className = '',
		children,
		...rest
	}: {
		variant?: Variant;
		href?: string;
		type?: 'button' | 'submit';
		disabled?: boolean;
		class?: string;
		children: Snippet;
		[key: string]: unknown;
	} = $props();

	const base =
		'inline-flex items-center justify-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-medium transition active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50';

	const variants: Record<Variant, string> = {
		primary: 'bg-accent-600 text-white shadow-resting hover:bg-accent-700',
		dark: 'bg-zinc-900 text-white hover:bg-zinc-800',
		outline: 'border border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300 hover:bg-zinc-50',
		ghost: 'text-zinc-600 hover:bg-zinc-100'
	};
</script>

{#if href}
	<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -- href is always a pre-resolved path from resolve() at the call site -->
	<a {href} class="{base} {variants[variant]} {className}" {...rest}>
		{@render children()}
	</a>
{:else}
	<button {type} {disabled} class="{base} {variants[variant]} {className}" {...rest}>
		{@render children()}
	</button>
{/if}
