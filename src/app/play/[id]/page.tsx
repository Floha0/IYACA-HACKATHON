"use client";

import { useState, useEffect } from 'react';
import { scenarios } from '@/data/scenarios';
import { ArrowRight, PlayCircle, Home, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function PlaySimulationPage() {
    const params = useParams();
    const rawId = Array.isArray(params.id) ? params.id[0] : params.id;
    const requestedId = parseInt(rawId || "1");
    const simulation = scenarios[requestedId] ? scenarios[requestedId] : scenarios[1];

    const [currentNodeId, setCurrentNodeId] = useState<string>(simulation.startNodeId);

    useEffect(() => {
        setCurrentNodeId(simulation.startNodeId);
    }, [simulation.id]);

    const currentNode = simulation.nodes[currentNodeId];

    const handleNext = (nextId?: string) => {
        if (nextId && simulation.nodes[nextId]) {
            setCurrentNodeId(nextId);
        }
    };

    return (
        <div className="container mx-auto px-4 mt-6 h-[calc(100vh-100px)] overflow-hidden">
            <style jsx global>{` footer { display: none !important; } `}</style>

            {/* ANA KAPSAYICI */}
            <div className="flex flex-col md:flex-row w-full h-full rounded-2xl overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-700 bg-black">

                {/* ========================================================= */}
                {/* SOL TARAF: GÖRSEL ROMAN SAHNESİ (%65 Genişlik)           */}
                {/* ========================================================= */}
                <div
                    className="relative w-full md:w-[65%] h-[50%] md:h-full bg-cover bg-center transition-all duration-700 ease-in-out"
                    style={{ backgroundImage: `url(${currentNode.image})` }}
                >
                    {/* Karartma Katmanı (Yazıların okunması için hafif) */}
                    <div className="absolute inset-0 bg-black/20"></div>

                    {/* 1. ORTAM KUTUCUĞU (Sol Üst) */}
                    {currentNode.environment && (
                        <div className="absolute top-6 left-6 bg-black/70 backdrop-blur-md text-white px-4 py-2 rounded-lg border border-white/20 shadow-lg animate-fade-in z-20">
                            <span className="text-xs font-bold uppercase tracking-widest text-primary/80 block mb-0.5">Ortam</span>
                            <span className="text-sm font-medium">{currentNode.environment}</span>
                        </div>
                    )}

                    {/* 2. KARAKTER GÖRSELİ (Fade In/Out) */}
                    {currentNode.characterImage && (
                        <div className="absolute bottom-0 right-4 md:right-16 h-[85%] z-10">
                            <img
                                key={currentNode.characterImage} // Key değişince animasyon tekrar çalışır
                                src={currentNode.characterImage}
                                alt="Character"
                                className="h-full w-auto object-contain drop-shadow-2xl animate-fade-in-up"
                            />
                        </div>
                    )}

                    {/* 3. KONUŞMA BALONU (Karakter varsa göster) */}
                    {currentNode.characterImage && currentNode.text && (
                        <div className="absolute bottom-1/3 left-4 md:left-12 max-w-[60%] z-30 animate-pop-in">
                            <div className="bg-white/95 text-gray-900 p-6 rounded-2xl rounded-bl-none shadow-2xl border-2 border-gray-100 relative">
                                {/* Konuşan İsmi */}
                                <div className="text-primary font-bold text-sm uppercase mb-2 tracking-wide">
                                    {currentNode.speaker}
                                </div>
                                {/* Metin */}
                                <p className="text-lg md:text-xl font-medium leading-relaxed">
                                    "{currentNode.text}"
                                </p>
                                {/* Baloncuk Kuyruğu */}
                                <div className="absolute -bottom-3 left-0 w-6 h-6 bg-white/95 transform rotate-45 border-b-2 border-r-2 border-gray-100"></div>
                            </div>
                        </div>
                    )}

                    {/* 4. ALTYAZI / SİNEMATİK METİN (En Alt) */}
                    {currentNode.subtitle && (
                        <div className="absolute bottom-8 left-0 right-0 flex justify-center z-40 px-4">
                            <div className="bg-black/80 backdrop-blur-sm text-gray-100 px-8 py-4 rounded-xl text-center border-t border-b border-primary/30 w-full max-w-3xl shadow-2xl animate-slide-up">
                                <p className="text-lg italic font-light tracking-wide">
                                    {currentNode.subtitle}
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* ========================================================= */}
                {/* SAĞ TARAF: KONTROL PANELİ (%35 Genişlik)                 */}
                {/* ========================================================= */}
                <div className="w-full md:w-[35%] h-[50%] md:h-full bg-white dark:bg-gray-900 flex flex-col z-20 border-l border-gray-800">

                    {/* Panel Başlığı */}
                    <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-gray-800 shrink-0 bg-gray-50 dark:bg-gray-900">
                        <div className="flex items-center gap-2 text-gray-500 font-bold text-xs uppercase tracking-wider">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                            Senin Sıran
                        </div>
                        <Link href="/simulations" className="text-gray-400 hover:text-primary transition-colors">
                            <Home size={20} />
                        </Link>
                    </div>

                    {/* Orta Boşluk (Süsleme veya İpucu) */}
                    <div className="flex-grow flex flex-col items-center justify-center p-8 text-center opacity-40">
                        <PlayCircle size={48} className="mb-4 text-gray-300 dark:text-gray-600" />
                        <p className="text-sm text-gray-400">Kararların hikayeyi şekillendirir.</p>
                    </div>

                    {/* ALT KISIM: BUTONLAR & VİDEOLAR */}
                    <div className="p-6 bg-gray-50 dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800 shrink-0 shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">

                        {/* Video Butonu (Varsa) */}
                        {currentNode.videoLink && (
                            <button
                                onClick={() => window.open(currentNode.videoLink?.url, '_blank')}
                                className="w-full mb-4 flex items-center justify-between gap-3 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 p-4 transition-all group"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="bg-purple-200 p-2 rounded-full text-purple-700">
                                        <PlayCircle size={20} />
                                    </div>
                                    <div className="text-left">
                                        <span className="block text-xs font-bold uppercase opacity-70">Eğitim Önerisi</span>
                                        <span className="text-sm font-bold">{currentNode.videoLink.label}</span>
                                    </div>
                                </div>
                                <ExternalLink size={18} />
                            </button>
                        )}

                        {/* DİYALOG İLERLEME (Basit Buton) */}
                        {currentNode.type === 'dialogue' && (
                            <button
                                onClick={() => handleNext(currentNode.next)}
                                className="w-full group flex items-center justify-between px-6 py-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-lg hover:shadow-blue-500/30 transition-all active:scale-95"
                            >
                                <span className="text-lg">Devam Et</span>
                                <ArrowRight size={24} className="transition-transform duration-300 group-hover:translate-x-1" />
                            </button>
                        )}

                        {/* SEÇİM BUTONLARI */}
                        {currentNode.type === 'choice' && (
                            <div className="flex flex-col gap-3">
                                {currentNode.choices?.map((choice, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleNext(choice.next)}
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

                        {/* BİTİŞ BUTONU */}
                        {currentNode.type === 'ending' && (
                            <Link href="/simulations">
                                <button className="w-full bg-gray-900 text-white font-bold py-4 rounded-xl">
                                    Simülasyonu Bitir
                                </button>
                            </Link>
                        )}

                    </div>
                </div>
            </div>

            {/* CSS Animasyonları */}
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