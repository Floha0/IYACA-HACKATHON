import Link from 'next/link';
import { Clock, ArrowRight } from 'lucide-react';

interface SimulationCardProps {
    id: number;
    title: string;
    description: string;
    image: string;
    duration: string;
    category: string;
}

export default function SimulationCard({ id, title, description, image, duration, category }: SimulationCardProps) {
    return (
        <div className="group flex flex-col bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-soft hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-700 relative top-0 hover:-top-2">

            {/* Resim Alanı */}
            <div className="relative h-52 w-full overflow-hidden">
                <img
                    src={image}
                    alt={title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                {/* Kategori Etiketi */}
                <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-primary shadow-sm">
                    {category}
                </div>
                {/* Süre Etiketi (Resmin Sol Altında) */}
                <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm text-white px-2 py-1 rounded-lg text-xs font-medium flex items-center gap-1">
                    <Clock size={12} />
                    {duration}
                </div>
            </div>

            {/* İçerik Alanı */}
            <div className="flex flex-col flex-grow p-6">
                <h3 className="text-xl font-bold text-text-light dark:text-text-dark mb-2 leading-tight">
                    {title}
                </h3>

                <p className="text-text-muted-light text-sm line-clamp-2 mb-6 flex-grow leading-relaxed">
                    {description}
                </p>

                {/* Buton Alanı */}
                <Link href={`/play/${id}`} className="mt-auto">
                    <button className="w-full group flex items-center justify-center gap-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold py-3.5 px-4 shadow-sm hover:shadow-md transition-all duration-300 active:scale-95">
                        <span>Simülasyona Başla</span>
                        <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
                    </button>
                </Link>
            </div>
        </div>
    );
}