import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

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
        {/* Üst Menü */}
        <Navbar />

        {/* Sayfa İçerikleri (Buraya Home, Simulations vs. gelecek) */}
        <main className="flex-grow flex flex-col">
            {children}
        </main>

        {/* Alt Bilgi */}
        <Footer />
        </body>
        </html>
    );
}