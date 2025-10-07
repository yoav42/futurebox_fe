import React from "react";
import { api } from "../api";
import { Link, useNavigate } from "react-router-dom";

export default function Signup() {
	const nav = useNavigate();
	const [email, setEmail] = React.useState("");
	const [password, setPassword] = React.useState("");
	const [displayName, setDisplayName] = React.useState("");
	const [err, setErr] = React.useState<string | null>(null);
	const [ok, setOk] = React.useState(false);
	const onSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			await api<{ id: string }>("/api/parents/signup", {
				method: "POST",
				body: JSON.stringify({ email, password, display_name: displayName }),
			});
			setOk(true);
			setTimeout(() => nav("/login"), 600);
		} catch (e) {
			setErr("Could not sign up");
		}
	};
    return (
        <div className="max-w-sm mx-auto">
            <div className="mb-6">
                <h2 className="text-2xl font-semibold">Create your account</h2>
                <p className="text-slate-600">Start building your FutureBox.</p>
            </div>
            <form onSubmit={onSubmit} className="rounded-xl border border-slate-200 bg-white shadow-sm p-4 space-y-3">
                <div>
                    <label className="block text-sm font-medium text-slate-700">Your name</label>
                    <input value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="Alex Smith" required className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700">Email</label>
                    <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" type="email" required className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700">Password</label>
                    <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" type="password" required className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
                </div>
                <button type="submit" className="w-full inline-flex items-center justify-center rounded-md bg-brand-600 text-white px-4 py-2 text-sm hover:bg-brand-500">Create account</button>
            </form>
            {ok && <div className="mt-2 text-sm text-emerald-600">Account created. Redirecting…</div>}
            {err && <div className="mt-2 text-sm text-rose-600">{err}</div>}
            <div className="mt-3 text-sm text-slate-700">
                Have an account? <Link className="text-brand-600 hover:underline" to="/login">Login</Link>
            </div>
        </div>
    );
}
