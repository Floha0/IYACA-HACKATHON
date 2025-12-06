import Link from 'next/link';
import { User } from 'lucide-react';

export default function Navbar() {
    return (
        <header className="flex items-center justify-between whitespace-nowrap border-b border-gray-200 dark:border-gray-700 px-6 sm:px-10 py-4 bg-background-light dark:bg-background-dark sticky top-0 z-50">

            {/* Logo Alanı */}
            <Link href="/" className="flex items-center gap-4 text-text-light dark:text-text-dark">
                <div className="text-primary w-8 h-8">
                    <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                        <path d="M24 4C25.7818 14.2173 33.7827 22.2182 44 24C33.7827 25.7818 25.7818 33.7827 24 44C22.2182 33.7827 14.2173 25.7818 4 24C14.2173 22.2182 22.2182 14.2173 24 4Z" fill="currentColor"></path>
                    </svg>
                </div>
                <h2 className="text-xl font-bold tracking-tight">Gönülver.ai</h2>
            </Link>

            {/* Orta Menü (Desktop) */}
            <div className="hidden md:flex flex-1 justify-center gap-8">
                <div className="flex items-center gap-9">
                    {/* Katalog Sayfası */}
                    <Link href="/simulations" className="text-sm font-medium text-text-muted-light hover:text-primary transition-colors">
                        Tüm Simülasyonlar
                    </Link>

                    {/* YENİ EKLENEN: Dashboard Sayfası */}
                    <Link href="/my-simulations" className="text-sm font-medium text-text-muted-light hover:text-primary transition-colors">
                        Simülasyonlarım
                    </Link>

                    <Link href="#" className="text-sm font-medium text-text-muted-light hover:text-primary transition-colors">
                        Hakkımızda
                    </Link>
                </div>
            </div>

            {/* Sağ Taraf: Login / Profil */}
            <div className="flex items-center gap-2">
                <Link href="/login">
                    <button className="flex min-w-[84px] cursor-pointer items-center justify-center rounded-lg h-10 px-4 bg-transparent border border-gray-300 dark:border-gray-600 hover:bg-gray-100 text-text-light text-sm font-bold transition-colors">
                        Giriş Yap
                    </button>
                </Link>

                <Link href="/login">
                    <button className="flex min-w-[84px] cursor-pointer items-center justify-center rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold shadow-soft hover:brightness-105 transition-all">
                        Kayıt Ol
                    </button>
                </Link>
            </div>
        </header>
    );
}