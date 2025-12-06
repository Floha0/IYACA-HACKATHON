import Link from "next/link";

export default function Home() {
    return (
        <div className="flex flex-col flex-1 px-4 sm:px-8 md:px-16 lg:px-24 xl:px-40 py-5">
            <div className="flex flex-col w-full max-w-[960px] mx-auto flex-1 justify-center">

                <div className="@container py-10 sm:py-20">
                    <div className="flex min-h-[480px] flex-col gap-6 bg-gradient-to-br from-primary/30 to-secondary/30 rounded-xl items-center justify-center p-8 text-center shadow-sm">

                        <div className="flex flex-col gap-4 max-w-2xl">
                            <h1 className="text-4xl font-black leading-tight tracking-tighter sm:text-5xl text-text-light">
                                Empati Yap, Fark Yarat
                            </h1>
                            <h2 className="text-base font-normal leading-normal text-text-muted-light sm:text-lg">
                                Gönülver.ai, gönüllülerin gerçek dünyaya çıkmadan önce güven ve beceri kazanmalarına yardımcı olacak gerçekçi senaryolar sunar.
                            </h2>
                        </div>

                        <Link href="/simulations">
                            <button className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-12 px-8 bg-primary text-white text-base font-bold shadow-soft hover:brightness-105 transition-all">
                                Simülasyonlara Göz At
                            </button>
                        </Link>

                    </div>
                </div>

            </div>
        </div>
    );
}