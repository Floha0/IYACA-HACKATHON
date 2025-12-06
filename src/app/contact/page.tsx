export default function ContactPage() {
    return (
        <div className="container mx-auto px-4 py-16 max-w-2xl text-center">
            <h1 className="text-3xl font-bold mb-6">İletişim</h1>
            <p className="text-lg mb-8 text-text-muted-light">
                Projeyle ilgili geri bildirimlerinizi, önerilerinizi veya sorularınızı bekliyoruz.
            </p>

            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                <p className="font-bold text-xl mb-2">E-Posta</p>
                <a href="mailto:iletisim@gonulver.ai" className="text-primary text-lg hover:underline">
                    iletisim@gonulver.ai
                </a>
            </div>
        </div>
    );
}