import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/context/AuthContext"; // YENİ: Context'i import ettik

const manrope = Manrope({
    subsets: ["latin"],
    variable: "--font-manrope",
});

export const metadata: Metadata = {
    title: "Gönülver.ai",
    description: "Gönüllü Simülasyon Platformu",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="tr" className="light">
        <body className={`${manrope.variable} font-display bg-background-light text-text-light antialiased min-h-screen flex flex-col`}>

        {/* AuthProvider tüm uygulamayı sarmalar.
                    Böylece Navbar'da, Login sayfasında veya herhangi bir yerde
                    "kullanıcı giriş yapmış mı?" bilgisini okuyabiliriz.
                */}
        <AuthProvider>

            {/* Üst Menü */}
            <Navbar />

            {/* Sayfa İçerikleri */}
            <main className="flex-grow flex flex-col">
                {children}
            </main>

            {/* Alt Bilgi */}
            <Footer />

        </AuthProvider>
        </body>
        </html>
    );
}