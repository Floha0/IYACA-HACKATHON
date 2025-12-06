"use client";

import { useAuth } from '@/context/AuthContext';
import { useEffect, useState } from 'react';
import { User, Trophy, Target, AlertTriangle, Clock } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
    const { user } = useAuth();
    const router = useRouter();

    // İstatistik State'i
    const [stats, setStats] = useState({
        totalSimulations: 0,
        completedSimulations: 0,
        averageProgress: 0,
    });

    // Zorlanılan Alanlar State'i
    const [struggles, setStruggles] = useState<{ category: string; count: number }[]>([]);
    const [loading, setLoading] = useState(true);

    // Giriş kontrolü
    useEffect(() => {
        if (!user && typeof window !== 'undefined') {
            // router.push('/login'); // İstersen açabilirsin
        }
    }, [user, router]);

    // VERİLERİ API'DEN ÇEK
    useEffect(() => {
        if (user) {
            // 1. Simülasyon İlerlemelerini Çek
            fetch('/api/progress/get', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.id })
            })
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        const sims = data.data; // Veritabanından gelen liste

                        if (sims.length > 0) {
                            const completed = sims.filter((s: any) => s.progress === 100).length;
                            const totalProgress = sims.reduce((acc: number, curr: any) => acc + (curr.progress || 0), 0);

                            setStats({
                                totalSimulations: sims.length,
                                completedSimulations: completed,
                                averageProgress: Math.round(totalProgress / sims.length)
                            });
                        }
                    }
                });

            // 2. Zorlanılan Alanları Çek
            fetch('/api/struggles/get', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.id })
            })
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        setStruggles(data.data); // [{ category: '...', count: 2 }, ...]
                    }
                    setLoading(false);
                });
        }
    }, [user]);

    if (!user) return <div className="text-center py-20">Lütfen giriş yapın.</div>;

    return (
        <div className="container mx-auto px-4 py-12 max-w-5xl">

            {/* Üst Kısım: Profil Kartı */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-soft border border-gray-100 dark:border-gray-700 flex flex-col md:flex-row items-center gap-8 mb-10">
                <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <User size={48} />
                </div>
                <div className="text-center md:text-left flex-grow">
                    <h1 className="text-3xl font-black text-gray-800 dark:text-white mb-2">{user.name}</h1>
                    <p className="text-text-muted-light text-lg">{user.email}</p>
                    <div className="mt-4 inline-flex items-center px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-primary rounded-full text-sm font-bold">
                        Gönüllü Adayı
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                {/* Sol Kolon: İstatistikler */}
                <div className="md:col-span-1 flex flex-col gap-6">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-4">
                        <div className="p-3 bg-purple-100 text-purple-600 rounded-xl"><Trophy size={24} /></div>
                        <div>
                            <p className="text-sm text-gray-500">Tamamlanan</p>
                            <p className="text-2xl font-black">{stats.completedSimulations}</p>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-4">
                        <div className="p-3 bg-blue-100 text-blue-600 rounded-xl"><Target size={24} /></div>
                        <div>
                            <p className="text-sm text-gray-500">Toplam Başlanan</p>
                            <p className="text-2xl font-black">{stats.totalSimulations}</p>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-4">
                        <div className="p-3 bg-green-100 text-green-600 rounded-xl"><Clock size={24} /></div>
                        <div>
                            <p className="text-sm text-gray-500">Ortalama İlerleme</p>
                            <p className="text-2xl font-black">%{stats.averageProgress}</p>
                        </div>
                    </div>
                </div>

                {/* Sağ Kolon: Gelişim Alanları (Zorlanılan Konular) */}
                <div className="md:col-span-2 bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-soft border border-gray-100 dark:border-gray-700">
                    <h2 className="text-xl font-bold flex items-center gap-2 mb-6">
                        <AlertTriangle className="text-orange-500" />
                        Gelişim Odak Alanları
                    </h2>
                    <p className="text-text-muted-light mb-6">
                        Simülasyonlarda yaptığın seçimlere göre, aşağıdaki konularda daha fazla pratik yapman faydalı olabilir.
                    </p>

                    {loading ? (
                        <p>Yükleniyor...</p>
                    ) : struggles.length > 0 ? (
                        <div className="flex flex-col gap-4">
                            {struggles.map((item, index) => (
                                <div key={index} className="flex items-center justify-between p-4 bg-orange-50 dark:bg-orange-900/10 rounded-xl border border-orange-100 dark:border-orange-800/30">
                                    <span className="font-bold text-gray-800 dark:text-gray-200">{item.category}</span>
                                    <span className="px-3 py-1 bg-orange-200 dark:bg-orange-800 text-orange-800 dark:text-orange-200 text-xs font-bold rounded-full">
                                {item.count} kez zorlandın
                            </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-10 text-gray-400 bg-gray-50 dark:bg-gray-900/50 rounded-2xl">
                            Henüz yeterli veri yok. Simülasyonlarda kritik seçimler yaptıkça burası güncellenecek.
                        </div>
                    )}

                    <div className="mt-8 text-center">
                        <Link href="/my-simulations">
                            <button className="bg-primary text-white font-bold py-3 px-6 rounded-xl hover:bg-blue-700 transition-colors">
                                Simülasyonlara Devam Et
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}