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
		await api<{ id: string }>("/api/children", {
			method: "POST",
			headers: { authorization: `Bearer ${token}` },
			body: JSON.stringify({ parent_id: me.id, full_name: fullName, date_of_birth: dob, relation, bc_last4: bc4, passport_last4: pp4 }),
		});
		setMsg("Child created");
		setFullName(""); setDob(""); setBc4(""); setPp4("");
		const list = await api<any[]>("/api/children", { headers: { authorization: `Bearer ${token}` } });
		setChildren(list);
	}
	return (
		<div style={{ maxWidth: 640, margin: "40px auto", fontFamily: "system-ui, sans-serif" }}>
			<h2>Create Child (FIR)</h2>
			{!token ? <div>Please login</div> : (
				<form onSubmit={onSubmit}>
					<input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Full name" required style={{ width: "100%", padding: 8, marginBottom: 8 }} />
					<input value={dob} onChange={(e) => setDob(e.target.value)} placeholder="YYYY-MM-DD" required style={{ width: "100%", padding: 8, marginBottom: 8 }} />
					<input value={relation} onChange={(e) => setRelation(e.target.value)} placeholder="Relation" required style={{ width: "100%", padding: 8, marginBottom: 8 }} />
					<input value={bc4} onChange={(e) => setBc4(e.target.value)} placeholder="Birth cert last 4" required style={{ width: "100%", padding: 8, marginBottom: 8 }} />
					<input value={pp4} onChange={(e) => setPp4(e.target.value)} placeholder="Passport last 4" required style={{ width: "100%", padding: 8, marginBottom: 8 }} />
					<button type="submit">Create</button>
				</form>
			)}
			{msg && <div style={{ color: "green", marginTop: 8 }}>{msg}</div>}
			<h3 style={{ marginTop: 24 }}>Your children</h3>
			<ul>
				{children.map((c) => (
					<li key={c.id}>{c.full_name} — {c.date_of_birth}</li>
				))}
			</ul>
		</div>
	);
}
