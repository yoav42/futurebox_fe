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
		<nav style={{ display: "flex", gap: 12, padding: 12, borderBottom: "1px solid #eee" }}>
			<Link to="/">Home</Link>
			<Link to="/claim">Claim</Link>
			{token && <Link to="/children/new">New Child</Link>}
			{token && <Link to="/artifacts/new">New Artifact</Link>}
			{!token && <Link to="/login">Login</Link>}
			{!token && <Link to="/signup">Signup</Link>}
		</nav>
	);
}

function App() {
	return (
		<AuthProvider>
			<BrowserRouter>
				<Nav />
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/login" element={<Login />} />
					<Route path="/signup" element={<Signup />} />
					<Route path="/children/new" element={<CreateChild />} />
					<Route path="/artifacts/new" element={<CreateArtifact />} />
					<Route path="/claim" element={<ClaimStart />} />
					<Route path="*" element={<Navigate to="/" />} />
				</Routes>
			</BrowserRouter>
		</AuthProvider>
	);
}

const root = createRoot(document.getElementById("root")!);
root.render(<App />);

