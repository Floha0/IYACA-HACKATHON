// src/data/scenarios.ts

export type Choice = {
    label: string;
    next: string;
    style?: 'default' | 'success' | 'danger';
    struggleCategory?: string;
};
export type ScenarioNode = {
    id: string;
    type: 'dialogue' | 'choice' | 'ending';
    speaker: string;     // Konuşan kişinin adı
    text: string;        // Baloncukta çıkacak metin
    image: string;       // ARKA PLAN resmi
    characterImage?: string; // YENİ: Karakterin resmi (PNG - Arkası şeffaf tercihen)
    environment?: string;    // YENİ: Sol üstteki kutucuk (Örn: "Havaalanı - Gün 0")
    subtitle?: string;       // YENİ: Alt yazı (İç ses veya çeviri için)
    next?: string;
    choices?: Choice[];
    videoLink?: {
        label: string;
        url: string;
    };
};

export type Simulation = {
    id: number;
    title: string;
    startNodeId: string;
    totalSteps: number;
    nodes: Record<string, ScenarioNode>;
};

export const scenarios: Record<number, Simulation> = {
    // --- SENARYO 1: AFET LOJİSTİĞİ ---

    4: {
        id: 4,
        title: "Gönüllünün Yolculuğu",
        startNodeId: "sahne-1",
        totalSteps: 28,
        nodes: {
            // --- SAHNE 1: VARIŞ ---
            "sahne-1": {
                id: "sahne-1",
                type: "dialogue",
                speaker: "Ana (Koordinatör)",
                text: "Mehmet? Hoş geldin! Ben Ana. Seni burada görmek çok güzel. Yolculuk nasıl geçti?",
                image: "/scenarios/background_airport.png",
                characterImage: "/characters/Ana_1.png",
                environment: "Havaalanı • Gün 0",
                next: "sahne-1-icses"
            },
            "sahne-1-icses": {
                id: "sahne-1-icses",
                type: "dialogue",
                speaker: "Sen (İç Ses)",
                text: "",
                subtitle: "Buradayım. Artık geri dönüş yok. Dile, kültüre, sorumluluklara… hazır olmalıyım.",
                image: "/scenarios/background_airport.png",
                environment: "Havaalanı Çıkışı",
                next: "sahne-1-tanitim"
            },
            "sahne-1-tanitim": {
                id: "sahne-1-tanitim",
                type: "dialogue",
                speaker: "Ana (Koordinatör)",
                text: "Hoş geldiniz gençler. Bugün oryantasyon gününüz; size hem buranın düzenini hem de sizden beklenenleri anlatacağım.",
                image: "/scenarios/background_village.png",
                characterImage: "/characters/Ana_1.png",
                environment: "Köy Bahçesi",
                next: "sahne-1-tanitim2"
            },
            "sahne-1-tanitim2": {
                id: "sahne-1-tanitim2",
                type: "dialogue",
                speaker: "Ana (Koordinatör)",
                text: "Her gönüllü günde üç farklı çocuk grubuyla ilgilenir: sabah, öğlen ve akşamüstü. Gruplar değiştiği için zamanla tüm çocukları tanırsınız. Çocuklarla zaman geçirmek sadece oyun oynamak değildir; onları gözlemler, iletişim kurar ve güvende hissetmelerine yardımcı olursunuz.",
                image: "/scenarios/background_village.png",
                characterImage: "/characters/Ana_7.png",
                environment: "Köy Bahçesi",
                next: "sahne-1-tanitim3"
            },
            "sahne-1-tanitim3": {
                id: "sahne-1-tanitim3",
                type: "dialogue",
                speaker: "Ana (Koordinatör)",
                text: "Çocuk grupları dışındaki vakitlerinizde bakım ve onarım işleri var. Seranın düzeni, su yollarının kontrolü, yiyecek hazırlığı… Kulağa sıradan gelebilir ama köyün nefes almasını sağlayan işler bunlardır. Bu yüzden küçük iş yoktur; doğru yapılan iş vardır.",
                image: "/scenarios/background_village.png",
                characterImage: "/characters/Ana_7.png",
                environment: "Köy Bahçesi",
                next: "sahne-2"
            },


            // --- SAHNE 2: ORYANTASYON ---
            "sahne-2": {
                id: "sahne-2",
                type: "dialogue",
                speaker: "Ana (Koordinatör)",
                text: "Burada iki şey gönüllüleri en çok zorlar: Dil ve Zaman. Son IYACA Faaliyet raporu net bir şekilde gözler önüne seriyor bunu. Seninle bu konuları işlemeyi ve seni en iyi şekilde hazırlamayı çok istiyorum.",
                image: "/scenarios/background_meeting_room.jpg",
                characterImage: "/characters/Ana_1.png",
                environment: "Oryantasyon Salonu • Gün 1",
                next: "sahne-2-video",
            },
            "sahne-2-video": {
                id: "sahne-2-video",
                type: "dialogue",
                speaker: "Ana (Koordinatör)",
                text: "Bu sürece başlamadan önce şu kısa videoya göz atman faydalı olabilir.",
                image: "/scenarios/background_meeting_room.jpg",
                characterImage: "/characters/Ana_3.png",
                environment: "Oryantasyon Salonu",
                next: "sahne-3",
                videoLink: {
                    label: "10 Essential Tips to Make the Most of Your Volunteer Abroad Experience",
                    url: "https://youtu.be/ej0fBZb8XtA?si=etT_0edLS0kJPi2L"
                }
            },

            // --- SAHNE 3: MENTOR TAKTİKLERİ ---
            "sahne-3": {
                id: "sahne-3",
                type: "dialogue",
                speaker: "Ana (Koordinator)",
                text: "Gönüllülükte üç hatayı herkes yapar: Zamanı yanlış kullanmak, dil konusunda kendini suçlamak, sınır koymayı bilmemek. Bunları tek başına çözmek zorunda değilsin.",
                image: "/scenarios/background_class.png",
                characterImage: "/characters/Ana_5.png",
                environment: "Mentor Ofisi • Gün 2",
                next: "sahne-3-video1"
            },
            "sahne-3-video1": {
                id: "sahne-3-video1",
                type: "dialogue",
                speaker: "Ana (Koordinatör)",
                text: "Zaman yönetimi için şu kaynağı inceleyebilirsin.",
                image: "/scenarios/background_class.png",
                environment: "Eğitim Kaynakları",
                characterImage: "/characters/Ana_3.png",
                next: "sahne-3-video2",
                videoLink: {
                    label: "How I Manage My Time - 10 Time Management Tips",
                    url: "https://youtu.be/iONDebHX9qk?si=gaXMIdPvQ4dWQRZe"
                }
            },
            "sahne-3-video2": {
                id: "sahne-3-video2",
                type: "dialogue",
                speaker: "Ana (Koordinatör)",
                text: "Kültürel hassasiyet konusunda ise şu video önemli.",
                image: "/scenarios/background_class.png",
                characterImage: "/characters/Ana_7.png",
                environment: "Eğitim Kaynakları",
                next: "sahne-4",
                videoLink: {
                    label: "Cultural Diversity Training for Volunteers",
                    url: "https://youtu.be/5-4-mVGhV2M?si=zhdy9fdXQHZymu42"
                }
            },

            // --- SAHNE 4: PROJENİN MANTIĞI ---
            "sahne-4": {
                id: "sahne-4",
                type: "dialogue",
                speaker: "Ana (Koordinatör)",
                text: "Burada yaptığın her küçük şey altı ay sonra yüzlerce kişiye dokunacak. Ama bunu süreçte fark etmeyebilirsin. Sık sık ‘Boşa mı yapıyorum?’ hissi olur. Bu normal.",
                image: "/scenarios/background_village.png",
                characterImage: "/characters/Ana_3.png",
                environment: "Kurum Bahçesi • Gün 3",
                subtitle: "(Gönüllülerin %63’ü etkisini süreç boyunca göremez. Simülasyon sonunda kelebek etkisini göstereceğiz.)",
                next: "sahne-5"
            },

            // --- SAHNE 5: ÖZ DEĞERLENDİRME ---
            "sahne-5": {
                id: "sahne-5",
                type: "dialogue",
                speaker: "Ana (Koordinator)",
                text: "Şimdi küçük bir öz-değerlendirme yapıyoruz. Bu sadece senin için. Dil? Zaman? Psikolojik iyi oluş? Kendine karşı dürüst ol. (Zihninde 1-10 arası puanla.)",
                image: "/scenarios/background_class.png",
                characterImage: "/characters/Ana_1.png",
                environment: "Haftalık Toplantı • Gün 7",
                next: "sahne-6"
            },

            // ============================================
            // KRİTİK SEÇİMLER
            // ============================================

            // --- SAHNE 6: EKİP İÇİ YANLIŞ ANLAŞILMA ---
            "sahne-6": {
                id: "sahne-6",
                type: "choice",
                speaker: "Elena (Gönüllü)",
                text: "I felt like you were not listening yesterday. I tried to explain the activity and you walked away.(Dün beni dinlemediğini hissettim. Aktiviteyi anlatmaya çalıştım ama sen uzaklaştın.)",
                subtitle: "(Şok oldun, sadece malzeme almaya gitmiştin.)",
                image: "/scenarios/background_class.png",
                characterImage: "/characters/Elena_3.png",
                environment: "Toplantı Odası • Gün 12",
                choices: [
                    // YENİ: struggleCategory eklendi
                    { label: "A) Hemen savunmaya geç", next: "sahne-6-A", struggleCategory: "Kültürel İletişim" },
                    { label: "B) Dili kullanmakta zorluk çektiğini belirt , kısaca özür dile", next: "sahne-6-B" },
                    { label: "C) Sessiz kal", next: "sahne-6-C", struggleCategory: "Özgüven Eksikliği" }
                ]
            },
            "sahne-6-A": {
                id: "sahne-6-A",
                type: "dialogue",
                speaker: "Ana (Koordinator)",
                text: "İlk tepkin savunma olduğunda güven duvarı büyür. Kültürler arası iletişimde niyet değil, algı etkilidir. Bu seçenek kısa vadede rahatlatır ama uzun vadede ekibi senden uzaklaştırır.",
                image: "/scenarios/background_class.png",
                characterImage: "/characters/Ana_1.png",
                next: "sahne-7"
            },
            "sahne-6-B": {
                id: "sahne-6-B",
                type: "dialogue",
                speaker: "Ana (Koordinator)",
                text: "Harika bir adım. Sorumluluk alman seni zayıf yapmaz; ilişkiyi güçlü yapar. Algıyı düzeltir, ekip seni güvenilir görür. Burada büyüme başlar.",
                image: "/scenarios/background_class.png",
                characterImage: "/characters/Ana_1.png",
                next: "sahne-7"
            },
            "sahne-6-C": {
                id: "sahne-6-C",
                type: "dialogue",
                speaker: "Ana (Koordinator)",
                text: "Pasif uyum kısa süre idare eder ama içeride birikir. Bir noktada patlar. Bunu kendine yapma.",
                image: "/scenarios/background_class.png",
                characterImage: "/characters/Ana_1.png",
                next: "sahne-7"
            },

            // --- SAHNE 7: MİSCOMMUNICATION 101 ---
            "sahne-7": {
                id: "sahne-7",
                type: "dialogue",
                speaker: "Ana (Koordinator)",
                text: "İyi gönüllüler iyi konuşanlar değil, iyi açıklayanlardır. Şu videoya bir bakmanı istiyorum:",
                image: "/scenarios/background_class.png",
                characterImage: "/characters/Ana_6.png",
                environment: "Ofis • İletişim Eğitimi",
                next: "sahne-8",
                videoLink: {
                    label: "Secrets of cross-cultural communication",
                    url: "https://youtu.be/kujUs_6qeUI?si=fb2oPubOqDbr0xrB"
                }
            },

            // --- SAHNE 8: SINIR KOYMA KRİZİ ---
            "sahne-8": {
                id: "sahne-8",
                type: "choice",
                speaker: "Ana (Koordinator)",
                text: "İlk ayının sonuna gelmek üzeresin.Yarın 3 yerine 5 grupla ilgilenmen isteniyor.Senin için sorun olur mu ?",
                image: "/scenarios/background_meeting_room.jpg",
                characterImage: "/characters/Ana_1.png",
                subtitle: "(Ama sen içten içe çok yorgunsun , 5 grubu kaldırabileceğinden şüphelisin)",
                environment: "Etkinlik Odası • Gün 25",
                choices: [
                    { label: "A) 'Tamam yaparım' de", next: "sahne-8-A", struggleCategory: "Sınır Koyma / Hayır Diyebilme" },
                    { label: "B) Kibarca sınır koy", next: "sahne-8-B" },
                    { label: "C) Direkt reddet", next: "sahne-8-C",  struggleCategory: "Kültürel İletişim" }
                ]
            },
            "sahne-8-A": { id: "sahne-8-A", type: "dialogue", speaker: "Ana (Koordinator)", text: "Kendine koymadığın sınır, seni zamanla yorar. En tehlikeli davranış budur.", characterImage: "/characters/Ana_7.png", image: "/scenarios/background_meeting_room.jpg", next: "sahne-9" },
            "sahne-8-B": { id: "sahne-8-B", type: "dialogue", speaker: "Ana (Koordinator)", text: "Bu olgunluk göstergesidir. Gönüllülük kölelik değildir. Sınır koyabilen gönüllü uzun süre dayanır.", characterImage: "/characters/Ana_7.png", image: "/scenarios/background_meeting_room.jpg", next: "sahne-9" },
            "sahne-8-C": { id: "sahne-8-C", type: "dialogue", speaker: "Ana (Koordinator)", text: "Haklı olsan bile sertlik yanlış okunur. Kültürel uyum bozulur.", characterImage: "/characters/Ana_7.png", image: "/scenarios/background_meeting_room.jpg", next: "sahne-9" },

            // --- SAHNE 9: PSİKOLOJİK DÜŞÜŞ ---
            "sahne-9": {
                id: "sahne-9",
                type: "choice",
                speaker: "Sen (İç Ses)",
                text: "",
                subtitle: "(Odan dağınık. Yalnız hissediyorsun. Ana mesaj attı: 'Yarın yoğun bir atölye var, hazır mısın?')",
                image: "/scenarios/background_dirty_room.png",
                environment: "Yalnız Oda • Gün 40",
                choices: [
                    { label: "A) Yalnızlığı bastırıp çalışmaya gömül", next: "sahne-9-A",  struggleCategory: "Duygusal Dayanıklılık" },
                    { label: "B) Mentora mesaj atıp yardım iste", next: "sahne-9-B" },
                    { label: "C) Bir arkadaşına 'İyi hissetmiyorum' yaz", next: "sahne-9-C" }
                ]
            },
            "sahne-9-A": { id: "sahne-9-A", type: "dialogue", speaker: "Mentor Analizi", text: "Duyguları bastırmak çalışmayı yüceltmez, sadece çatlatır.", image: "/scenarios/background_dirty_room.png", characterImage: "/characters/Ana_7.png", next: "sahne-10" },
            "sahne-9-B": { id: "sahne-9-B", type: "dialogue", speaker: "Mentor Analizi", text: "Bu profesyonel bir destek adımıdır. En sağlıklı davranış budur.", image: "/scenarios/background_dirty_room.png",characterImage: "/characters/Ana_7.png" ,  next: "sahne-10" },
            "sahne-9-C": { id: "sahne-9-C", type: "dialogue", speaker: "Mentor Analizi", text: "İyi bir adım ama profesyonel destekle birleşirse daha güçlü olur.", image: "/scenarios/background_dirty_room.png",characterImage: "/characters/Ana_7.png" , next: "sahne-10" },

            // --- SAHNE 10: ENERJİ YÖNETİMİ ---
            "sahne-10": {
                id: "sahne-10",
                type: "dialogue",
                speaker: "Ana (Koordinatör)",
                text: "Enerji yönetimi yapamayan gönüllü, en iyi niyetli bile olsa hızlı tükenir.",
                image: "/scenarios/background_class.png",
                characterImage: "/characters/Ana_1.png",
                environment: "Ofis • Enerji Eğitimi",
                next: "sahne-11",
                videoLink: {
                    label: "The Power of Energy Management Over Time Management | Tony Schwartz, Craig Groeschel & Chris Bailey",
                    url: "https://youtu.be/7PJepk6hnCg?si=FaBhXIR_Afv5GGq7"
                }
            },

            // --- SAHNE 11: KÜLTÜREL ÇATIŞMA ---
            "sahne-11": {
                id: "sahne-11",
                type: "choice",
                speaker: "Elena (Gönüllü)",
                text: "Mehmet, are you always this serious?(Mehmet, her zaman bu kadar ciddi misin?)",
                subtitle: "(Gülüyorlar, ama sen rahatsız oldun.)",
                image: "/scenarios/background_class.png",
                characterImage: "/characters/Elena_3.png",
                environment: "Grup Toplantısı • Gün 55",
                choices: [
                    { label: "A) İçinden kırılıp sessizleş", next: "sahne-11-A" },
                    { label: "B) Duygunu yumuşakça ifade et ('It felt harsh')", next: "sahne-11-B" },
                    { label: "C) 'Sorun sende' tarzı çıkış ('You shouldn't joke')", next: "sahne-11-C" }
                ]
            },
            "sahne-11-A": { id: "sahne-11-A", type: "dialogue", speaker: "Ana (Koordinator)", text: "Duyguları saklamak çatışmayı dondurur; yok etmez.", characterImage: "/characters/Ana_2.png", image: "/scenarios/background_class.png", next: "sahne-12" },
            "sahne-11-B": { id: "sahne-11-B", type: "dialogue", speaker: "Ana (Koordinator)", text: "Bu mükemmel bir kültürel köprü kurma davranışıdır.", characterImage: "/characters/Ana_2.png", image: "/scenarios/background_class.png", next: "sahne-12" },
            "sahne-11-C": { id: "sahne-11-C", type: "dialogue", speaker: "Ana (Koordinator)", text: "Kültürel çatışma büyür, ekip uyumu zarar görür.", characterImage: "/characters/Ana_2.png", image: "/scenarios/background_class.png", next: "sahne-12" },

            // --- SAHNE 12: SÜRDÜRÜLEBİLİRLİK ---
            "sahne-12": {
                id: "sahne-12",
                type: "choice",
                speaker: "Ana (Koordinator)",
                text: "Son 2 haftadır yüzünde yorgunluk görüyorum. Devam etmeyi düşünüyor musun?",
                image: "/scenarios/background_office.png",
                characterImage: "/characters/Ana_6.png",
                environment: "Mentor Ofisi • Gün 70",
                choices: [
                    { label: "A) 'Bırakmak istiyorum.'", next: "sahne-12-A" },
                    { label: "B) 'Devam etmek istiyorum ama yardım lazım.'", next: "sahne-12-B" },
                    { label: "C) 'Zor ama tamamlayacağım.'", next: "sahne-12-C" }
                ]
            },
            "sahne-12-A": { id: "sahne-12-A", type: "dialogue", speaker: "Mentor Analizi", text: "Kısa vadede rahatlık, uzun vadede pişmanlık getirebilir.", image: "/scenarios/background_office.png", characterImage: "/characters/Ana_7.png", next: "sahne-13" },
            "sahne-12-B": { id: "sahne-12-B", type: "dialogue", speaker: "Mentor Analizi", text: "En sağlıklı yaklaşım. Yardım istemek güçlülüktür.", image: "/scenarios/background_office.png", characterImage: "/characters/Ana_7.png", next: "sahne-13" },
            "sahne-12-C": { id: "sahne-12-C", type: "dialogue", speaker: "Mentor Analizi", text: "Kararlı, ama destek almazsan süreç çok yorucu olabilir.", image: "/scenarios/background_office.png",  characterImage: "/characters/Ana_7.png", next: "sahne-13" },

            // --- SAHNE 13: SONUÇ ---
            "sahne-13": {
                id: "sahne-13",
                type: "dialogue",
                speaker: "Ana (Koordinatör)",
                text: "Mehmet… ilk günkü halinle bugünkü halin arasında dağlar var. Artık ekip sana güveniyor, çocuklar seni arıyor, program seni örnek gösteriyor.",
                image: "/scenarios/background_class.png",
                characterImage: "/characters/Ana_3.png",
                environment: "Kapanış Toplantısı • Gün 150",
                subtitle: "(Geliştirilen özellikler : Empati , Psikoloji Yönetimi , Zaman Yönetimi , Enerji Yönetimi...)",
                next: "sahne-14"
            },

            // --- SAHNE 14: KELEBEK ETKİSİ ---
            "sahne-14": {
                id: "sahne-14",
                type: "dialogue",
                speaker: "Simülasyon Özeti",
                text: "Bir drama atölyesinde sakinleştirdiğin o küçük çocuk… iki yıl sonra kendi mahallesinde gönüllü oldu. Sen bilmesen bile — o gün aldığın kararlardan biri bugün onlarca kişiye umut oldu.",
                image: "/scenarios/background_kids.png",
                environment: "Gelecekten Bir Görüntü",
                subtitle: "(Köyde artık çocuklar çok daha mutlu ! Senden de birçok şey öğrendiler. Ayrıca çocuklar gelecekte senin gibi bir gönüllü olarak diğer insanlara yardım edeceklerini söyledir.Artık bir rol modelsin" ,
                next: "sahne-15"
            },

            // --- SAHNE 15: KAPANIŞ ---
            "sahne-15": {
                id: "sahne-15",
                type: "ending",
                speaker: "Ana (Kapanış)",
                text: "Gönüllülük büyük hedeflerle değil, küçük ama bilinçli seçimlerle büyür. Sen bugün o seçimleri deneyimledin. Hazırsın.",
                image: "/scenarios/background_kids.png",
                characterImage: "/characters/Ana_3.png",
                next: ""
            }
        }
    }
};