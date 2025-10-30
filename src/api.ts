// API base should be the origin only (no trailing /api). When served over HTTPS,
// default to same-origin so paths like "/api/..." work without duplication.
export const API_BASE = (import.meta as any).env?.VITE_API_BASE || (typeof window !== "undefined" && window.location?.origin ? window.location.origin : "http://localhost:8000");

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
