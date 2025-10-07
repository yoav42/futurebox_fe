import React from "react";
import { api, API_BASE } from "../api";
import { useAuth } from "../AuthContext";

export default function CreateArtifact() {
	const { token } = useAuth();
	const [me, setMe] = React.useState<any>(null);
	const [children, setChildren] = React.useState<any[]>([]);
	const [title, setTitle] = React.useState("");
	const [description, setDescription] = React.useState("");
	const [release, setRelease] = React.useState("");
	const [storagePath, setStoragePath] = React.useState<string>("");
	const [originalName, setOriginalName] = React.useState<string>("");
	const [selected, setSelected] = React.useState<string[]>([]);
	const [msg, setMsg] = React.useState<string | null>(null);
	const [uploading, setUploading] = React.useState(false);
	React.useEffect(() => {
		if (!token) return;
		api<any>("/api/parents/me", { headers: { authorization: `Bearer ${token}` } }).then(setMe);
		api<any[]>("/api/children", { headers: { authorization: `Bearer ${token}` } }).then(setChildren);
	}, [token]);
	function toggle(id: string) {
		setSelected((s) => s.includes(id) ? s.filter((x) => x !== id) : [...s, id]);
	}
	async function onUpload(e: React.ChangeEvent<HTMLInputElement>) {
		const f = e.target.files?.[0];
		if (!f || !token) return;
		setUploading(true);
		const form = new FormData();
		form.append("file", f);
		const res = await fetch(`${API_BASE}/api/uploads`, { method: "POST", headers: { authorization: `Bearer ${token}` }, body: form });
		if (!res.ok) { setUploading(false); return; }
		const j = await res.json();
		setStoragePath(j.storage_path);
		setOriginalName(f.name);
		setUploading(false);
	}
	async function onSubmit(e: React.FormEvent) {
		e.preventDefault();
		if (!storagePath) { setMsg("Please upload a file first"); return; }
		if (selected.length === 0) { setMsg("Select at least one recipient"); return; }
		await api<{ id: string }>("/api/artifacts", {
			method: "POST",
			headers: { authorization: `Bearer ${token}` },
			body: JSON.stringify({ owner_parent_id: me.id, title, description, release_at: release, storage_path: storagePath, original_filename: originalName, recipient_child_ids: selected }),
		});
		setMsg("Artifact created");
		setTitle(""); setDescription(""); setRelease(""); setSelected([]); setStoragePath(""); setOriginalName("");
	}
    return (
        <div className="max-w-2xl mx-auto">
            <div className="mb-6">
                <h2 className="text-2xl font-semibold">Create artifact</h2>
                <p className="text-slate-600">Upload a file and set a future release date.</p>
            </div>
            {!token ? (
                <div className="text-slate-700">Please login</div>
            ) : (
                <form onSubmit={onSubmit} className="rounded-xl border border-slate-200 bg-white shadow-sm p-4 space-y-3">
                    <div>
                        <label className="block text-sm font-medium text-slate-700">Title</label>
                        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="E.g., First steps video" required className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700">Description</label>
                        <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Optional" className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700">Release time (ISO)</label>
                        <input value={release} onChange={(e) => setRelease(e.target.value)} placeholder="YYYY-MM-DDTHH:MM:SSZ" required className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700">File</label>
                        <div className="mt-1 flex items-center gap-3">
                            <input type="file" onChange={onUpload} />
                            <span className="text-sm text-slate-600">{uploading ? "Uploading…" : storagePath ? `Uploaded: ${originalName || storagePath}` : ""}</span>
                        </div>
                    </div>
                    <div>
                        <div className="block text-sm font-medium text-slate-700 mb-1">Recipients</div>
                        <ul className="grid gap-2">
                            {children.map((c) => (
                                <li key={c.id} className="flex items-center gap-2">
                                    <input id={`c-${c.id}`} type="checkbox" checked={selected.includes(c.id)} onChange={() => toggle(c.id)} />
                                    <label htmlFor={`c-${c.id}`} className="text-sm">{c.full_name}</label>
                                </li>
                            ))}
                            {children.length === 0 && <div className="text-sm text-slate-500">No children yet.</div>}
                        </ul>
                    </div>
                    <button type="submit" className="inline-flex items-center rounded-md bg-brand-600 text-white px-4 py-2 text-sm hover:bg-brand-500">Create</button>
                </form>
            )}
            {msg && <div className="mt-2 text-sm text-emerald-600">{msg}</div>}
        </div>
    );
}
