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
		<div style={{ maxWidth: 360, margin: "40px auto", fontFamily: "system-ui, sans-serif" }}>
			<h2>Sign up</h2>
			<form onSubmit={onSubmit}>
				<input value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="Your name" required style={{ width: "100%", padding: 8, marginBottom: 8 }} />
				<input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" type="email" required style={{ width: "100%", padding: 8, marginBottom: 8 }} />
				<input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" type="password" required style={{ width: "100%", padding: 8, marginBottom: 8 }} />
				<button type="submit" style={{ width: "100%", padding: 10 }}>Create account</button>
			</form>
			{ok && <div style={{ color: "green", marginTop: 8 }}>Account created. Redirecting…</div>}
			{err && <div style={{ color: "crimson", marginTop: 8 }}>{err}</div>}
			<div style={{ marginTop: 12 }}>
				Have an account? <Link to="/login">Login</Link>
			</div>
		</div>
	);
}
