import { simulations } from '@/data/simulations';

const STORAGE_KEY = 'gonulver_my_simulations';
const STRUGGLE_KEY = 'gonulver_struggles';

// TİP TANIMLAMASI
interface StoredSimulation {
    id: number;
    title: string;
    description: string;
    image: string;
    progress: number;
    currentNodeId: string | null;
    lastPlayed: string;
}

// Verileri Getir
export const getStoredSimulations = (): StoredSimulation[] => {
    if (typeof window === 'undefined') return [];

    const stored = localStorage.getItem(STORAGE_KEY);

    if (!stored) {
        // Varsayılan veri yok, boş liste dönüyoruz.
        return [];
    }

    return JSON.parse(stored) as StoredSimulation[];
};

// Belirli bir simülasyonun durumunu getir
export const getSavedSimulationState = (id: number) => {
    const list = getStoredSimulations();
    return list.find((s) => s.id === id);
};

// Simülasyona Kayıt Ol
export const enrollSimulation = (id: number) => {
    const currentList = getStoredSimulations();
    const exists = currentList.find((s) => s.id === id);
    if (exists) return;

    const originalSim = simulations.find(s => s.id === id);
    if (!originalSim) return;

    const newEntry: StoredSimulation = {
        id: originalSim.id,
        title: originalSim.title,
        description: originalSim.description,
        image: originalSim.image,
        progress: 0,
        currentNodeId: null,
        lastPlayed: "Az önce"
    };

    const newList = [newEntry, ...currentList];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newList));
};

// İLERLEMEYİ GÜNCELLE
export const updateSimulationProgress = (id: number, nodeId: string, progressToAdd: number = 5) => {
    const list = getStoredSimulations();
    const index = list.findIndex((s) => s.id === id);

    if (index === -1) return;

    const currentProgress = list[index].progress || 0;
    const newProgress = Math.min(currentProgress + progressToAdd, 100);

    // Veriyi güncelle
    list[index].currentNodeId = nodeId;
    list[index].progress = newProgress;
    list[index].lastPlayed = "Şimdi";

    const updatedItem = list.splice(index, 1)[0];
    list.unshift(updatedItem);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
};

// SIFIRLAMA
export const resetSimulation = (id: number) => {
    if (typeof window === 'undefined') return;

    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return;

    const list: StoredSimulation[] = JSON.parse(stored);
    const index = list.findIndex((s) => s.id === id);

    if (index !== -1) {
        list[index].progress = 0;
        list[index].currentNodeId = null;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    }
};

// ZORLANILAN ALANLARI TAKİP ET
export const trackStruggle = (category: string) => {
    if (typeof window === 'undefined' || !category) return;

    const stored = localStorage.getItem(STRUGGLE_KEY);
    const struggles: Record<string, number> = stored ? JSON.parse(stored) : {};

    if (struggles[category]) {
        struggles[category] += 1;
    } else {
        struggles[category] = 1;
    }

    localStorage.setItem(STRUGGLE_KEY, JSON.stringify(struggles));
};

export const getStruggles = () => {
    if (typeof window === 'undefined') return {};
    const stored = localStorage.getItem(STRUGGLE_KEY);
    return stored ? JSON.parse(stored) : {};
};