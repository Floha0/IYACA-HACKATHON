"use client";

import { useState } from 'react';
import { Wand2, Save, Loader2, Type } from 'lucide-react';

export default function CreateSimulationPage() {
    const [title, setTitle] = useState('');
    const [prompt, setPrompt] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleGenerate = async () => {
        // Hem başlık hem prompt girilmeden işlem yapma
        if (!prompt || !title) return;

        setLoading(true);
        setMessage('');

        try {
            const res = await fetch('/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                // Route.ts'e title ve prompt'u gönderiyoruz
                body: JSON.stringify({ title, prompt }),
            });

            const data = await res.json();

            if (res.ok) {
                setMessage('✅ Başlık ve Prompt kaydedildi, Python scripti çalıştırıldı!');
            } else {
                setMessage(`❌ Hata: ${data.error}`);
            }
        } catch (error) {
            setMessage('❌ Bir bağlantı hatası oluştu.');
        } finally {
            setLoading(false);
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

                    {/* 1. TEXT FIELD: BAŞLIK (Küçük Input) */}
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

                    {/* 2. TEXT FIELD: PROMPT (Büyük Textarea) */}
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

                    {/* BUTON VE MESAJ ALANI */}
                    <div className="flex justify-end pt-2">
                        <button
                            onClick={handleGenerate}
                            disabled={loading || !prompt || !title}
                            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-500/30"
                        >
                            {loading ? (
                                <>
                                    <Loader2 size={20} className="animate-spin" />
                                    İşleniyor...
                                </>
                            ) : (
                                <>
                                    <Save size={20} />
                                    Oluştur ve Kaydet
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