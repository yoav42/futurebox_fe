import React from "react";
import { api } from "../api";

export default function ContactUs() {
	const [email, setEmail] = React.useState("");
	const [message, setMessage] = React.useState("");
	const [loading, setLoading] = React.useState(false);
	const [success, setSuccess] = React.useState(false);
	const [error, setError] = React.useState<string | null>(null);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		
		setLoading(true);
		setError(null);
		setSuccess(false);

		try {
			await api<{ success: boolean; message: string }>("/api/contact/send", {
				method: "POST",
				body: JSON.stringify({ email, message }),
			});
			setSuccess(true);
			setEmail("");
			setMessage("");
		} catch (err: any) {
			setError(err.message || "Failed to send message");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="max-w-2xl mx-auto">
			<div className="mb-8 text-center">
				<img src="/logos/05-elegant-vault.svg" alt="FutureBox" className="h-16 w-16 mx-auto mb-4" />
				<h2 className="text-2xl font-semibold">Contact Us</h2>
				<p className="text-slate-600">We'd love to hear from you! Send us a message and we'll respond as soon as possible.</p>
			</div>

			<div className="rounded-xl border border-slate-200 bg-white shadow-sm p-6">
				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
							Your Email
						</label>
						<input
							type="email"
							id="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							placeholder="your@email.com"
							required
							className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
						/>
					</div>
					
					<div>
						<label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-1">
							Message
						</label>
						<textarea
							id="message"
							value={message}
							onChange={(e) => setMessage(e.target.value)}
							placeholder="Tell us what's on your mind..."
							required
							rows={6}
							className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
						/>
					</div>
					
					<button
						type="submit"
						disabled={loading}
						className="w-full inline-flex items-center justify-center rounded-md bg-brand-600 text-white px-4 py-2 text-sm hover:bg-brand-500 disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{loading ? "Sending..." : "Send Message"}
					</button>
				</form>

				{success && (
					<div className="mt-4 p-4 bg-emerald-50 border border-emerald-200 rounded-md">
						<p className="text-sm text-emerald-800">
							✓ Your message has been sent successfully! We'll get back to you soon.
						</p>
					</div>
				)}

				{error && (
					<div className="mt-4 p-4 bg-rose-50 border border-rose-200 rounded-md">
						<p className="text-sm text-rose-800">{error}</p>
					</div>
				)}
			</div>

			<div className="mt-8 text-center text-sm text-slate-600">
				<p>We typically respond within 24 hours during business days.</p>
			</div>
		</div>
	);
}
