export type PaginationLinks = {
	first: string | null;
	last: string | null;
	prev: string | null;
	next: string | null;
};

export type PaginationMeta = {
	current_page: number;
	last_page: number;
	per_page: number;
	total: number;
	from: number | null;
	to: number | null;
};

export type Paginated<T> = {
	data: T[];
	links: PaginationLinks;
	meta: PaginationMeta;
};

export type AdminUser = {
	id: number;
	name: string;
	email: string;
};

export type ProductCuration = {
	is_published: boolean;
	display_name: string | null;
	description: string | null;
	images: string[];
	display_category: string | null;
	brand: string | null;
	sort_order: number;
};

export type AiDraft = {
	display_name: string;
	description: string;
	display_category: string;
	brand: string;
	sources: string[];
};

export type TierPrice = {
	price_category: string | null;
	price: number;
};

export type AdminProduct = {
	id: number;
	accurate_id: number;
	sku: string | null;
	name: string;
	unit_price: number;
	stock: number;
	item_type: string | null;
	suspended: boolean;
	last_synced_at: string | null;
	product_display: ProductCuration | null;
	tier_prices?: TierPrice[];
};

export type AdminOrderItem = {
	item_name: string;
	sku: string | null;
	unit_price: number;
	quantity: number;
	subtotal: number;
};

export type PriceCategory = {
	id: number;
	accurate_id: number;
	name: string | null;
	is_default: boolean;
};

export type AdminCustomer = {
	id: number;
	name: string;
	email: string;
	phone: string | null;
	price_category_id?: number | null;
	price_category?: PriceCategory | null;
};

export type AdminOrder = {
	id: number;
	order_number: string;
	status: string;
	payment_status: string;
	payment_method: string | null;
	paid_at: string | null;
	total_amount: number;
	shipping_name: string;
	shipping_phone: string;
	shipping_address: string;
	created_at: string;
	customer: AdminCustomer;
	items: AdminOrderItem[];
};

export type AdminBanner = {
	id: number;
	title: string;
	image: string | null;
	link_url: string | null;
	is_active: boolean;
	sort_order: number;
	created_at: string;
};

export type SyncLog = {
	id: number;
	type: 'items' | 'categories' | 'price_categories';
	status: 'running' | 'success' | 'failed';
	synced_count: number | null;
	error_message: string | null;
	started_at: string;
	finished_at: string | null;
};

export type SyncStatus = {
	items: { total: number; last_log: SyncLog | null };
	categories: { total: number; last_log: SyncLog | null };
	price_categories: { total: number; last_log: SyncLog | null };
};

export type ConnectionStatus = {
	connected: boolean;
	id_db: string | null;
	db_alias: string | null;
	token_expires_at: string | null;
	last_refreshed_at: string | null;
	last_refresh_error: string | null;
};

export type AccurateDatabase = {
	id: number;
	alias: string;
	admin: boolean;
	trial: boolean;
	expired: boolean;
};
