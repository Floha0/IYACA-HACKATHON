"use client";

import { useState, useEffect } from 'react';
import { scenarios as staticScenarios } from '@/data/scenarios';
import { ArrowRight, PlayCircle, Home, ExternalLink, RotateCcw } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function PlaySimulationPage() {
    const { user } = useAuth();
    const params = useParams();
    const rawId = Array.isArray(params.id) ? params.id[0] : params.id;
    const requestedId = parseInt(rawId || "1");

    const [simulation, setSimulation] = useState<any>(null);
    const [currentNodeId, setCurrentNodeId] = useState<string>("");
    const [currentProgress, setCurrentProgress] = useState(0);
    const [loading, setLoading] = useState(true);

    // 1. ADIM: SİMÜLASYON VERİSİNİ YÜKLE
    useEffect(() => {
        const loadSimulationData = async () => {
            if (staticScenarios[requestedId]) {
                setSimulation(staticScenarios[requestedId]);
                setCurrentNodeId(staticScenarios[requestedId].startNodeId);
                setLoading(false);
            } else {
                try {
                    const res = await fetch('/ai/iyaca_frontend_ready.json');
                    if (res.ok) {
                        const aiSim = await res.json();
                        if (aiSim.id === requestedId) {
                            setSimulation(aiSim);
                            setCurrentNodeId(aiSim.startNodeId);
                        } else {
                            console.warn("AI Simülasyon ID uyuşmazlığı, varsayılan açılıyor.");
                            setSimulation(staticScenarios[1]);
                            setCurrentNodeId(staticScenarios[1].startNodeId);
                        }
                    } else {
                        setSimulation(staticScenarios[1]);
                        setCurrentNodeId(staticScenarios[1].startNodeId);
                    }
                } catch (error) {
                    console.error("Simülasyon yüklenemedi:", error);
                    setSimulation(staticScenarios[1]);
                    setCurrentNodeId(staticScenarios[1].startNodeId);
                } finally {
                    setLoading(false);
                }
            }
        };
        loadSimulationData();
    }, [requestedId]);

    // 2. ADIM: İLERLEME DURUMUNU ÇEK
    useEffect(() => {
        if (user && simulation) {
            fetch('/api/progress/get', {
                method: 'POST',
                body: JSON.stringify({ userId: user.id })
            })
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        const mySave = data.data.find((s: any) => s.simulation_id === requestedId);
                        if (mySave && simulation.nodes[mySave.current_node_id]) {
                            setCurrentNodeId(mySave.current_node_id);
                            setCurrentProgress(mySave.progress);
                        }
                    }
                })
                .catch(err => console.error("Kayıt çekme hatası:", err));
        }
    }, [user, requestedId, simulation]);

    if (loading || !simulation || !currentNodeId) {
        return (
            <div className="h-screen flex items-center justify-center bg-black text-white gap-3">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                <span>Senaryo Yükleniyor...</span>
            </div>
        );
    }

    const currentNode = simulation.nodes[currentNodeId];

    const handleNext = (nextId?: string, category?: string) => {
        if (nextId && simulation.nodes[nextId]) {
            const nextNode = simulation.nodes[nextId];
            setCurrentNodeId(nextId);

            let newProgress = 0;
            if (nextNode.type === 'ending') {
                newProgress = 100;
            } else {
                const steps = simulation.totalSteps || 10;
                const increment = 100 / steps;
                newProgress = Math.min(currentProgress + increment, 100);
            }

            setCurrentProgress(newProgress);

            if (user) {
                fetch('/api/progress/save', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        userId: user.id,
                        simulationId: requestedId,
                        currentNodeId: nextId,
                        progress: newProgress
                    })
                });

                if (category) {
                    fetch('/api/struggles/save', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            userId: user.id,
                            simulationId: requestedId,
                            category: category
                        })
                    });
                }
            }
        }
    };

    const handleReset = () => {
        if (confirm("Başa dönmek istediğine emin misin?")) {
            setCurrentNodeId(simulation.startNodeId);
            setCurrentProgress(0);

            if (user) {
                fetch('/api/reset', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        userId: user.id,
                        simulationId: requestedId,
                        startNodeId: simulation.startNodeId
                    })
                });
            }
        }
    };

    return (
        <div className="container mx-auto px-4 mt-6 h-[calc(100vh-100px)] overflow-hidden">
            <style jsx global>{` footer { display: none !important; } `}</style>

            <div className="flex flex-col md:flex-row w-full h-full rounded-2xl overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-700 bg-black">

                {/* SOL TARAF (GÖRSEL SAHNE) */}
                <div
                    className="relative w-full md:w-[65%] h-[50%] md:h-full bg-cover bg-center transition-all duration-700 ease-in-out group"
                    style={{ backgroundImage: `url(${currentNode.image})` }}
                >
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>

                    {/* Ortam Bilgisi */}
                    {currentNode.environment && (
                        <div className="absolute top-6 left-6 bg-black/60 backdrop-blur-md text-white px-4 py-2 rounded-lg border-l-4 border-primary shadow-lg animate-fade-in z-20">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-300 block">Ortam</span>
                            <span className="text-sm font-medium">{currentNode.environment}</span>
                        </div>
                    )}

                    {/* Karakter (Sadece image varsa göster) */}
                    {currentNode.characterImage && (
                        <div className="absolute bottom-0 left-0 md:left-10 h-[60%] md:h-[70%] z-10 transition-all duration-500">
                            <img
                                key={currentNode.characterImage}
                                src={currentNode.characterImage}
                                alt="Character"
                                className="h-full w-auto object-contain drop-shadow-2xl animate-fade-in-up origin-bottom"
                            />
                        </div>
                    )}

                    {/* DÜZELTME: Karakter yokken (else) kutuyu kesin olarak ortalamak için inset-x-0 ve mx-auto kullanıldı */}
                    {currentNode.text && (
                        <div className={`
                            absolute z-30 animate-pop-in
                            ${currentNode.characterImage
                            ? 'bottom-[65%] left-[30%] md:left-[25%] max-w-[60%] md:max-w-[50%] text-left' // Karakter VARSA: Solda konuşma balonu
                            : 'top-[15%] left-0 right-0 mx-auto w-[90%] md:w-[70%] text-center' // Karakter YOKSA: Üstte, tam ortada, kenarlardan boşluklu
                        }
                        `}>
                            <div className="bg-white/95 text-gray-900 p-6 rounded-2xl shadow-2xl border border-gray-100 relative inline-block backdrop-blur-sm">

                                {currentNode.speaker && (
                                    <div className={`text-primary font-bold text-xs uppercase mb-2 tracking-wide opacity-80 ${!currentNode.characterImage && 'justify-center flex'}`}>
                                        {currentNode.speaker}
                                    </div>
                                )}

                                <p className="text-base md:text-xl font-medium leading-relaxed text-gray-800">
                                    &quot;{currentNode.text}&quot;
                                </p>

                                {/* Konuşma baloncuğu ucu SADECE karakter varsa görünsün */}
                                {currentNode.characterImage && (
                                    <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-white/95 transform rotate-[20deg] skew-x-12 rounded-bl-md border-b border-l border-gray-100"></div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Altyazı */}
                    {currentNode.subtitle && (
                        <div className="absolute bottom-6 left-0 right-0 flex justify-center z-40 px-4">
                            <div className="bg-black/80 backdrop-blur-md text-gray-100 px-6 py-3 rounded-xl text-center border-b-2 border-primary w-full max-w-2xl shadow-2xl animate-slide-up">
                                <p className="text-base italic font-light tracking-wide opacity-90">
                                    {currentNode.subtitle}
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* SAĞ TARAF (KONTROL PANELİ) */}
                <div className="w-full md:w-[35%] h-[50%] md:h-full bg-white dark:bg-gray-900 flex flex-col z-20 border-l border-gray-800">
                    <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-gray-800 shrink-0 bg-gray-50 dark:bg-gray-900">
                        <div className="flex items-center gap-2 text-gray-500 font-bold text-xs uppercase tracking-wider">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                            {simulation.title || "Simülasyon"}
                        </div>

                        <div className="flex items-center gap-2">
                            <button onClick={handleReset} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors" title="Başa Sar">
                                <RotateCcw size={20} />
                            </button>
                            <Link href={user ? "/my-simulations" : "/simulations"} className="p-2 text-gray-400 hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
                                <Home size={20} />
                            </Link>
                        </div>
                    </div>

                    <div className="flex-grow flex flex-col items-center justify-center p-8 text-center opacity-40">
                        <PlayCircle size={48} className="mb-4 text-gray-300 dark:text-gray-600" />
                        <p className="text-sm text-gray-400">Kararların hikayeyi şekillendirir.</p>
                    </div>

                    <div className="p-6 bg-gray-50 dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800 shrink-0 shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
                        {currentNode.videoLink && (
                            <button
                                onClick={() => window.open(currentNode.videoLink?.url, '_blank')}
                                className="w-full mb-4 flex items-center justify-between gap-3 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 p-4 transition-all group"
                            >
                                <div className="flex items-center gap-3">
                                    <PlayCircle size={20} className="text-purple-600" />
                                    <div className="text-left">
                                        <span className="block text-xs font-bold uppercase opacity-70">Eğitim Önerisi</span>
                                        <span className="text-sm font-bold">{currentNode.videoLink.label}</span>
                                    </div>
                                </div>
                                <ExternalLink size={18} />
                            </button>
                        )}

                        {currentNode.type === 'dialogue' && (
                            <button
                                onClick={() => handleNext(currentNode.next)}
                                className="w-full group flex items-center justify-between px-6 py-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-lg hover:shadow-blue-500/30 transition-all active:scale-95"
                            >
                                <span className="text-lg">Devam Et</span>
                                <ArrowRight size={24} className="transition-transform duration-300 group-hover:translate-x-1" />
                            </button>
                        )}

                        {currentNode.type === 'choice' && (
                            <div className="flex flex-col gap-3">
                                {currentNode.choices?.map((choice: any, index: number) => (
                                    <button
                                        key={index}
                                        onClick={() => handleNext(choice.next, choice.struggleCategory)}
                                        className={`
                                          w-full text-left p-4 rounded-xl border-2 transition-all font-semibold relative overflow-hidden group
                                          ${choice.style === 'success' ? 'border-green-500/50 bg-green-50 text-green-800' :
                                            choice.style === 'danger' ? 'border-red-500/50 bg-red-50 text-red-800' :
                                                'border-gray-200 hover:border-blue-500 hover:bg-blue-50 text-gray-700'}
                                        `}
                                    >
                                        <div className="flex justify-between items-center">
                                            <span>{choice.label}</span>
                                            <ArrowRight size={18} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}

                        {currentNode.type === 'ending' && (
                            <Link href={user ? "/my-simulations" : "/simulations"}>
                                <button className="w-full bg-gray-900 text-white font-bold py-4 rounded-xl">
                                    Simülasyonu Bitir
                                </button>
                            </Link>
                        )}
                    </div>
                </div>
            </div>

            <style jsx global>{`
                @keyframes fade-in-up {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes pop-in {
                    0% { opacity: 0; transform: scale(0.9); }
                    100% { opacity: 1; transform: scale(1); }
                }
                .animate-fade-in-up { animation: fade-in-up 0.6s ease-out forwards; }
                .animate-pop-in { animation: pop-in 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
            `}</style>
        </div>
    );
}