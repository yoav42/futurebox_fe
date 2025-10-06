import React from "react";
import { api, API_BASE } from "../api";

export default function ClaimStart() {
	const [childId, setChildId] = React.useState("");
	const [fullName, setFullName] = React.useState("");
	const [dob, setDob] = React.useState("");
	const [bc4, setBc4] = React.useState("");
	const [pp4, setPp4] = React.useState("");
	const [result, setResult] = React.useState<string | null>(null);
	const [artifacts, setArtifacts] = React.useState<any[]>([]);

	async function onSubmit(e: React.FormEvent) {
		e.preventDefault();
		try {
			const res = await api<{ match: boolean }>("/api/claim/start", {
				method: "POST",
				body: JSON.stringify({ child_id: childId, full_name: fullName, date_of_birth: dob, bc_last4: bc4, passport_last4: pp4 }),
			});
			setResult(res.match ? "Match" : "No match");
			if (res.match) {
				const list = await api<any[]>(`/api/artifacts?child_id=${encodeURIComponent(childId)}`);
				setArtifacts(list);
			}
		} catch (e) {
			setResult("Error");
		}
	}

	return (
		<div style={{ maxWidth: 640, margin: "40px auto", fontFamily: "system-ui, sans-serif" }}>
			<h2>Claim Start</h2>
			<form onSubmit={onSubmit}>
				<input value={childId} onChange={(e) => setChildId(e.target.value)} placeholder="Child ID" required style={{ width: "100%", padding: 8, marginBottom: 8 }} />
				<input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Full name" required style={{ width: "100%", padding: 8, marginBottom: 8 }} />
				<input value={dob} onChange={(e) => setDob(e.target.value)} placeholder="YYYY-MM-DD" required style={{ width: "100%", padding: 8, marginBottom: 8 }} />
				<input value={bc4} onChange={(e) => setBc4(e.target.value)} placeholder="Birth cert last 4" required style={{ width: "100%", padding: 8, marginBottom: 8 }} />
				<input value={pp4} onChange={(e) => setPp4(e.target.value)} placeholder="Passport last 4" required style={{ width: "100%", padding: 8, marginBottom: 8 }} />
				<button type="submit">Check</button>
			</form>
			{result && <div style={{ marginTop: 8 }}>Result: {result}</div>}
			{result === "Match" && (
				<div style={{ marginTop: 16 }}>
					<h3>Child's artifacts</h3>
					{artifacts.length === 0 ? (
						<div>No artifacts found.</div>
					) : (
						<ul>
							{artifacts.map((a) => (
								<li key={a.id}>
									<strong>{a.title}</strong> — {a.description || "(no description)"} — release {new Date(a.release_at).toLocaleString()} — {" "}
									{a.unlocked ? (
										<a href={`${API_BASE}/api/artifacts/${a.id}/download?child_id=${encodeURIComponent(childId)}`} target="_blank" rel="noreferrer">Download</a>
									) : (
										<span>LOCKED</span>
									)}
								</li>
							))}
						</ul>
					)}
				</div>
			)}
		</div>
	);
}
