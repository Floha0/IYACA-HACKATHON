"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface User {
    id: number;
    name: string;
    email: string;
}

interface AuthContextType {
    user: User | null;
    login: (userData: User) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType>({ user: null, login: () => {}, logout: () => {} });

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const router = useRouter();

    // Sayfa yenilenince localStorage'dan kullanıcıyı geri getir
    useEffect(() => {
        const storedUser = localStorage.getItem('gonulver_user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const login = (userData: User) => {
        setUser(userData);
        localStorage.setItem('gonulver_user', JSON.stringify(userData));
        router.push('/'); // Giriş yapınca ana sayfaya at
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('gonulver_user');
        localStorage.removeItem('gonulver_my_simulations'); // İlerlemeyi de temizle (Opsiyonel)
        router.push('/login');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);