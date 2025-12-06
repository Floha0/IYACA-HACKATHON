"use client";

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
    const { login } = useAuth();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.error);

            // Giriş başarılı, Context'i güncelle ve ana sayfaya yönlendir
            login(data.user);

        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4">
            <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-700">

                {/* Üst Başlık */}
                <div className="bg-primary/10 p-8 text-center">
                    <h2 className="text-3xl font-black text-primary mb-2">Hoş Geldin</h2>
                    <p className="text-text-muted-light text-sm">
                        Kaldığın yerden devam etmek için giriş yap.
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-8 flex flex-col gap-5">

                    {error && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-center gap-2">
                            <AlertCircle size={16} /> {error}
                        </div>
                    )}

                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-bold uppercase text-gray-500">E-Posta</label>
                        <input
                            type="email"
                            required
                            className="w-full rounded-xl border-gray-200 bg-gray-50 p-3 focus:ring-2 focus:ring-primary/50 outline-none transition-all dark:bg-gray-900 dark:border-gray-600 dark:text-white"
                            placeholder="ornek@email.com"
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-bold uppercase text-gray-500">Şifre</label>
                        <input
                            type="password"
                            required
                            className="w-full rounded-xl border-gray-200 bg-gray-50 p-3 focus:ring-2 focus:ring-primary/50 outline-none transition-all dark:bg-gray-900 dark:border-gray-600 dark:text-white"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                        />
                    </div>

                    <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-blue-500/30 transition-all active:scale-95 mt-2">
                        Giriş Yap
                    </button>

                    <div className="text-center text-sm text-gray-500 mt-4">
                        Henüz hesabın yok mu?
                        <Link href="/register" className="text-primary font-bold ml-2 hover:underline">
                            Kayıt Ol
                        </Link>
                    </div>

                </form>
            </div>
        </div>
    );
}