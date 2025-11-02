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
		if (typeof window !== 'undefined' && (window as any).gtag) {
			(window as any).gtag('event', 'form_submit', { form_name: 'claim_start' });
		}
		try {
			const res = await api<{ match: boolean; child_id?: string }>("/api/claim/start", {
				method: "POST",
				body: JSON.stringify({ full_name: fullName, date_of_birth: dob, bc_last4: bc4, passport_last4: pp4 }),
			});
			if (typeof window !== 'undefined' && (window as any).gtag) {
				(window as any).gtag('event', 'claim_result', { match: res.match });
			}
			setResult(res.match ? "Match" : "No match");
			if (res.match && res.child_id) {
				setMatchedChildId(res.child_id);
				const list = await api<any[]>(`/api/artifacts?child_id=${encodeURIComponent(res.child_id)}`);
				setArtifacts(list);
			}
		} catch (e) {
			if (typeof window !== 'undefined' && (window as any).gtag) {
				(window as any).gtag('event', 'claim_error');
			}
			setResult("Error");
		}
	}

    return (
        <div className="max-w-2xl mx-auto">
			<div className="mb-8 text-center">
				<img src="/logos/05-elegant-vault.svg" alt="FutureBox logo" className="h-16 w-16 mx-auto mb-4" />
				<h2 className="text-2xl font-semibold">Discover your hidden FutureBox secrets</h2>
				<p className="text-slate-600">Someone may have saved secrets, proof, or special messages for you to discover later in life. Check securely with your identity information.</p>
				<div className="mt-4 text-sm text-slate-700 max-w-prose mx-auto space-y-2">
					<p><strong>Is there a FutureBox waiting for you?</strong> Parents, grandparents, and family members use FutureBox to save hidden photos, videos, letters, and secret messages as future-proof memories for loved ones to discover years later. These locked treasures remain secret until the chosen unlock date arrives.</p>
					<p>Enter your details below to securely check if someone has stored secrets or proof of milestones for you. We use advanced identity matching — your full name, date of birth, and the last 4 digits of your birth certificate and passport — to ensure only you can access these hidden memories.</p>
					<p className="text-xs text-slate-600 mt-3">🔒 Your information is never displayed or shared. We only show if there's a match and what secrets are waiting to be revealed when their unlock dates arrive.</p>
				</div>
			</div>
            <form onSubmit={onSubmit} className="rounded-xl border border-slate-200 bg-white shadow-sm p-4 space-y-3">
                <div>
                    <label className="block text-sm font-medium text-slate-700">Full name</label>
                    <input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="First Last" required className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700">Date of birth</label>
                    <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} required className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
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
                    <div className="px-4 py-3 border-b border-slate-200 font-medium">Your hidden memories</div>
                    <div className="p-4">
                        {artifacts.length === 0 ? (
                            <div className="text-sm text-slate-500">No memories found yet. Check back when unlock dates arrive.</div>
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

            {/* Claim help text */}
            <div className="mt-8 rounded-xl border border-blue-200 bg-blue-50 p-6">
                <h3 className="text-base font-medium text-blue-900 mb-3">How secure identity verification works</h3>
                <ol className="list-decimal list-inside space-y-2 text-sm text-blue-800">
                    <li><strong>Enter your information:</strong> Provide your full name, date of birth, and the last 4 digits of your birth certificate and passport. This information is encrypted and never stored in plain text.</li>
                    <li><strong>Secure matching:</strong> Our system compares your details against encrypted records. We never reveal sensitive information during this process.</li>
                    <li><strong>View your memories:</strong> If a match is found, you'll see the memories saved for you, along with their unlock dates (when you'll be able to download them).</li>
                    <li><strong>Download when ready:</strong> Once a memory's unlock date arrives, you can download it using a secure, time-limited link that expires after use.</li>
                </ol>
                <div className="mt-4 pt-4 border-t border-blue-300">
                    <p className="text-xs text-blue-700"><strong>Why we need this information:</strong> Identity verification ensures that only the intended recipient can access their memories. This protects your privacy and gives parents confidence that their saved moments will reach the right person.</p>
                </div>
            </div>
        </div>
    );
}
