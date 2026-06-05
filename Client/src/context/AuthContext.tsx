import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { login as apiLogin, signup as apiSignup, fetchCurrentUser } from "../services/api";
import type { UserProfile } from "../types";

interface AuthContextType {
    user: UserProfile | null;
    token: string | null;
    login: (credentials: { username: string; password: string }) => Promise<void>;
    signup: (userData: { username: string; email: string; password: string }) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
    const [loading, setLoading] = useState(!!localStorage.getItem("token"));

    useEffect(() => {
        if (!token) {
            setLoading(false);
            return;
        }
        fetchCurrentUser()
            .then((res) => {
                if (res.success) setUser(res.data);
                else {
                    localStorage.removeItem("token");
                    setToken(null);
                }
            })
            .catch(() => {
                localStorage.removeItem("token");
                setToken(null);
            })
            .finally(() => setLoading(false));
    }, [token]);

    const login = async (credentials: { username: string; password: string }) => {
        const data = await apiLogin(credentials);
        if (data.success && data.data?.token) {
            setToken(data.data.token);
            localStorage.setItem("token", data.data.token);
            const profile = await fetchCurrentUser();
            if (profile.success) setUser(profile.data);
        } else {
            throw new Error(data.message || "Login failed");
        }
    };

    const signup = async (userData: { username: string; email: string; password: string }) => {
        const data = await apiSignup(userData);
        if (!data.success) throw new Error(data.message || "Registration failed");
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem("token");
    };

    return (
        <AuthContext.Provider value={{ user, token, login, signup, logout, isAuthenticated: !!token, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
