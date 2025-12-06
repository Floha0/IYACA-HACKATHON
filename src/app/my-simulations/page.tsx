import { mySimulations } from '@/data/mySimulations';
import MySimulationCard from '@/components/MySimulationCard';
import { Search, SlidersHorizontal, LayoutGrid, List } from 'lucide-react';

export default function MySimulationsPage() {
    return (
        <div className="container mx-auto px-4 sm:px-8 py-10">

            {/* Başlık Kısmı */}
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

            {/* Arama ve Filtre Barı */}
            <div className="flex flex-col md:flex-row gap-4 items-center mb-8 bg-white dark:bg-gray-800 p-2 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">

                {/* Arama Kutusu */}
                <div className="flex-grow w-full md:max-w-md">
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                        </div>
                        <input
                            type="text"
                            className="block w-full pl-10 pr-3 py-2.5 border-none rounded-xl bg-gray-50 dark:bg-gray-900 text-text-light placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                            placeholder="Simülasyonlarda ara..."
                        />
                    </div>
                </div>

                {/* Filtre Butonları (Görsel Amaçlı) */}
                <div className="flex-grow w-full md:w-auto overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                    <div className="flex gap-2">
                        <button className="flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 rounded-lg text-sm font-medium text-text-light transition-colors whitespace-nowrap">
                            <span>Son Oynanan</span>
                            <SlidersHorizontal size={14} />
                        </button>
                        <button className="px-4 py-2 bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 rounded-lg text-sm font-medium text-text-light transition-colors whitespace-nowrap">
                            İlerleme Durumu
                        </button>
                        <button className="px-4 py-2 bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 rounded-lg text-sm font-medium text-text-light transition-colors whitespace-nowrap">
                            Kategori
                        </button>
                    </div>
                </div>

                {/* Görünüm Değiştirme (Süs) */}
                <div className="hidden sm:flex gap-1 border-l border-gray-200 dark:border-gray-700 pl-4">
                    <button className="p-2 rounded-lg bg-primary/10 text-primary">
                        <LayoutGrid size={20} />
                    </button>
                    <button className="p-2 rounded-lg text-gray-400 hover:bg-gray-100">
                        <List size={20} />
                    </button>
                </div>
            </div>

            {/* Grid Yapısı */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mySimulations.map((sim) => (
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

        </div>
    );
}