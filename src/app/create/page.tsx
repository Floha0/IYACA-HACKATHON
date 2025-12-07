"use client";

import { useState } from 'react';
import { Wand2, Save, Loader2, Type, FlaskConical, Zap } from 'lucide-react';

export default function CreateSimulationPage() {
    const [title, setTitle] = useState('');
    const [prompt, setPrompt] = useState('');

    // Hangi butonun loading modunda olduğunu anlamak için string tutuyoruz
    // null = yüklenmiyor, 'standard' = hızlı, 'experimental' = deneysel
    const [loadingMode, setLoadingMode] = useState<null | 'standard' | 'experimental'>(null);

    const [message, setMessage] = useState('');

    const handleGenerate = async (mode: 'standard' | 'experimental') => {
        if (!prompt || !title) return;

        setLoadingMode(mode); // Hangi butona basıldıysa onu yükleniyor yap
        setMessage('');

        try {
            const res = await fetch('/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                // Backend'e hangi modda çalışacağını söylüyoruz
                body: JSON.stringify({ title, prompt, mode }),
            });

            const data = await res.json();

            if (res.ok) {
                setMessage(`✅ ${mode === 'experimental' ? 'Tam Simülasyon (Görselli)' : 'Metin Senaryosu'} başarıyla oluşturuldu!`);
            } else {
                setMessage(`❌ Hata: ${data.error}`);
            }
        } catch (error) {
            setMessage('❌ Bir bağlantı hatası oluştu.');
        } finally {
            setLoadingMode(null); // Yükleme bitti
        }
    };

    return (
        <div className="container mx-auto px-4 py-12 max-w-3xl">
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-soft border border-gray-100 dark:border-gray-700">

                <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-purple-100 text-purple-600 rounded-xl">
                        <Wand2 size={24} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-gray-800 dark:text-white">AI Simülasyon Oluşturucu</h1>
                        <p className="text-gray-500 text-sm">Senaryonu tarif et, yapay zeka senin için oluştursun.</p>
                    </div>
                </div>

                <div className="flex flex-col gap-6">

                    {/* 1. TEXT FIELD: BAŞLIK */}
                    <div className="flex flex-col gap-2">
                        <label className="font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2 text-sm">
                            <Type size={16} />
                            Senaryo Başlığı
                        </label>
                        <input
                            type="text"
                            className="w-full h-12 px-4 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-purple-500 outline-none transition-all placeholder:text-gray-400 font-medium"
                            placeholder="Örn: Müşteri Hizmetleri Krizi"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>

                    {/* 2. TEXT FIELD: PROMPT */}
                    <div className="flex flex-col gap-2">
                        <label className="font-bold text-gray-700 dark:text-gray-300 text-sm">
                            Senaryo Detayı
                        </label>
                        <textarea
                            className="w-full h-40 p-4 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-purple-500 outline-none resize-none transition-all placeholder:text-gray-400"
                            placeholder="Örn: Müşteri satın aldığı ürünün bozuk olduğunu iddia ederek bağırıyor. Temsilci sakin kalmalı..."
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                        />
                    </div>

                    {/* BUTONLAR ALANI */}
                    <div className="flex flex-col sm:flex-row justify-end gap-3 pt-2">

                        {/* BUTON 1: HIZLI (STANDARD) */}
                        <button
                            onClick={() => handleGenerate('standard')}
                            disabled={!!loadingMode || !prompt || !title}
                            className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 px-6 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loadingMode === 'standard' ? (
                                <Loader2 size={20} className="animate-spin" />
                            ) : (
                                <Zap size={20} />
                            )}
                            Hızlı Oluştur (Sadece Metin)
                        </button>

                        {/* BUTON 2: DENEYSEL (EXPERIMENTAL) */}
                        <button
                            onClick={() => handleGenerate('experimental')}
                            disabled={!!loadingMode || !prompt || !title}
                            className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-3 px-6 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-500/30"
                        >
                            {loadingMode === 'experimental' ? (
                                <>
                                    <Loader2 size={20} className="animate-spin" />
                                    Pipeline İşleniyor...
                                </>
                            ) : (
                                <>
                                    <FlaskConical size={20} />
                                    Tam Simülasyon (Görselli)
                                    <span className="bg-white/20 text-white text-[10px] py-0.5 px-2 rounded-full ml-1">Beta</span>
                                </>
                            )}
                        </button>
                    </div>

                    {message && (
                        <div className={`p-4 rounded-xl text-sm font-bold text-center animate-in fade-in slide-in-from-bottom-2 ${message.includes('✅') ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-red-100 text-red-700 border border-red-200'}`}>
                            {message}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}