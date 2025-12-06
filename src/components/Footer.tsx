export default function Footer() {
    return (
        <footer className="flex flex-col gap-8 px-5 py-10 text-center border-t border-gray-200 dark:border-gray-700 bg-background-light dark:bg-background-dark mt-auto">
            <div className="flex flex-col items-center justify-center gap-6 sm:flex-row sm:justify-around">
                <a className="text-text-muted-light hover:text-primary transition-colors text-base font-normal min-w-40" href="#">Gizlilik Politikası</a>
                <a className="text-text-muted-light hover:text-primary transition-colors text-base font-normal min-w-40" href="#">Kullanım Şartları</a>
                <a className="text-text-muted-light hover:text-primary transition-colors text-base font-normal min-w-40" href="#">İletişim</a>
            </div>

            <div className="flex flex-wrap justify-center gap-6 text-text-muted-light">
                {/* Sosyal Medya İkonları (Basitlik için SVG'leri korudum) */}
                <a href="#" aria-label="Twitter" className="hover:text-primary transition-colors">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.71v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path></svg>
                </a>
                <a href="#" aria-label="Instagram" className="hover:text-primary transition-colors">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.024.06 1.378.06 3.808s-.012 2.784-.06 3.808c-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.024.048-1.378.06-3.808.06s-2.784-.013-3.808-.06c-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.048-1.024-.06-1.378-.06-3.808s.012-2.784.06-3.808c.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 016.08 2.525c.636-.247 1.363-.416 2.427-.465C9.53 2.013 9.884 2 12.315 2zm-1.163 1.943c-1.044.048-1.684.21-2.228.43a3.001 3.001 0 00-1.14 1.14c-.22.544-.382 1.185-.43 2.228-.048 1.007-.06 1.348-.06 3.659s.012 2.652.06 3.659c.048 1.044.21 1.684.43 2.228a3.001 3.001 0 001.14 1.14c.544.22 1.185.382 2.228.43 1.007.048 1.348.06 3.659.06s2.652-.012 3.659-.06c1.044-.048 1.684-.21 2.228-.43a3.001 3.001 0 001.14-1.14c.22-.544.382-1.185.43-2.228.048-1.007.06-1.348.06-3.659s-.012-2.652-.06-3.659c-.048-1.044-.21-1.684-.43-2.228a3.001 3.001 0 00-1.14-1.14c-.544-.22-1.185-.382-2.228-.43-1.007-.048-1.348-.06-3.659-.06s-2.652.012-3.659.06zM12 6.865a5.135 5.135 0 100 10.27 5.135 5.135 0 000-10.27zm0 1.942a3.193 3.193 0 110 6.386 3.193 3.193 0 010-6.386zm6.406-3.181a1.218 1.218 0 100 2.436 1.218 1.218 0 000-2.436z" clipRule="evenodd"></path></svg>
                </a>
            </div>
            <p className="text-text-muted-light text-base font-normal">© 2025 Gönülver.ai. Tüm hakları saklıdır.</p>
        </footer>
    );
}