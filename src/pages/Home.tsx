import React from "react";
import { useAuth } from "../AuthContext";
import { api, API_BASE } from "../api";
import CountdownTimer from "../components/CountdownTimer";

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
	// Stats
	const totalChildren = children.length;
	const unlockedCount = artifacts.filter((a) => a.unlocked).length;
	const lockedCount = artifacts.length - unlockedCount;

	return (
		<div className="space-y-8">
			{/* Header with Logo */}
			<div className="space-y-4">
				{/* Logo and title section */}
				<div className="flex items-center gap-4">
					<img src="/logos/05-elegant-vault.svg" alt="FutureBox" className="h-12 w-12" />
					<div>
						<h1 className="text-2xl font-bold text-slate-900">FutureBox</h1>
						<p className="text-sm text-slate-600">Digital time capsules for your family</p>
					</div>
				</div>
				{/* User info section - separate row on mobile */}
				{token && (
					<div className="flex items-center justify-between">
						<span className="text-sm text-slate-600">Welcome, {email}</span>
						<button
							onClick={logout}
							className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
						>
							Logout
						</button>
					</div>
				)}
			</div>

			{/* Hero */}
			<div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-indigo-50 via-white to-emerald-50">
				<div className="px-6 py-8 md:px-10 md:py-12 flex items-center justify-between gap-6">
					<div>
						<h1 className="text-3xl md:text-4xl font-semibold tracking-tight">Memories that arrive right on time</h1>
						<p className="mt-2 text-slate-700 max-w-xl">Create a private time-capsule for your child. Upload messages, photos, and videos today, and unlock them on a future date — safely and simply.</p>
						<div className="mt-4 flex items-center gap-3">
							{token ? (
								<>
									<a href="/artifacts/new" onClick={() => typeof window !== 'undefined' && (window as any).gtag && (window as any).gtag('event', 'button_click', { button_label: 'Create artifact', location: 'home_hero' })} className="inline-flex items-center rounded-md bg-brand-600 text-white px-4 py-2 text-sm hover:bg-brand-500" aria-label="Create a new artifact">Create artifact</a>
									<a href="/children/new" onClick={() => typeof window !== 'undefined' && (window as any).gtag && (window as any).gtag('event', 'button_click', { button_label: 'Add child', location: 'home_hero' })} className="inline-flex items-center rounded-md border border-slate-300 px-4 py-2 text-sm text-slate-800 hover:bg-slate-50" aria-label="Add a new child">Add child</a>
								</>
							) : (
								<>
									<a href="/signup" onClick={() => typeof window !== 'undefined' && (window as any).gtag && (window as any).gtag('event', 'button_click', { button_label: 'Get started', location: 'home_hero' })} className="inline-flex items-center rounded-md bg-brand-600 text-white px-4 py-2 text-sm hover:bg-brand-500" aria-label="Create your FutureBox account">Get started</a>
									<a href="/claim" onClick={() => typeof window !== 'undefined' && (window as any).gtag && (window as any).gtag('event', 'button_click', { button_label: 'Claim', location: 'home_hero' })} className="inline-flex items-center rounded-md border border-slate-300 px-4 py-2 text-sm text-slate-800 hover:bg-slate-50" aria-label="Start a claim">Claim</a>
								</>
							)}
						</div>
					</div>
					<div className="hidden md:block pr-6">
						<div className="h-28 w-28 rounded-xl bg-white/80 border border-slate-200 flex items-center justify-center shadow-sm">
							<img src="/logos/05-elegant-vault.svg" alt="FutureBox logo mark" className="h-16 w-16" />
						</div>
					</div>
				</div>
			</div>


			{/* Stats */}
			{token && (
				<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
					<div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
						<div className="text-xs uppercase tracking-wide text-slate-500">Children</div>
						<div className="mt-1 text-2xl font-semibold">{totalChildren}</div>
					</div>
					<div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
						<div className="text-xs uppercase tracking-wide text-slate-500">Unlocked</div>
						<div className="mt-1 text-2xl font-semibold text-emerald-600">{unlockedCount}</div>
					</div>
					<div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
						<div className="text-xs uppercase tracking-wide text-slate-500">Locked</div>
						<div className="mt-1 text-2xl font-semibold text-slate-800">{lockedCount}</div>
					</div>
				</div>
			)}

			{token && (
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				<div className="md:col-span-1">
					<div className="rounded-xl border border-slate-200 bg-white shadow-sm">
						<div className="px-4 py-3 border-b border-slate-200 font-medium">Your children</div>
						<ul className="p-2">
							{children.map((c) => (
								<li key={c.id}>
									<button
										className={`w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-slate-50 ${selectedChild === c.id ? 'bg-slate-100 font-medium' : ''}`}
										onClick={() => setSelectedChild(c.id)}
									>
										{c.full_name} <span className="text-slate-500">({c.date_of_birth})</span>
									</button>
								</li>
							))}
							{children.length === 0 && (
								<div className="px-3 py-3 text-sm text-slate-600">
									No children yet. {token ? <a href="/children/new" className="text-brand-600 hover:underline">Add one</a> : <a href="/login" className="text-brand-600 hover:underline">Login</a>}.
								</div>
							)}
						</ul>
					</div>
				</div>

				<div className="md:col-span-2">
					<div className="rounded-xl border border-slate-200 bg-white shadow-sm">
						<div className="px-4 py-3 border-b border-slate-200 font-medium">Artifacts</div>
						<div className="p-4">
							{!selectedChild ? (
								<div className="text-slate-600">Select a child to view artifacts</div>
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
													{a.unlocked ? (
														<a className="inline-flex items-center rounded-md bg-brand-600 text-white px-3 py-1.5 text-sm hover:bg-brand-500" href={`${API_BASE}/api/artifacts/${a.id}/download?child_id=${selectedChild}`} target="_blank" rel="noreferrer">Download</a>
													) : (
														<span className="inline-flex items-center rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-700">🔒 Locked</span>
													)}
												</div>
											</div>
										</div>
									))}
									{artifacts.length === 0 && (
										<div className="rounded-lg border border-dashed border-slate-300 p-6 text-center text-slate-600">
											No artifacts yet. {token ? <a href="/artifacts/new" className="text-brand-600 hover:underline">Create one</a> : <a href="/login" className="text-brand-600 hover:underline">Login</a>}.
										</div>
									)}
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
			)}

			{/* Trust banner */}
			<div className="rounded-xl border border-slate-200 bg-white shadow-sm p-4">
				<div className="flex items-center gap-3">
					<div className="h-6 w-6 rounded bg-emerald-500/20 border border-emerald-600/30"></div>
					<div className="text-sm text-slate-700">Strong identity matching, time-based access, and presigned downloads keep your memories safe.</div>
				</div>
			</div>

			{/* SEO copy blocks */}
			<section className="prose max-w-none">
				<h2 className="text-xl font-semibold mt-10">What is FutureBox?</h2>
				<p className="text-slate-700">FutureBox is a secure digital time capsule for families. Parents can privately store messages, photos, and videos for their children and choose a future date when those memories are revealed. It’s a simple way to preserve milestones and send love into tomorrow.</p>
				<h3 className="text-lg font-semibold mt-6">Why families choose us</h3>
				<ul className="list-disc pl-5 text-slate-700 space-y-1">
					<li>Private by default: content is encrypted in transit and protected at rest.</li>
					<li>Timed release: schedule unlock dates so memories arrive right on time.</li>
					<li>Identity matching: multi-factor checks ensure only the right person can unlock.</li>
					<li>Simple downloads: when it’s time, recipients get secure, time-limited links.</li>
				</ul>
				<h3 className="text-lg font-semibold mt-6">Use cases</h3>
				<p className="text-slate-700">Birthday messages, first-day-of-school photos, graduation notes, family history clips, and more. FutureBox helps you capture meaningful moments now and deliver them when they matter most.</p>
			</section>
		</div>
	);
}
