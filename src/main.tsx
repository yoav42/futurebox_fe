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

function Nav() {
    const { token } = useAuth();
    return (
        <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b border-slate-200">
            <nav className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
                <Link to="/" className="inline-flex items-center gap-2 font-semibold text-slate-800">
                    <span className="inline-block h-6 w-6 rounded bg-brand-500"></span>
                    FutureBox
                </Link>
                <div className="flex items-center gap-3 text-sm">
                    <Link className="text-slate-700 hover:text-slate-900 px-3 py-1.5 rounded hover:bg-slate-50" to="/">Home</Link>
                    <Link className="text-slate-700 hover:text-slate-900 px-3 py-1.5 rounded hover:bg-slate-50" to="/claim">Claim</Link>
                    {token && <Link className="text-slate-700 hover:text-slate-900 px-3 py-1.5 rounded hover:bg-slate-50" to="/children/new">New Child</Link>}
                    {token && <Link className="text-slate-700 hover:text-slate-900 px-3 py-1.5 rounded hover:bg-slate-50" to="/artifacts/new">New Artifact</Link>}
                    {!token && <Link className="px-3 py-1.5 rounded-md bg-brand-600 text-white hover:bg-brand-500" to="/login">Login</Link>}
                    {!token && <Link className="px-3 py-1.5 rounded-md border border-slate-300 text-slate-700 hover:bg-slate-50" to="/signup">Signup</Link>}
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

