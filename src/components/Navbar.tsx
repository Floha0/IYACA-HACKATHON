"use client";

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { LogOut, User as UserIcon } from 'lucide-react';

export default function Navbar() {
    const { user, logout } = useAuth();

    return (
        <header className="flex items-center justify-between whitespace-nowrap border-b border-gray-200 dark:border-gray-700 px-6 sm:px-10 py-4 bg-background-light dark:bg-background-dark sticky top-0 z-50">

            {/* Logo Alanı (Aynı) */}
            <Link href="/" className="flex items-center gap-4 text-text-light dark:text-text-dark">
                <div className="text-primary w-8 h-8">
                    <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                        <path d="M24 4C25.7818 14.2173 33.7827 22.2182 44 24C33.7827 25.7818 25.7818 33.7827 24 44C22.2182 33.7827 14.2173 25.7818 4 24C14.2173 22.2182 22.2182 14.2173 24 4Z" fill="currentColor"></path>
                    </svg>
                </div>
                <h2 className="text-xl font-bold tracking-tight">Gönülver.ai</h2>
            </Link>

            {/* Orta Menü */}
            <div className="hidden md:flex flex-1 justify-center gap-8">
                <div className="flex items-center gap-9">
                    <Link href="/simulations" className="text-sm font-medium text-text-muted-light hover:text-primary transition-colors">
                        Tüm Simülasyonlar
                    </Link>
                    {user && (
                        <Link href="/my-simulations" className="text-sm font-medium text-text-muted-light hover:text-primary transition-colors">
                            Simülasyonlarım
                        </Link>
                    )}
                    {/* DÜZELTME 1: href="/about" yapıldı */}
                    <Link href="/about" className="text-sm font-medium text-text-muted-light hover:text-primary transition-colors">
                        Hakkımızda
                    </Link>
                </div>
            </div>

            {/* Sağ Taraf */}
            <div className="flex items-center gap-2">
                {user ? (
                    <div className="flex items-center gap-4">
                        {/* DÜZELTME 2: Profil kısmına tıklanınca /profile'a git */}
                        <Link href="/profile" className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-200 hover:opacity-80 transition-opacity">
                            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                                <UserIcon size={18} />
                            </div>
                            <span className="hidden sm:inline">{user.name}</span>
                        </Link>
                        <button
                            onClick={logout}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            title="Çıkış Yap"
                        >
                            <LogOut size={20} />
                        </button>
                    </div>
                ) : (
                    // GİRİŞ YAPILMAMIŞSA
                    <>
                        <Link href="/login">
                            <button className="flex min-w-[84px] cursor-pointer items-center justify-center rounded-lg h-10 px-4 bg-transparent border border-gray-300 hover:bg-gray-100 text-text-light text-sm font-bold transition-colors dark:border-gray-600 dark:hover:bg-gray-800">
                                Giriş Yap
                            </button>
                        </Link>
                        {/* GÜNCELLENEN KISIM: href direkt /register oldu */}
                        <Link href="/register">
                            <button className="flex min-w-[84px] cursor-pointer items-center justify-center rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold shadow-soft hover:brightness-105 transition-all">
                                Kayıt Ol
                            </button>
                        </Link>
                    </>
                )}
            </div>
        </header>
    );
}