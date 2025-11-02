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
					<h1 className="text-3xl md:text-4xl font-semibold tracking-tight">Store secrets and messages your child will discover later in life</h1>
					<p className="mt-2 text-slate-700 max-w-xl">Save photos, videos, and heartfelt messages as future-proof memories. Set a future date when your child can unlock and discover these hidden treasures — like a time capsule that opens automatically when the time is right.</p>
						<div className="mt-4 flex items-center gap-3">
							{token ? (
								<>
									<a href="/artifacts/new" onClick={() => typeof window !== 'undefined' && (window as any).gtag && (window as any).gtag('event', 'button_click', { button_label: 'Add memory', location: 'home_hero' })} className="inline-flex items-center rounded-md bg-brand-600 text-white px-4 py-2 text-sm hover:bg-brand-500" aria-label="Add a new memory">Add memory</a>
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
						<div className="px-4 py-3 border-b border-slate-200 font-medium">Memories</div>
						<div className="p-4">
							{!selectedChild ? (
								<div className="text-slate-600">Select a child to view their memories</div>
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
											No memories saved yet. {token ? <a href="/artifacts/new" className="text-brand-600 hover:underline">Add your first memory</a> : <a href="/login" className="text-brand-600 hover:underline">Login</a>}.
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
			<div className="rounded-xl border border-emerald-200 bg-emerald-50 shadow-sm p-6">
				<div className="flex items-start gap-4">
					<div className="h-8 w-8 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
						<span className="text-white text-sm">✓</span>
					</div>
					<div>
						<div className="font-medium text-emerald-900 mb-1">Your memories are protected</div>
						<div className="text-sm text-emerald-800">All files are encrypted, stored securely, and only accessible to verified recipients. We never share your data with third parties. Your family's privacy is our priority.</div>
					</div>
				</div>
			</div>

			{/* SEO copy blocks */}
			<section className="prose max-w-none">
				<h2 className="text-xl font-semibold mt-10">What is FutureBox?</h2>
				<p className="text-slate-700">FutureBox is the secure digital time capsule service that lets parents save secrets, proof of milestones, and heartfelt messages for their children to discover later in life. Store photos, videos, letters, and voice messages today, then set a future date when your child can unlock and reveal these hidden treasures. Like a locked safe that opens on its own, FutureBox preserves memories as future-proof evidence of childhood moments, family stories, and messages your child will treasure when they're older.</p>
				<h3 className="text-lg font-semibold mt-6">Why thousands of parents trust FutureBox</h3>
				<ul className="list-disc pl-5 text-slate-700 space-y-2">
					<li><strong>Bank-level security:</strong> All memories are encrypted and stored securely. Your private family moments stay private.</li>
					<li><strong>Automatic delivery:</strong> Set a future date and your child will be able to unlock their memories when the time comes — no need to remember or manually send.</li>
					<li><strong>Secure identity verification:</strong> Multi-factor identity matching ensures only your child can access their memories, using information only you and they know.</li>
					<li><strong>Easy to use:</strong> Upload photos and videos in seconds. Simple interface designed for busy parents who want to preserve family moments without complexity.</li>
					<li><strong>Free to start:</strong> Begin saving memories today. Upgrade to VIP for more storage when you need it.</li>
				</ul>
				<h3 className="text-lg font-semibold mt-6">Perfect for secrets and future revelations</h3>
				<p className="text-slate-700">Save a birthday message as a secret they'll discover on their 18th birthday. Capture their first steps on video and set it to unlock as proof on graduation day — a hidden memory that becomes a surprise gift years later. Write a letter for their wedding day that they'll read on that special moment. Record family stories and life advice as secrets that will be revealed when they're old enough to understand. Store photos of milestones as future-proof evidence of their childhood. FutureBox makes it easy to preserve those hidden treasures and deliver them as surprises at just the right time in their life.</p>
				<h3 className="text-lg font-semibold mt-6">How it works</h3>
				<ol className="list-decimal pl-5 text-slate-700 space-y-2">
					<li><strong>Create your account:</strong> Sign up in seconds — no credit card required. Your secrets stay private and secure.</li>
					<li><strong>Add your child:</strong> Create a secure profile for each child you want to save memories for. This creates their future-proof vault.</li>
					<li><strong>Store your secrets:</strong> Upload photos, videos, messages, or any digital file as proof of milestones or hidden messages. Set the unlock date — tomorrow, next year, or decades from now. These memories remain locked and secret until the chosen date.</li>
					<li><strong>Automatic revelation:</strong> When the date arrives, your child can verify their identity and unlock their hidden memories. The secrets you saved years ago are revealed at just the right moment — like opening a time capsule that's been waiting for them.</li>
				</ol>
			</section>
		</div>
	);
}
