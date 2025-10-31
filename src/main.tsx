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
    return (
        <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b border-slate-200">
            <nav className="mx-auto max-w-6xl px-4 py-3">
                {/* Logo and brand */}
                <div className="flex items-center justify-between mb-3 md:mb-0">
                    <Link to="/" className="inline-flex items-center gap-2 font-semibold text-slate-800">
                        <img src="/logos/05-elegant-vault.svg" alt="FutureBox logo" className="h-6 w-6" />
                        FutureBox
                    </Link>
                    {/* Right-side actions */}
                    <div className="flex items-center gap-2">
                        {/* Prominent actions */}
                        <Link className="hidden sm:inline-flex items-center px-3 py-1.5 rounded-md bg-emerald-600 text-white hover:bg-emerald-500 text-sm" to="/vip-coupon" aria-label="Redeem VIP coupon">VIP Coupon</Link>
                        {token && <Link className="hidden sm:inline-flex items-center px-3 py-1.5 rounded-md border border-slate-300 text-slate-700 hover:bg-slate-50 text-sm" to="/children/new" aria-label="Add new child">New Child</Link>}
                        {token && <Link className="hidden sm:inline-flex items-center px-3 py-1.5 rounded-md border border-slate-300 text-slate-700 hover:bg-slate-50 text-sm" to="/artifacts/new" aria-label="Create new artifact">New Artifact</Link>}
                        {/* Auth */}
                        {!token && <Link className="px-3 py-1.5 rounded-md bg-brand-600 text-white hover:bg-brand-500 text-sm" to="/login">Login</Link>}
                        {!token && <Link className="px-3 py-1.5 rounded-md border border-slate-300 text-slate-700 hover:bg-slate-50 text-sm" to="/signup">Signup</Link>}
                        {/* Hamburger (mobile) */}
                        <button aria-label="Toggle menu" className="md:hidden ml-1 inline-flex h-9 w-9 items-center justify-center rounded-md border border-slate-300 hover:bg-slate-50" onClick={() => setOpen((v) => !v)}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>
                </div>
                {/* Navigation links - full width on mobile */}
                <div className={`${open ? 'flex' : 'hidden'} md:flex items-center gap-1 text-sm overflow-x-auto`}>
                    <Link className="text-slate-700 hover:text-slate-900 px-3 py-1.5 rounded hover:bg-slate-50 whitespace-nowrap" to="/">Home</Link>
                    <Link className="text-slate-700 hover:text-slate-900 px-3 py-1.5 rounded hover:bg-slate-50 whitespace-nowrap" to="/claim">Claim</Link>
                    <Link className="text-slate-700 hover:text-slate-900 px-3 py-1.5 rounded hover:bg-slate-50 whitespace-nowrap" to="/contact">Contact Us</Link>
                    {token && <Link className="text-slate-700 hover:text-slate-900 px-3 py-1.5 rounded hover:bg-slate-50 whitespace-nowrap" to="/manage">Manage</Link>}
                    {/* Mobile quick actions */}
                    <Link className="sm:hidden text-emerald-700 hover:text-emerald-900 px-3 py-1.5 rounded hover:bg-emerald-50 whitespace-nowrap" to="/vip-coupon">VIP Coupon</Link>
                    {token && <Link className="sm:hidden text-slate-700 hover:text-slate-900 px-3 py-1.5 rounded hover:bg-slate-50 whitespace-nowrap" to="/children/new">New Child</Link>}
                    {token && <Link className="sm:hidden text-slate-700 hover:text-slate-900 px-3 py-1.5 rounded hover:bg-slate-50 whitespace-nowrap" to="/artifacts/new">New Artifact</Link>}
                </div>
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

