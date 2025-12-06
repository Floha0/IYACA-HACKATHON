import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="flex flex-col gap-8 px-5 py-10 text-center border-t border-gray-200 dark:border-gray-700 bg-background-light dark:bg-background-dark mt-auto">
            <div className="flex flex-col items-center justify-center gap-6 sm:flex-row sm:justify-around">
                <Link href="/privacy" className="text-text-muted-light hover:text-primary transition-colors text-base font-normal min-w-40">
                    Gizlilik Politikası
                </Link>
                <Link href="/terms" className="text-text-muted-light hover:text-primary transition-colors text-base font-normal min-w-40">
                    Kullanım Şartları
                </Link>
                <Link href="/contact" className="text-text-muted-light hover:text-primary transition-colors text-base font-normal min-w-40">
                    İletişim
                </Link>
            </div>

            {/* Sosyal medya ikonları silindi, sadece copyright kaldı */}
            <p className="text-text-muted-light text-base font-normal">© 2025 Gönülver.ai. Tüm hakları saklıdır.</p>
        </footer>
    );
}