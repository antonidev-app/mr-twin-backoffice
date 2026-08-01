export function formatPrice(value: number): string {
	return new Intl.NumberFormat('id-ID', {
		style: 'currency',
		currency: 'IDR',
		maximumFractionDigits: 0
	}).format(value);
}

export function formatDate(value: string): string {
	return new Date(value).toLocaleString('id-ID');
}

const ORDER_STATUS_STYLES: Record<string, string> = {
	pending: 'bg-accent-50 text-accent-800',
	completed: 'bg-green-50 text-green-700',
	cancelled: 'bg-red-50 text-red-600'
};

export function orderStatusClass(status: string): string {
	return ORDER_STATUS_STYLES[status] ?? 'bg-zinc-100 text-zinc-600';
}

export function publishedClass(isPublished: boolean): string {
	return isPublished ? 'bg-green-50 text-green-700' : 'bg-zinc-100 text-zinc-500';
}

const SYNC_STATUS_STYLES: Record<string, string> = {
	running: 'bg-accent-50 text-accent-800',
	success: 'bg-green-50 text-green-700',
	failed: 'bg-red-50 text-red-600'
};

export function syncStatusClass(status: string): string {
	return SYNC_STATUS_STYLES[status] ?? 'bg-zinc-100 text-zinc-600';
}
