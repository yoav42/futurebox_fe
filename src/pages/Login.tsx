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
		<div style={{ maxWidth: 360, margin: "40px auto", fontFamily: "system-ui, sans-serif" }}>
			<h2>Login</h2>
			<form onSubmit={onSubmit}>
				<input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" type="email" required style={{ width: "100%", padding: 8, marginBottom: 8 }} />
				<input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" type="password" required style={{ width: "100%", padding: 8, marginBottom: 8 }} />
				<button type="submit" style={{ width: "100%", padding: 10 }}>Login</button>
			</form>
			{err && <div style={{ color: "crimson", marginTop: 8 }}>{err}</div>}
			<div style={{ marginTop: 12 }}>
				No account? <Link to="/signup">Sign up</Link>
			</div>
		</div>
	);
}
