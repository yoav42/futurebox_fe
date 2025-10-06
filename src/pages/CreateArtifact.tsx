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
		<div style={{ maxWidth: 640, margin: "40px auto", fontFamily: "system-ui, sans-serif" }}>
			<h2>Create Artifact</h2>
			{!token ? <div>Please login</div> : (
				<form onSubmit={onSubmit}>
					<input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" required style={{ width: "100%", padding: 8, marginBottom: 8 }} />
					<textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" style={{ width: "100%", padding: 8, marginBottom: 8 }} />
					<input value={release} onChange={(e) => setRelease(e.target.value)} placeholder="Release ISO (YYYY-MM-DDTHH:MM:SSZ)" required style={{ width: "100%", padding: 8, marginBottom: 8 }} />
					<div style={{ marginBottom: 8 }}>
						<input type="file" onChange={onUpload} /> {uploading ? "Uploading…" : storagePath ? `Uploaded: ${originalName || storagePath}` : ""}
					</div>
					<div>
						Recipients:
						<ul>
							{children.map((c) => (
								<li key={c.id}>
									<label>
										<input type="checkbox" checked={selected.includes(c.id)} onChange={() => toggle(c.id)} /> {c.full_name}
									</label>
								</li>
							))}
						</ul>
					</div>
					<button type="submit">Create</button>
				</form>
			)}
			{msg && <div style={{ color: "green", marginTop: 8 }}>{msg}</div>}
		</div>
	);
}
