import React from "react";
import { api } from "../api";
import { useAuth } from "../AuthContext";

export default function CreateChild() {
	const { token, email } = useAuth();
	const [me, setMe] = React.useState<any>(null);
	const [fullName, setFullName] = React.useState("");
	const [dob, setDob] = React.useState("");
	const [relation, setRelation] = React.useState("child");
	const [bc4, setBc4] = React.useState("");
	const [pp4, setPp4] = React.useState("");
	const [children, setChildren] = React.useState<any[]>([]);
	const [msg, setMsg] = React.useState<string | null>(null);
	React.useEffect(() => {
		if (!token) return;
		api<any>("/api/parents/me", { headers: { authorization: `Bearer ${token}` } }).then(setMe);
		api<any[]>("/api/children", { headers: { authorization: `Bearer ${token}` } }).then(setChildren);
	}, [token]);
	async function onSubmit(e: React.FormEvent) {
		e.preventDefault();
		if (!me) return;
		if (typeof window !== 'undefined' && (window as any).gtag) {
			(window as any).gtag('event', 'form_submit', { form_name: 'create_child' });
		}
		await api<{ id: string }>("/api/children", {
			method: "POST",
			headers: { authorization: `Bearer ${token}` },
			body: JSON.stringify({ parent_id: me.id, full_name: fullName, date_of_birth: dob, relation, bc_last4: bc4, passport_last4: pp4 }),
		});
		if (typeof window !== 'undefined' && (window as any).gtag) {
			(window as any).gtag('event', 'child_created');
		}
		setMsg("Child created");
		setFullName(""); setDob(""); setBc4(""); setPp4("");
		const list = await api<any[]>("/api/children", { headers: { authorization: `Bearer ${token}` } });
		setChildren(list);
	}
    return (
        <div className="max-w-2xl mx-auto">
            <div className="mb-6">
                <h2 className="text-2xl font-semibold">Create child (FIR)</h2>
                <p className="text-slate-600">Add a Future Identity Record for your child.</p>
            </div>
            {!token ? (
                <div className="text-slate-700">Please login</div>
            ) : (
                <form onSubmit={onSubmit} className="rounded-xl border border-slate-200 bg-white shadow-sm p-4 space-y-3">
                    <div>
                        <label className="block text-sm font-medium text-slate-700">Full name</label>
                        <input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="First Last" required className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-medium text-slate-700">Date of birth</label>
                            <input value={dob} onChange={(e) => setDob(e.target.value)} placeholder="YYYY-MM-DD" required className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700">Relation</label>
                            <input value={relation} onChange={(e) => setRelation(e.target.value)} placeholder="child" required className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-medium text-slate-700">Birth certificate last 4</label>
                            <input value={bc4} onChange={(e) => setBc4(e.target.value)} inputMode="numeric" maxLength={4} placeholder="1234" required className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700">Passport last 4</label>
                            <input value={pp4} onChange={(e) => setPp4(e.target.value)} inputMode="numeric" maxLength={4} placeholder="5678" required className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
                        </div>
                    </div>
                    <button type="submit" className="inline-flex items-center rounded-md bg-brand-600 text-white px-4 py-2 text-sm hover:bg-brand-500">Create</button>
                </form>
            )}
            {msg && <div className="mt-2 text-sm text-emerald-600">{msg}</div>}
            <div className="mt-6 rounded-xl border border-slate-200 bg-white shadow-sm">
                <div className="px-4 py-3 border-b border-slate-200 font-medium">Your children</div>
                <ul className="p-3 divide-y divide-slate-200">
                    {children.map((c) => (
                        <li key={c.id} className="py-2 text-sm">{c.full_name} — <span className="text-slate-600">{c.date_of_birth}</span></li>
                    ))}
                    {children.length === 0 && <div className="px-3 py-2 text-sm text-slate-500">No children yet.</div>}
                </ul>
            </div>
        </div>
    );
}
