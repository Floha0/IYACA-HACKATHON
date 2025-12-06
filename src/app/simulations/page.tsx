import { simulations } from '@/data/simulations';
import SimulationCard from '@/components/SimulationCard';

export default function SimulationsPage() {
    return (
        <div className="container mx-auto px-4 sm:px-8 py-10">

            {/* Sayfa Başlığı */}
            <div className="mb-10 text-center max-w-2xl mx-auto">
                <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-text-light mb-4">
                    Açık Simülasyonlar
                </h1>
                <p className="text-text-muted-light text-lg">
                    Kendini geliştirmek istediğin alanı seç ve hemen deneyimlemeye başla.
                </p>
            </div>

            {/* Grid Yapısı (Responsive) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {simulations.map((sim) => (
                    <SimulationCard
                        key={sim.id}
                        id={sim.id}
                        title={sim.title}
                        description={sim.description}
                        image={sim.image}
                        duration={sim.duration}
                        category={sim.category}
                    />
                ))}
            </div>

        </div>
    );
}