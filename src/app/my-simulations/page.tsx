"use client";

import { useState, useEffect } from 'react';
import MySimulationCard from '@/components/MySimulationCard';
import { Search } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { simulations as staticSimulations } from '@/data/simulations'; // Statik Veri

export default function MySimulationsPage() {
    const { user } = useAuth();
    const [mySims, setMySims] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        if (user) {
            const loadData = async () => {
                try {
                    // 1. Veritabanından Kullanıcı İlerlemesini Çek
                    const progressRes = await fetch('/api/progress/get', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ userId: user.id })
                    });
                    const progressData = await progressRes.json();

                    // 2. AI Tarafından Üretilen JSON'u Çek (Varsa)
                    let allSourceSimulations = [...staticSimulations]; // Önce statikleri koy

                    try {
                        const genRes = await fetch('/iyaca_frontend_ready.json');
                        if (genRes.ok) {
                            const genData = await genRes.json();
                            // Dizi mi tek obje mi kontrolü
                            if (Array.isArray(genData)) {
                                allSourceSimulations = [...genData, ...allSourceSimulations];
                            } else if (genData.id) {
                                allSourceSimulations = [genData, ...allSourceSimulations];
                            }
                        }
                    } catch (error) {
                        console.log("AI simülasyonu bulunamadı, sadece statik veriler kullanılıyor.");
                    }

                    // 3. İlerleme Verisiyle Simülasyon Verisini Eşleştir (Merge)
                    if (progressData.success) {
                        const mergedData = progressData.data.map((dbItem: any) => {
                            // Hem statik hem AI simülasyonlarının olduğu havuzda ara
                            const original = allSourceSimulations.find((s: any) => s.id === dbItem.simulation_id);

                            if (!original) return null; // Eğer simülasyon silindiyse veya bulunamazsa geç

                            return {
                                ...original,
                                progress: dbItem.progress,
                                lastPlayed: new Date(dbItem.last_played).toLocaleDateString("tr-TR")
                            };
                        }).filter(Boolean); // null olanları temizle

                        setMySims(mergedData);
                    }
                } catch (error) {
                    console.error("Veri yükleme hatası:", error);
                } finally {
                    setLoading(false);
                }
            };

            loadData();
        }
    }, [user]);

    // Filtreleme Mantığı (Aynı)
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

            <div className="flex flex-col md:flex-row gap-4 items-center mb-8 bg-white dark:bg-gray-800 p-2 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="flex-grow w-full md:max-w-md">
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                        </div>
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

            {loading ? (
                <div className="text-center py-10">Yükleniyor...</div>
            ) : filteredSims.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredSims.map((sim) => (
                        <MySimulationCard
                            key={sim.id}
                            id={sim.id}
                            title={sim.title}
                            description={sim.description}
                            image={sim.image || "https://images.unsplash.com/photo-1620712943543-bcc4688e7485"} // Varsayılan resim
                            progress={sim.progress}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 text-gray-500">
                    {searchQuery ? (
                        <p>&quot;{searchQuery}&quot; ile ilgili bir sonuç bulunamadı.</p>
                    ) : (
                        <p>Henüz kayıtlı simülasyonun yok. Açık simülasyonlardan birine başla!</p>
                    )}
                </div>
            )}

        </div>
    );
}