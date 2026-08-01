import { PUBLIC_API_BASE_URL } from '$env/static/public';

export class ApiError extends Error {
	status: number;
	body: unknown;

	constructor(status: number, message: string, body: unknown) {
		super(message);
		this.status = status;
		this.body = body;
	}
}

type ApiFetchOptions = {
	method?: string;
	body?: unknown;
	token?: string | null;
	fetch?: typeof fetch;
	params?: Record<string, string | number | boolean | undefined>;
};

export async function apiFetch<T>(path: string, options: ApiFetchOptions = {}): Promise<T> {
	const f = options.fetch ?? fetch;
	const url = new URL(path, PUBLIC_API_BASE_URL);

	for (const [key, value] of Object.entries(options.params ?? {})) {
		if (value === undefined || value === '') continue;
		// Laravel's `boolean` validation rule accepts query-string "1"/"0"
		// but rejects the literal strings "true"/"false" that String(value)
		// would otherwise produce for a JS boolean.
		url.searchParams.set(key, typeof value === 'boolean' ? (value ? '1' : '0') : String(value));
	}

	const isFormData = options.body instanceof FormData;

	const headers: Record<string, string> = { Accept: 'application/json' };
	if (options.body !== undefined && !isFormData) headers['Content-Type'] = 'application/json';
	if (options.token) headers.Authorization = `Bearer ${options.token}`;

	const response = await f(url.toString(), {
		method: options.method ?? 'GET',
		headers,
		body:
			options.body === undefined
				? undefined
				: isFormData
					? (options.body as FormData)
					: JSON.stringify(options.body)
	});

	const isJson = response.headers.get('content-type')?.includes('application/json');
	const data = isJson ? await response.json() : null;

	if (!response.ok) {
		throw new ApiError(response.status, data?.message ?? response.statusText, data);
	}

	return data as T;
}
