import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Lock, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AuthShell from '../components/auth/AuthShell';
import GlassInput from '../components/auth/GlassInput';
import GlassButton from '../components/auth/GlassButton';

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login({ username, password });
            navigate('/');
        } catch {
            setError('Invalid username or password. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthShell
            title="Welcome back"
            subtitle="Sign in to view exams, assignments, and your academic schedule."
            footer={
                <>
                    Don&apos;t have an account?{' '}
                    <Link to="/register" className="auth-link">
                        Create one
                    </Link>
                </>
            }
        >
            {error && (
                <div
                    role="alert"
                    className="auth-error mb-6 flex items-start gap-3 rounded-xl px-4 py-3 text-sm"
                >
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-300" />
                    <span>{error}</span>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
                <GlassInput
                    label="Username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username"
                    autoComplete="username"
                    icon={<User className="h-4 w-4" />}
                    required
                />
                <GlassInput
                    label="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    icon={<Lock className="h-4 w-4" />}
                    required
                />
                <GlassButton loading={loading}>Sign in</GlassButton>
            </form>
        </AuthShell>
    );
}
