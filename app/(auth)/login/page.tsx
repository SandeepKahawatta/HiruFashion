'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch } from '@/lib/api';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
    const [form, setForm] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await apiFetch('/api/auth/login', {
                method: 'POST',
                body: JSON.stringify(form)
            });

            if (!res.ok) {
                alert('Login failed');
                return;
            }

            const data = await res.json();

            window.dispatchEvent(new Event('auth:changed'));
            sessionStorage.setItem('show_welcome_once', '1');

            if (data.role === 'admin') {
                router.push('/admin/products');
            } else {
                router.push('/');
            }
        } catch (error) {
            console.error('Login error:', error);
            alert('An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md bg-white p-8 rounded-2xl shadow-2xl mx-4"
        >
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Welcome Back</h1>
                <p className="text-gray-500 mt-2">Sign in to access your account</p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-4">
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-black transition-colors" />
                        </div>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all bg-gray-50 focus:bg-white"
                            placeholder="Email address"
                            value={form.email}
                            onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                        />
                    </div>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-black transition-colors" />
                        </div>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            required
                            className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all bg-gray-50 focus:bg-white"
                            placeholder="Password"
                            value={form.password}
                            onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                        />
                    </div>
                </div>

                <div className="mt-6">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-gray-500">Or continue with</span>
                        </div>
                    </div>

                    <div className="mt-6">
                        <a
                            href="/api/auth/google"
                            className="w-full flex justify-center items-center py-3 px-4 border border-gray-300 rounded-xl shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-all"
                        >
                            <svg className="h-5 w-5 mr-2" aria-hidden="true" viewBox="0 0 24 24">
                                <path
                                    d="M12.0003 20.45c4.65 0 8.35-3.12 9.75-7.5h-9.75v-4.5h14.1c.15.75.25 1.6.25 2.5 0 6.9-4.6 11.95-11.85 11.95-6.9 0-12.5-5.6-12.5-12.5s5.6-12.5 12.5-12.5c3.25 0 6.2 1.15 8.5 3.35l-3.55 3.55c-1.25-1.2-2.95-1.9-4.95-1.9-4.15 0-7.6 3.25-7.6 7.5s3.45 7.5 7.6 7.5z"
                                    fill="currentColor"
                                />
                            </svg>
                            Sign in with Google
                        </a>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-70 disabled:cursor-not-allowed transition-all transform active:scale-[0.98]"
                >
                    {loading ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                        <span className="flex items-center">
                            Sign In
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </span>
                    )}
                </button>

                <div className="text-center mt-6">
                    <p className="text-sm text-gray-600">
                        New to Fashion Store?{' '}
                        <Link href="/register" className="font-semibold text-black hover:underline transition-all">
                            Create an account
                        </Link>
                    </p>
                </div>
            </form>
        </motion.div>
    );
}
