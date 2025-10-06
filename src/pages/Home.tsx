import React from "react";
import { useAuth } from "../AuthContext";
import { api, API_BASE } from "../api";

export default function Home() {
	const { token, email, logout } = useAuth();
	const [children, setChildren] = React.useState<any[]>([]);
	const [selectedChild, setSelectedChild] = React.useState<string | null>(null);
	const [artifacts, setArtifacts] = React.useState<any[]>([]);
	React.useEffect(() => {
		if (!token) return;
		api<any[]>("/api/children", { headers: { authorization: `Bearer ${token}` } }).then((rows) => {
			setChildren(rows);
			if (rows.length && !selectedChild) setSelectedChild(rows[0].id);
		});
	}, [token]);
	React.useEffect(() => {
		if (!selectedChild) return;
		api<any[]>(`/api/artifacts?child_id=${selectedChild}`).then(setArtifacts);
	}, [selectedChild]);
	return (
		<div style={{ maxWidth: 900, margin: "40px auto", fontFamily: "system-ui, sans-serif" }}>
			<h2>FutureBox</h2>
			<div style={{ display: "flex", justifyContent: "space-between" }}>
				<div>
					{token ? (
						<div>
							<div>Signed in as {email}</div>
							<button onClick={logout} style={{ marginTop: 8 }}>Logout</button>
						</div>
					) : (
						<div>You are not signed in.</div>
					)}
				</div>
			</div>
			<div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 24, marginTop: 24 }}>
				<div>
					<h3>Your children</h3>
					<ul>
						{children.map((c) => (
							<li key={c.id}>
								<label>
									<input type="radio" name="child" checked={selectedChild === c.id} onChange={() => setSelectedChild(c.id)} /> {c.full_name} ({c.date_of_birth})
								</label>
							</li>
						))}
					</ul>
				</div>
				<div>
					<h3>Artifacts</h3>
					{!selectedChild ? (
						<div>Select a child to view artifacts</div>
					) : (
						<ul>
							{artifacts.map((a) => (
								<li key={a.id}>
									<strong>{a.title}</strong> — {a.description || "(no description)"} — release {new Date(a.release_at).toLocaleString()} — {a.unlocked ? (
										<a href={`${API_BASE}/api/artifacts/${a.id}/download?child_id=${selectedChild}`} target="_blank" rel="noreferrer">Download</a>
									) : (
										<span>LOCKED</span>
									)}
								</li>
							))}
							{artifacts.length === 0 && <div>No artifacts yet.</div>}
						</ul>
					)}
				</div>
			</div>
		</div>
	);
}
