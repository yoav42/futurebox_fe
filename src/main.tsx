import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import { AuthProvider, useAuth } from "./AuthContext";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import CreateChild from "./pages/CreateChild";
import CreateArtifact from "./pages/CreateArtifact";
import ClaimStart from "./pages/ClaimStart";
import VipCoupon from "./pages/VipCoupon";
import ContactUs from "./pages/ContactUs";
import Manage from "./pages/Manage";

function Nav() {
    const { token } = useAuth();
    const [open, setOpen] = React.useState(false);

    const trackNav = (label: string, to: string) => {
        if (typeof window !== 'undefined' && (window as any).gtag) {
            (window as any).gtag('event', 'navigation_click', { nav_label: label, destination: to });
        }
    };

    return (
        <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b border-slate-200">
            <nav className="mx-auto max-w-6xl px-4 py-3">
                {/* Logo and brand */}
                <div className="flex items-center justify-between mb-3 md:mb-0">
                    <Link to="/" onClick={() => trackNav('Logo', '/')} className="inline-flex items-center gap-2 font-semibold text-slate-800">
                        <img src="/logos/05-elegant-vault.svg" alt="FutureBox logo" className="h-6 w-6" />
                        FutureBox
                    </Link>
                    {/* Right-side actions */}
                    <div className="flex items-center gap-2">
                        {/* Prominent actions */}
                        <Link className="hidden sm:inline-flex items-center px-3 py-1.5 rounded-md bg-emerald-600 text-white hover:bg-emerald-500 text-sm" to="/vip-coupon" onClick={() => trackNav('VIP Coupon Button', '/vip-coupon')} aria-label="Redeem VIP coupon">VIP Coupon</Link>
                        {token && <Link className="hidden sm:inline-flex items-center px-3 py-1.5 rounded-md border border-slate-300 text-slate-700 hover:bg-slate-50 text-sm" to="/children/new" onClick={() => trackNav('New Child Button', '/children/new')} aria-label="Add new child">New Child</Link>}
                        {token && <Link className="hidden sm:inline-flex items-center px-3 py-1.5 rounded-md border border-slate-300 text-slate-700 hover:bg-slate-50 text-sm" to="/artifacts/new" onClick={() => trackNav('New Artifact Button', '/artifacts/new')} aria-label="Create new artifact">New Artifact</Link>}
                        {/* Auth */}
                        {!token && <Link className="px-3 py-1.5 rounded-md bg-brand-600 text-white hover:bg-brand-500 text-sm" to="/login" onClick={() => trackNav('Login Button', '/login')}>Login</Link>}
                        {!token && <Link className="px-3 py-1.5 rounded-md border border-slate-300 text-slate-700 hover:bg-slate-50 text-sm" to="/signup" onClick={() => trackNav('Signup Button', '/signup')}>Signup</Link>}
                        {/* Hamburger (mobile) */}
                        <button aria-label="Toggle menu" className="md:hidden ml-1 inline-flex h-9 w-9 items-center justify-center rounded-md border border-slate-300 hover:bg-slate-50" onClick={() => setOpen((v) => !v)}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>
                </div>
                {/* Desktop nav */}
                <div className="hidden md:flex items-center gap-1 text-sm">
                    <Link className="text-slate-700 hover:text-slate-900 px-3 py-1.5 rounded hover:bg-slate-50" to="/" onClick={() => trackNav('Home', '/')}>Home</Link>
                    <Link className="text-slate-700 hover:text-slate-900 px-3 py-1.5 rounded hover:bg-slate-50" to="/claim" onClick={() => trackNav('Claim', '/claim')}>Claim</Link>
                    <Link className="text-slate-700 hover:text-slate-900 px-3 py-1.5 rounded hover:bg-slate-50" to="/contact" onClick={() => trackNav('Contact Us', '/contact')}>Contact Us</Link>
                    {token && <Link className="text-slate-700 hover:text-slate-900 px-3 py-1.5 rounded hover:bg-slate-50" to="/manage" onClick={() => trackNav('Manage', '/manage')}>Manage</Link>}
                </div>

                {/* Mobile menu panel */}
                {open && (
                    <div className="md:hidden mt-2 rounded-xl border border-slate-200 bg-white shadow-lg divide-y divide-slate-200 overflow-hidden">
                        <div className="flex flex-col">
                            <Link className="px-4 py-3 text-slate-800 hover:bg-slate-50" to="/" onClick={() => { trackNav('Home (Mobile)', '/'); setOpen(false); }}>Home</Link>
                            <Link className="px-4 py-3 text-slate-800 hover:bg-slate-50" to="/claim" onClick={() => { trackNav('Claim (Mobile)', '/claim'); setOpen(false); }}>Claim</Link>
                            <Link className="px-4 py-3 text-slate-800 hover:bg-slate-50" to="/contact" onClick={() => { trackNav('Contact Us (Mobile)', '/contact'); setOpen(false); }}>Contact Us</Link>
                            {token && <Link className="px-4 py-3 text-slate-800 hover:bg-slate-50" to="/manage" onClick={() => { trackNav('Manage (Mobile)', '/manage'); setOpen(false); }}>Manage</Link>}
                        </div>
                        <div className="flex flex-col">
                            <Link className="px-4 py-3 text-emerald-700 hover:bg-emerald-50" to="/vip-coupon" onClick={() => { trackNav('VIP Coupon (Mobile)', '/vip-coupon'); setOpen(false); }}>VIP Coupon</Link>
                            {token && <Link className="px-4 py-3 text-slate-800 hover:bg-slate-50" to="/children/new" onClick={() => { trackNav('New Child (Mobile)', '/children/new'); setOpen(false); }}>New Child</Link>}
                            {token && <Link className="px-4 py-3 text-slate-800 hover:bg-slate-50" to="/artifacts/new" onClick={() => { trackNav('New Artifact (Mobile)', '/artifacts/new'); setOpen(false); }}>New Artifact</Link>}
                        </div>
                    </div>
                )}
            </nav>
        </header>
    );
}

function App() {
	return (
		<AuthProvider>
            <BrowserRouter>
                <Nav />
                <main className="mx-auto max-w-6xl px-4 py-8">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<Signup />} />
                        <Route path="/children/new" element={<CreateChild />} />
                        <Route path="/artifacts/new" element={<CreateArtifact />} />
                        <Route path="/claim" element={<ClaimStart />} />
                        <Route path="/vip-coupon" element={<VipCoupon />} />
                        <Route path="/manage" element={<Manage />} />
                        <Route path="/contact" element={<ContactUs />} />
                        <Route path="*" element={<Navigate to="/" />} />
                    </Routes>
                </main>
                <footer className="border-t border-slate-200">
                    <div className="mx-auto max-w-6xl px-4 py-6 text-sm text-slate-600 flex items-center justify-between">
                        <div>© {new Date().getFullYear()} FutureBox</div>
                        <div className="flex items-center gap-4">
                            <a className="hover:text-slate-800" href="/claim">Claim</a>
                            <a className="hover:text-slate-800" href="/login">Login</a>
                        </div>
                    </div>
                </footer>
            </BrowserRouter>
		</AuthProvider>
	);
}

const root = createRoot(document.getElementById("root")!);
root.render(<App />);

