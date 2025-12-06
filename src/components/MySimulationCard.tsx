import Link from 'next/link';
import { ArrowRight, Play } from 'lucide-react';

interface MySimulationCardProps {
    id: number;
    title: string;
    description: string;
    image: string;
    progress: number;
}

export default function MySimulationCard({ id, title, description, image, progress }: MySimulationCardProps) {
    return (
        <div className="flex flex-col bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl shadow-soft hover:shadow-xl transition-all duration-300 overflow-hidden group">

            {/* Resim Alanı */}
            <div className="relative h-40 w-full overflow-hidden">
                <img
                    src={image}
                    alt={title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {/* Play İkonu Overlay */}
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="bg-white/20 backdrop-blur-md p-3 rounded-full text-white">
                        <Play size={24} fill="currentColor" />
                    </div>
                </div>
            </div>

            {/* İçerik */}
            <div className="flex flex-col p-5 gap-4 flex-grow">
                <div className="flex-grow">
                    <h3 className="text-lg font-bold text-text-light dark:text-text-dark tracking-tight mb-2 line-clamp-1">
                        {title}
                    </h3>
                    <p className="text-sm text-text-muted-light line-clamp-2">
                        {description}
                    </p>
                </div>

                {/* Progress Bar */}
                <div className="w-full mt-1">
                    <div className="flex justify-between items-center mb-1.5">
                        <span className="text-xs font-medium text-text-muted-light">Tamamlanan</span>
                        <span className="text-xs font-bold text-primary">%{Math.floor(progress)}</span>
                    </div>
                    <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
                        <div
                            className="bg-primary h-full rounded-full transition-all duration-1000 ease-out"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                </div>

                {/* CANLI BUTON */}
                <Link href={`/play/${id}`} className="mt-2">
                    <button className="w-full group flex items-center justify-center gap-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold py-3 shadow-sm hover:shadow-md transition-all duration-300 active:scale-95">
                        <span>Devam Et</span>
                        <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
                    </button>
                </Link>
            </div>
        </div>
    );
}