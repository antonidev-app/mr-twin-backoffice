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
	pending: 'bg-warning-100 text-warning-800',
	processing: 'bg-blue-100 text-blue-700',
	shipped: 'bg-purple-100 text-purple-700',
	completed: 'bg-green-100 text-green-700',
	cancelled: 'bg-red-100 text-red-700'
};

export function orderStatusClass(status: string): string {
	return ORDER_STATUS_STYLES[status] ?? 'bg-zinc-100 text-zinc-600';
}

const PAYMENT_STATUS_STYLES: Record<string, string> = {
	unpaid: 'bg-warning-100 text-warning-800',
	paid: 'bg-green-100 text-green-700',
	failed: 'bg-red-100 text-red-700',
	expired: 'bg-zinc-100 text-zinc-600'
};

export function paymentStatusClass(status: string): string {
	return PAYMENT_STATUS_STYLES[status] ?? 'bg-zinc-100 text-zinc-600';
}

export function publishedClass(isPublished: boolean): string {
	return isPublished ? 'bg-green-100 text-green-700' : 'bg-zinc-100 text-zinc-500';
}

const SYNC_STATUS_STYLES: Record<string, string> = {
	running: 'bg-warning-100 text-warning-800',
	success: 'bg-green-100 text-green-700',
	failed: 'bg-red-100 text-red-700'
};

export function syncStatusClass(status: string): string {
	return SYNC_STATUS_STYLES[status] ?? 'bg-zinc-100 text-zinc-600';
}
