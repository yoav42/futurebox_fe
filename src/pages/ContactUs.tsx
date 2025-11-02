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

		if (typeof window !== 'undefined' && (window as any).gtag) {
			(window as any).gtag('event', 'form_submit', { form_name: 'contact_us' });
		}

		try {
			await api<{ success: boolean; message: string }>("/api/contact/send", {
				method: "POST",
				body: JSON.stringify({ email, message }),
			});
			if (typeof window !== 'undefined' && (window as any).gtag) {
				(window as any).gtag('event', 'contact_submitted');
			}
			setSuccess(true);
			setEmail("");
			setMessage("");
		} catch (err: any) {
			if (typeof window !== 'undefined' && (window as any).gtag) {
				(window as any).gtag('event', 'contact_error');
			}
			setError(err.message || "Failed to send message");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="max-w-2xl mx-auto">
			<div className="mb-8 text-center">
				<img src="/logos/05-elegant-vault.svg" alt="FutureBox logo" className="h-16 w-16 mx-auto mb-4" />
				<h2 className="text-2xl font-semibold">Contact FutureBox Support</h2>
				<p className="text-slate-600">Have questions about saving memories for your child? Need help with your account? We're here to help.</p>
				<div className="mt-4 text-sm text-slate-700 max-w-2xl mx-auto space-y-2">
					<p>Our support team helps thousands of parents preserve family memories every day. Whether you need help getting started, have questions about security and privacy, want to upgrade to VIP storage, or need assistance with unlocking memories — we've got you covered.</p>
					<p>We typically respond within 24 hours during business days. For faster resolution, please include:</p>
					<ul className="list-disc list-inside mt-2 text-left">
						<li>Your account email address</li>
						<li>Which page or feature you're having trouble with</li>
						<li>Any error messages you see</li>
					</ul>
				</div>
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

			<div className="mt-8 rounded-xl border border-slate-200 bg-slate-50 p-6">
				<h3 className="text-base font-medium text-slate-900 mb-3">Common questions</h3>
				<div className="space-y-3 text-sm text-slate-700">
					<div>
						<p className="font-medium text-slate-900">How secure is my data?</p>
						<p>All memories are encrypted both in transit and at rest. We use industry-standard security practices and never share your data with third parties. Your privacy is our top priority.</p>
					</div>
					<div>
						<p className="font-medium text-slate-900">How much storage do I get?</p>
						<p>Free accounts include 10MB of storage. Upgrade to VIP for 100MB — perfect for high-resolution photos and longer videos.</p>
					</div>
					<div>
						<p className="font-medium text-slate-900">Can I change the unlock date?</p>
						<p>Currently, unlock dates cannot be changed after a memory is saved. This ensures the integrity of the time capsule experience. Contact us if you have special circumstances.</p>
					</div>
					<div>
						<p className="font-medium text-slate-900">Feature requests and feedback</p>
						<p>We love hearing from parents about how we can improve FutureBox. Share your ideas through the contact form above — your input helps us build features families actually want.</p>
					</div>
				</div>
			</div>
		</div>
	);
}
