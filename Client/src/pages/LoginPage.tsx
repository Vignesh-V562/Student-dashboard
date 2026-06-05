import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await login({ username, password });
            navigate('/');
        } catch (err) {
            setError('Invalid username or password');
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-[#e0e5ec] font-sans">
            <div className="w-full max-w-md rounded-[2rem] bg-[#e0e5ec] p-10 shadow-[10px_10px_20px_#a3b1c6,-10px_-10px_20px_#ffffff]">
                <div className="mb-8 flex justify-center">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full shadow-[inset_6px_6px_12px_#a3b1c6,inset_-6px_-6px_12px_#ffffff]">
                        <svg className="h-10 w-10 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
                        </svg>
                    </div>
                </div>
                
                <h2 className="mb-6 text-center text-3xl font-extrabold tracking-tight text-gray-700">Welcome Back</h2>
                
                {error && (
                    <div className="mb-6 rounded-2xl bg-[#e0e5ec] p-4 text-center text-sm font-semibold text-red-500 shadow-[inset_4px_4px_8px_#a3b1c6,inset_-4px_-4px_8px_#ffffff]">
                        {error}
                    </div>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="ml-2 block text-sm font-semibold text-gray-600">Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="mt-2 block w-full rounded-2xl bg-[#e0e5ec] px-5 py-4 text-gray-700 shadow-[inset_6px_6px_12px_#a3b1c6,inset_-6px_-6px_12px_#ffffff] focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-[#e0e5ec] transition-all"
                            placeholder="Enter your username"
                            required
                        />
                    </div>
                    <div>
                        <label className="ml-2 block text-sm font-semibold text-gray-600">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-2 block w-full rounded-2xl bg-[#e0e5ec] px-5 py-4 text-gray-700 shadow-[inset_6px_6px_12px_#a3b1c6,inset_-6px_-6px_12px_#ffffff] focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-[#e0e5ec] transition-all"
                            placeholder="Enter your password"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="mt-8 block w-full rounded-2xl bg-[#e0e5ec] py-4 text-lg font-bold text-indigo-600 shadow-[8px_8px_16px_#a3b1c6,-8px_-8px_16px_#ffffff] transition-all active:shadow-[inset_6px_6px_12px_#a3b1c6,inset_-6px_-6px_12px_#ffffff] hover:text-indigo-700"
                    >
                        Sign In
                    </button>
                </form>
                
                <div className="mt-8 text-center text-sm font-medium text-gray-500">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-indigo-600 hover:text-indigo-800 hover:underline">
                        Sign Up
                    </Link>
                </div>
            </div>
        </div>
    );
}
