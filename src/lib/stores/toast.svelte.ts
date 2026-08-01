export type Toast = {
	id: number;
	message: string;
	variant: 'success' | 'error';
};

let nextId = 1;

class ToastStore {
	items = $state<Toast[]>([]);

	show(message: string, variant: Toast['variant'] = 'success', duration = 2500) {
		const id = nextId++;
		this.items.push({ id, message, variant });
		setTimeout(() => this.dismiss(id), duration);
	}

	dismiss(id: number) {
		this.items = this.items.filter((t) => t.id !== id);
	}
}

export const toast = new ToastStore();
