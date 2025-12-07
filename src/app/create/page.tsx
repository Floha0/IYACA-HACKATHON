"use client";

import { useState } from 'react';
import { Wand2, Save, Loader2 } from 'lucide-react';

export default function CreateSimulationPage() {
    const [prompt, setPrompt] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleGenerate = async () => {
        if (!prompt) return;
        setLoading(true);
        setMessage('');

        try {
            const res = await fetch('/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt }),
            });

            const data = await res.json();

            if (res.ok) {
                setMessage('✅ Prompt kaydedildi ve Python scripti çalıştırıldı!');
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
                        <p className="text-text-muted-light text-sm">Senaryonu tarif et, yapay zeka senin için oluştursun.</p>
                    </div>
                </div>

                <div className="flex flex-col gap-4">
                    <label className="font-bold text-gray-700 dark:text-gray-300">Senaryo Promptu</label>
                    <textarea
                        className="w-full h-40 p-4 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-purple-500 outline-none resize-none transition-all"
                        placeholder="Örn: Bir hastane acil servisinde hasta yakınıyla iletişim krizi simülasyonu oluştur. Hasta yakını çok gergin..."
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                    />

                    <div className="flex justify-end">
                        <button
                            onClick={handleGenerate}
                            disabled={loading || !prompt}
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
                        <div className={`p-4 rounded-xl text-sm font-bold text-center ${message.includes('✅') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {message}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}