import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AuthShell from '../components/auth/AuthShell';
import GlassInput from '../components/auth/GlassInput';
import GlassButton from '../components/auth/GlassButton';

export default function RegisterPage() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('STUDENT');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { signup } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await signup({ username, email, password, role });
            navigate('/login');
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Registration failed';
            setError(message.includes('fetch') ? 'Cannot reach the server. Start the backend on port 8080.' : message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthShell
            title="Create account"
            subtitle="Join the student portal to track your courses and progress."
            footer={
                <>
                    Already have an account?{' '}
                    <Link to="/login" className="auth-link">
                        Sign in
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
                    placeholder="Choose a username"
                    autoComplete="username"
                    icon={<User className="h-4 w-4" />}
                    required
                />
                <GlassInput
                    label="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@university.edu"
                    autoComplete="email"
                    icon={<Mail className="h-4 w-4" />}
                    required
                />
                <GlassInput
                    label="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a strong password"
                    autoComplete="new-password"
                    icon={<Lock className="h-4 w-4" />}
                    required
                    minLength={6}
                />

                <div className="flex gap-4">
                    <button
                        type="button"
                        onClick={() => setRole('STUDENT')}
                        className={`flex-1 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                            role === 'STUDENT'
                                ? 'bg-cyan-500 text-white shadow-[0_0_15px_rgba(6,182,212,0.5)]'
                                : 'bg-white/5 text-white/60 hover:bg-white/10'
                        }`}
                    >
                        Student
                    </button>
                    <button
                        type="button"
                        onClick={() => setRole('TEACHER')}
                        className={`flex-1 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                            role === 'TEACHER'
                                ? 'bg-cyan-500 text-white shadow-[0_0_15px_rgba(6,182,212,0.5)]'
                                : 'bg-white/5 text-white/60 hover:bg-white/10'
                        }`}
                    >
                        Teacher
                    </button>
                </div>

                <GlassButton loading={loading}>Create account</GlassButton>
            </form>
        </AuthShell>
    );
}
