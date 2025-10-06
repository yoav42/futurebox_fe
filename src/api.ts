export const API_BASE = (import.meta as any).env?.VITE_API_BASE || "http://localhost:8000";

export async function api<T>(path: string, opts: RequestInit = {}): Promise<T> {
	const res = await fetch(`${API_BASE}${path}`, {
		...opts,
		headers: {
			"content-type": "application/json",
			...(opts.headers || {}),
		},
	});
	if (!res.ok) throw new Error(`${res.status}`);
	return res.json();
}
