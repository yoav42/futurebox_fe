import React from "react";

interface AuthState {
	token: string | null;
	email: string | null;
}

interface AuthContextValue extends AuthState {
	setAuth: (s: AuthState) => void;
	logout: () => void;
}

const AuthContext = React.createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [state, setState] = React.useState<AuthState>(() => {
		const token = localStorage.getItem("jwt");
		const email = localStorage.getItem("email");
		return { token, email };
	});
	const setAuth = (s: AuthState) => {
		setState(s);
		if (s.token) localStorage.setItem("jwt", s.token); else localStorage.removeItem("jwt");
		if (s.email) localStorage.setItem("email", s.email); else localStorage.removeItem("email");
	};
	const logout = () => setAuth({ token: null, email: null });
	return <AuthContext.Provider value={{ ...state, setAuth, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
	const ctx = React.useContext(AuthContext);
	if (!ctx) throw new Error("AuthContext missing");
	return ctx;
}
