import React from "react";
import { useAuth } from "../AuthContext";
import { api } from "../api";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
	const { setAuth } = useAuth();
	const nav = useNavigate();
	const [email, setEmail] = React.useState("");
	const [password, setPassword] = React.useState("");
	const [err, setErr] = React.useState<string | null>(null);
	const onSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			const res = await api<{ token: string }>("/api/parents/login", {
				method: "POST",
				body: JSON.stringify({ email, password }),
			});
			setAuth({ token: res.token, email });
			nav("/");
		} catch (e) {
			setErr("Invalid credentials");
		}
	};
    return (
        <div className="max-w-sm mx-auto">
            <div className="mb-6">
                <h2 className="text-2xl font-semibold">Welcome back</h2>
                <p className="text-slate-600">Sign in to manage your FutureBox.</p>
            </div>
            <form onSubmit={onSubmit} className="rounded-xl border border-slate-200 bg-white shadow-sm p-4 space-y-3">
                <div>
                    <label className="block text-sm font-medium text-slate-700">Email</label>
                    <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" type="email" required className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700">Password</label>
                    <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" type="password" required className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
                </div>
                <button type="submit" className="w-full inline-flex items-center justify-center rounded-md bg-brand-600 text-white px-4 py-2 text-sm hover:bg-brand-500">Login</button>
            </form>
            {err && <div className="mt-2 text-sm text-rose-600">{err}</div>}
            <div className="mt-3 text-sm text-slate-700">
                No account? <Link className="text-brand-600 hover:underline" to="/signup">Sign up</Link>
            </div>
        </div>
    );
}
