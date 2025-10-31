import React from "react";
import { useAuth } from "../AuthContext";
import { api, API_BASE } from "../api";

type Child = { id: string; full_name: string; date_of_birth: string; relation: string };
type Artifact = { id: string; title: string; description?: string | null };

export default function Manage() {
    const { token } = useAuth();
    const [children, setChildren] = React.useState<Child[]>([]);
    const [selectedChildId, setSelectedChildId] = React.useState<string | null>(null);
    const [artifacts, setArtifacts] = React.useState<Artifact[]>([]);
    const [form, setForm] = React.useState<{ full_name: string; date_of_birth: string; relation: string }>({ full_name: "", date_of_birth: "", relation: "" });
    const [loading, setLoading] = React.useState(false);
    const [msg, setMsg] = React.useState<string | null>(null);

    React.useEffect(() => {
        if (!token) return;
        api<Child[]>("/api/children", { headers: { authorization: `Bearer ${token}` } }).then((rows) => {
            setChildren(rows);
            if (rows.length) {
                setSelectedChildId(rows[0].id);
                setForm({ full_name: rows[0].full_name, date_of_birth: rows[0].date_of_birth.slice(0,10), relation: rows[0].relation || "" });
            }
        });
    }, [token]);

    React.useEffect(() => {
        if (!selectedChildId) return;
        api<Artifact[]>(`/api/artifacts?child_id=${selectedChildId}`).then(setArtifacts);
        const c = children.find((x) => x.id === selectedChildId);
        if (c) setForm({ full_name: c.full_name, date_of_birth: c.date_of_birth.slice(0,10), relation: c.relation || "" });
    }, [selectedChildId]);

    if (!token) {
        return <div className="text-center text-slate-700">Please log in to manage children and artifacts.</div>;
    }

    const onUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedChildId) return;
        setLoading(true); setMsg(null);
        if (typeof window !== 'undefined' && (window as any).gtag) {
            (window as any).gtag('event', 'form_submit', { form_name: 'update_child' });
        }
        try {
            await api(`/api/children/${selectedChildId}`, {
                method: "PUT",
                headers: { authorization: `Bearer ${token}` },
                body: JSON.stringify({ full_name: form.full_name, date_of_birth: form.date_of_birth, relation: form.relation })
            });
            if (typeof window !== 'undefined' && (window as any).gtag) {
                (window as any).gtag('event', 'child_updated');
            }
            setMsg("Saved");
            // refresh children list
            const rows = await api<Child[]>("/api/children", { headers: { authorization: `Bearer ${token}` } });
            setChildren(rows);
        } catch (e) {
            if (typeof window !== 'undefined' && (window as any).gtag) {
                (window as any).gtag('event', 'child_update_error');
            }
            setMsg("Error saving");
        } finally {
            setLoading(false);
        }
    };

    const onDeleteArtifact = async (id: string) => {
        if (!confirm("Delete this artifact? This cannot be undone.")) return;
        if (typeof window !== 'undefined' && (window as any).gtag) {
            (window as any).gtag('event', 'button_click', { button_label: 'Delete artifact', location: 'manage_page' });
        }
        try {
            await fetch(`${API_BASE}/api/artifacts/${id}`, { method: "DELETE", headers: { authorization: `Bearer ${token}` } });
            if (typeof window !== 'undefined' && (window as any).gtag) {
                (window as any).gtag('event', 'artifact_deleted');
            }
            setArtifacts((prev) => prev.filter((a) => a.id !== id));
        } catch {
            if (typeof window !== 'undefined' && (window as any).gtag) {
                (window as any).gtag('event', 'artifact_delete_error');
            }
        }
    };

    return (
        <div className="grid gap-6 md:grid-cols-3">
            <div className="md:col-span-1">
                <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
                    <div className="px-4 py-3 border-b border-slate-200 font-medium">Children</div>
                    <ul className="p-2">
                        {children.map((c) => (
                            <li key={c.id}>
                                <button className={`w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-slate-50 ${selectedChildId === c.id ? 'bg-slate-100 font-medium' : ''}`} onClick={() => setSelectedChildId(c.id)}>
                                    {c.full_name} <span className="text-slate-500">({c.date_of_birth})</span>
                                </button>
                            </li>
                        ))}
                        {children.length === 0 && <div className="px-3 py-3 text-sm text-slate-600">No children yet.</div>}
                    </ul>
                </div>
            </div>
            <div className="md:col-span-2 space-y-6">
                <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
                    <div className="px-4 py-3 border-b border-slate-200 font-medium">Edit child</div>
                    <form onSubmit={onUpdate} className="p-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                            <label className="block text-sm font-medium text-slate-700">Full name</label>
                            <input value={form.full_name} onChange={(e)=>setForm({...form, full_name: e.target.value})} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700">Date of birth</label>
                            <input value={form.date_of_birth} onChange={(e)=>setForm({...form, date_of_birth: e.target.value})} type="date" className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700">Relation</label>
                            <input value={form.relation} onChange={(e)=>setForm({...form, relation: e.target.value})} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
                        </div>
                        <div className="sm:col-span-3">
                            <button disabled={loading} className="inline-flex items-center rounded-md bg-brand-600 text-white px-4 py-2 text-sm hover:bg-brand-500">{loading ? 'Saving...' : 'Save changes'}</button>
                            {msg && <span className="ml-3 text-sm text-slate-600">{msg}</span>}
                        </div>
                    </form>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
                    <div className="px-4 py-3 border-b border-slate-200 font-medium">Artifacts</div>
                    <div className="p-4">
                        {artifacts.length === 0 ? (
                            <div className="text-slate-600 text-sm">No artifacts for this child.</div>
                        ) : (
                            <div className="grid gap-3">
                                {artifacts.map((a) => (
                                    <div key={a.id} className="rounded-lg border border-slate-200 p-4 flex items-center justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="font-medium text-slate-900">{a.title}</div>
                                            <div className="text-sm text-slate-600 mt-1">{a.description || "(no description)"}</div>
                                        </div>
                                        <button onClick={()=>onDeleteArtifact(a.id)} className="inline-flex items-center rounded-md border border-rose-300 text-rose-700 px-3 py-1.5 text-sm hover:bg-rose-50">Delete</button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}


