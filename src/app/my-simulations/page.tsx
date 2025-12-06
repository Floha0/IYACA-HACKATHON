"use client";

import { useState, useEffect } from 'react';
import MySimulationCard from '@/components/MySimulationCard';
import { Search } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { simulations } from '@/data/simulations'; // Orijinal veri

export default function MySimulationsPage() {
    const { user } = useAuth();
    const [mySims, setMySims] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // YENİ: Arama metni için state
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        if (user) {
            fetch('/api/progress/get', {
                method: 'POST',
                body: JSON.stringify({ userId: user.id })
            })
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        const mergedData = data.data.map((dbItem: any) => {
                            const original = simulations.find(s => s.id === dbItem.simulation_id);
                            if (!original) return null;
                            return {
                                ...original,
                                progress: dbItem.progress,
                                lastPlayed: new Date(dbItem.last_played).toLocaleDateString("tr-TR")
                            };
                        }).filter(Boolean);

                        setMySims(mergedData);
                    }
                    setLoading(false);
                });
        }
    }, [user]);

    // Filtreleme
    // Büyük/küçük harf duyarsız
    const filteredSims = mySims.filter(sim =>
        sim.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sim.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (!user) return <div className="text-center py-20">Lütfen giriş yapın.</div>;

    return (
        <div className="container mx-auto px-4 sm:px-8 py-10">

            <div className="flex flex-col md:flex-row justify-between items-end gap-4 mb-8">
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-text-light">
                        Simülasyonlarım
                    </h1>
                    <p className="text-text-muted-light text-base">
                        Kaldığın yerden devam et ve etkini artırmaya başla.
                    </p>
                </div>
            </div>

            {/* Arama Barı */}
            <div className="flex flex-col md:flex-row gap-4 items-center mb-8 bg-white dark:bg-gray-800 p-2 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="flex-grow w-full md:max-w-md">
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                        </div>
                        {/* YENİ: Input'u state'e bağladık */}
                        <input
                            type="text"
                            className="block w-full pl-10 pr-3 py-2.5 border-none rounded-xl bg-gray-50 dark:bg-gray-900 text-text-light placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                            placeholder="Simülasyonlarda ara..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* İçerik */}
            {loading ? (
                <div className="text-center py-10">Yükleniyor...</div>
            ) : filteredSims.length > 0 ? (
                // YENİ: mySims yerine filteredSims kullanıyoruz
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredSims.map((sim) => (
                        <MySimulationCard
                            key={sim.id}
                            id={sim.id}
                            title={sim.title}
                            description={sim.description}
                            image={sim.image}
                            progress={sim.progress}
                        />
                    ))}
                </div>
            ) : (
                // Arama sonucu boşsa veya hiç kayıt yoksa
                <div className="text-center py-20 text-gray-500">
                    {searchQuery ? (
                        <p>"{searchQuery}" ile ilgili bir sonuç bulunamadı.</p>
                    ) : (
                        <p>Henüz kayıtlı simülasyonun yok. Açık simülasyonlardan birine başla!</p>
                    )}
                </div>
            )}

        </div>
    );
}