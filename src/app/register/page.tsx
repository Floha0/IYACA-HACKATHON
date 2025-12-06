"use client";

import { useState } from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.error);

            // Başarılı olursa
            setSuccess('Kayıt başarılı! Giriş sayfasına yönlendiriliyorsunuz...');

            // 2 saniye sonra login sayfasına at
            setTimeout(() => {
                router.push('/login');
            }, 2000);

        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4">
            <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-700">

                {/* Üst Başlık */}
                <div className="bg-primary/10 p-8 text-center">
                    <h2 className="text-3xl font-black text-primary mb-2">Aramıza Katıl</h2>
                    <p className="text-text-muted-light text-sm">
                        Gönüllülük yolculuğun buradan başlıyor.
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-8 flex flex-col gap-5">

                    {error && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-center gap-2">
                            <AlertCircle size={16} /> {error}
                        </div>
                    )}

                    {success && (
                        <div className="bg-green-50 text-green-600 p-3 rounded-lg text-sm flex items-center gap-2">
                            <CheckCircle size={16} /> {success}
                        </div>
                    )}

                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-bold uppercase text-gray-500">Ad Soyad</label>
                        <input
                            type="text"
                            required
                            className="w-full rounded-xl border-gray-200 bg-gray-50 p-3 focus:ring-2 focus:ring-primary/50 outline-none transition-all dark:bg-gray-900 dark:border-gray-600 dark:text-white"
                            placeholder="Örn: Mehmet Yılmaz"
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                        />
                    </div>

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
                        Kayıt Ol
                    </button>

                    <div className="text-center text-sm text-gray-500 mt-4">
                        Zaten hesabın var mı?
                        <Link href="/login" className="text-primary font-bold ml-2 hover:underline">
                            Giriş Yap
                        </Link>
                    </div>

                </form>
            </div>
        </div>
    );
}