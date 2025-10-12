import React from "react";
import { api, API_BASE } from "../api";
import CountdownTimer from "../components/CountdownTimer";

export default function ClaimStart() {
	const [fullName, setFullName] = React.useState("");
	const [dob, setDob] = React.useState("");
	const [bc4, setBc4] = React.useState("");
	const [pp4, setPp4] = React.useState("");
	const [result, setResult] = React.useState<string | null>(null);
	const [artifacts, setArtifacts] = React.useState<any[]>([]);
	const [matchedChildId, setMatchedChildId] = React.useState<string | null>(null);

	async function onSubmit(e: React.FormEvent) {
		e.preventDefault();
		try {
			const res = await api<{ match: boolean; child_id?: string }>("/api/claim/start", {
				method: "POST",
				body: JSON.stringify({ full_name: fullName, date_of_birth: dob, bc_last4: bc4, passport_last4: pp4 }),
			});
			setResult(res.match ? "Match" : "No match");
			if (res.match && res.child_id) {
				setMatchedChildId(res.child_id);
				const list = await api<any[]>(`/api/artifacts?child_id=${encodeURIComponent(res.child_id)}`);
				setArtifacts(list);
			}
		} catch (e) {
			setResult("Error");
		}
	}

    return (
        <div className="max-w-2xl mx-auto">
            <div className="mb-8 text-center">
                <img src="/logos/05-elegant-vault.svg" alt="FutureBox" className="h-16 w-16 mx-auto mb-4" />
                <h2 className="text-2xl font-semibold">Claim your FutureBox</h2>
                <p className="text-slate-600">We use multiple factors to protect your privacy. Enter your details below.</p>
            </div>
            <form onSubmit={onSubmit} className="rounded-xl border border-slate-200 bg-white shadow-sm p-4 space-y-3">
                <div>
                    <label className="block text-sm font-medium text-slate-700">Full name</label>
                    <input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="First Last" required className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700">Date of birth</label>
                    <input value={dob} onChange={(e) => setDob(e.target.value)} placeholder="YYYY-MM-DD" required className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
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
                <div className="pt-2">
                    <button type="submit" className="inline-flex items-center rounded-md bg-brand-600 text-white px-4 py-2 text-sm hover:bg-brand-500">Check</button>
                </div>
            </form>

            {result && (
                <div className={`mt-3 text-sm ${result === 'Match' ? 'text-emerald-600' : result === 'Error' ? 'text-rose-600' : 'text-slate-700'}`}>Result: {result}</div>
            )}

            {result === "Match" && (
                <div className="mt-6 rounded-xl border border-slate-200 bg-white shadow-sm">
                    <div className="px-4 py-3 border-b border-slate-200 font-medium">Child's artifacts</div>
                    <div className="p-4">
                        {artifacts.length === 0 ? (
                            <div className="text-sm text-slate-500">No artifacts found.</div>
                        ) : (
                            <div className="grid gap-3">
                                {artifacts.map((a) => (
                                    <div key={a.id} className="rounded-lg border border-slate-200 p-4 flex items-center justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="font-medium text-slate-900">{a.title}</div>
                                            <div className="text-sm text-slate-600 mt-1">{a.description || "(no description)"}</div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <CountdownTimer
                                                releaseAt={a.release_at}
                                                unlocked={a.unlocked}
                                                secondsUntilUnlock={a.seconds_until_unlock || 0}
                                                daysUntilUnlock={a.days_until_unlock || 0}
                                            />
                                            <div>
                                                {a.unlocked && matchedChildId ? (
                                                    <a className="inline-flex items-center rounded-md bg-brand-600 text-white px-3 py-1.5 text-sm hover:bg-brand-500" href={`${API_BASE}/api/artifacts/${a.id}/download?child_id=${encodeURIComponent(matchedChildId)}`} target="_blank" rel="noreferrer">Download</a>
                                                ) : (
                                                    <span className="inline-flex items-center rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-700">🔒 Locked</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
