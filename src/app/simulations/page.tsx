"use client";

import { useState, useEffect } from 'react';
import { simulations as staticSimulations } from '@/data/simulations'; // İsmini değiştirdik
import SimulationCard from '@/components/SimulationCard';

export default function SimulationsPage() {
    // State: Statik verileri varsayılan olarak yükle
    const [allSims, setAllSims] = useState<any[]>(staticSimulations);

    // Sayfa açılınca üretilen JSON var mı diye kontrol et
    useEffect(() => {
        fetch('/ai/iyaca_frontend_ready.json')
            .then(res => {
                if (res.ok) return res.json();
                throw new Error('Dosya yok');
            })
            .then(aiSim => {
                // AI simülasyonunu listeye ekle (Varsa)
                // Çakışmayı önlemek için ID kontrolü yapabiliriz
                setAllSims(prev => {
                    const exists = prev.find(s => s.id === aiSim.id);
                    if (exists) return prev;
                    return [aiSim, ...prev]; // En başa ekle
                });
            })
            .catch(err => console.log("AI simülasyonu bulunamadı (Henüz üretilmedi)."));
    }, []);

    return (
        <div className="container mx-auto px-4 sm:px-8 py-10">

            <div className="mb-10 text-center max-w-2xl mx-auto">
                <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-text-light mb-4">
                    Açık Simülasyonlar
                </h1>
                <p className="text-text-muted-light text-lg">
                    Kendini geliştirmek istediğin alanı seç ve hemen deneyimlemeye başla.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {allSims.map((sim) => (
                    <SimulationCard
                        key={sim.id}
                        id={sim.id}
                        title={sim.title}
                        description={sim.description}
                        image={sim.image || "https://images.unsplash.com/photo-1620712943543-bcc4688e7485"} // Varsayılan resim
                        duration={sim.duration || "Bilinmiyor"}
                        category={sim.category || "AI Generated"}
                    />
                ))}
            </div>

        </div>
    );
}