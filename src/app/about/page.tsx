import Link from "next/link";

export default function AboutPage() {
    return (
        <div className="container mx-auto px-4 py-16 max-w-4xl text-center">
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-10 shadow-soft border border-gray-100 dark:border-gray-700">
                <h1 className="text-4xl font-black text-primary mb-6">Biz Kimiz?</h1>

                <p className="text-lg text-text-muted-light leading-relaxed mb-8">
                    Gönülver.ai, gönüllülük yolculuğuna çıkmak isteyen gençlerin, sahaya inmeden önce <span className="text-primary font-bold">empati, kriz yönetimi ve kültürel uyum</span> becerilerini geliştirmeleri için tasarlanmış yapay zeka destekli bir simülasyon platformudur.
                </p>

                <div className="grid md:grid-cols-3 gap-6 mb-10">
                    <div className="p-6 bg-blue-50 dark:bg-blue-900/20 rounded-2xl">
                        <div className="text-3xl mb-2">🌱</div>
                        <h3 className="font-bold text-gray-800 dark:text-gray-200">Deneyimle</h3>
                        <p className="text-sm text-gray-500">Gerçekçi senaryolarla risk almadan öğren.</p>
                    </div>
                    <div className="p-6 bg-green-50 dark:bg-green-900/20 rounded-2xl">
                        <div className="text-3xl mb-2">🤝</div>
                        <h3 className="font-bold text-gray-800 dark:text-gray-200">Empati Kur</h3>
                        <p className="text-sm text-gray-500">Farklı kültürleri ve duyguları anla.</p>
                    </div>
                    <div className="p-6 bg-purple-50 dark:bg-purple-900/20 rounded-2xl">
                        <div className="text-3xl mb-2">🦋</div>
                        <h3 className="font-bold text-gray-800 dark:text-gray-200">Fark Yarat</h3>
                        <p className="text-sm text-gray-500">Küçük dokunuşların kelebek etkisini gör.</p>
                    </div>
                </div>

                {/* DÜZELTİLEN KISIM: Tırnak işaretleri &quot; yapıldı */}
                <p className="text-text-light dark:text-text-dark font-medium mb-8">
                    &quot;Dünyayı değiştirmek için önce kendini hazırla.&quot;
                </p>

                <Link href="/simulations">
                    <button className="bg-primary text-white font-bold py-3 px-8 rounded-xl hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/30">
                        Yolculuğa Başla
                    </button>
                </Link>
            </div>
        </div>
    );
}