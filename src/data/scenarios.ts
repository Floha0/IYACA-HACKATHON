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
    nodes: Record<string, ScenarioNode>;
};

export const scenarios: Record<number, Simulation> = {
    // --- SENARYO 1: AFET LOJİSTİĞİ ---
    1: {
        id: 1,
        title: "Afet Lojistik Yönetimi",
        startNodeId: "giris-1",
        nodes: {
            "giris-1": {
                id: "giris-1",
                type: "dialogue",
                speaker: "Ana (Koordinatör)",
                text: "Mehmet? Hoş geldin! Ben Ana. Depoda büyük bir yoğunluk var, seni gördüğüme sevindim.",
                image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=1000",
                next: "karar-ani"
            },
            "karar-ani": {
                id: "karar-ani",
                type: "choice",
                speaker: "Sistem",
                text: "Tır geldi. Önce gıdaları mı indirelim, giysileri mi tasnif edelim?",
                image: "https://images.unsplash.com/photo-1606857521015-7f9fcf423740?auto=format&fit=crop&q=80&w=1000",
                choices: [
                    { label: "Gıdaları İndir", next: "sonuc-iyi", style: "success" },
                    { label: "Giysileri Ayır", next: "sonuc-orta", style: "default" }
                ]
            },
            "sonuc-iyi": {
                id: "sonuc-iyi",
                type: "ending",
                speaker: "Ana",
                text: "Harika karar! Aç bekleyen ailelere hemen yemek ulaştı.",
                image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=1000",
                next: ""
            },
            "sonuc-orta": {
                id: "sonuc-orta",
                type: "ending",
                speaker: "Ana",
                text: "Depo düzenli oldu ama insanlar yemek beklerken biraz zaman kaybettik.",
                image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=1000",
                next: ""
            }
        }
    },

    // --- SENARYO 2: YAŞLI BAKIMI ---
    2: {
        id: 2,
        title: "Yaşlılarla İletişim",
        startNodeId: "sahne-1",
        nodes: {
            "sahne-1": {
                id: "sahne-1",
                type: "dialogue",
                speaker: "Hemşire",
                text: "Ahmet Bey bugün ilacını içmiyor. Onunla konuşmayı dener misin?",
                image: "https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?auto=format&fit=crop&q=80&w=1000",
                next: "sahne-2"
            },
            "sahne-2": {
                id: "sahne-2",
                type: "choice",
                speaker: "Sistem",
                text: "Ahmet Bey'in odasındasın. Ne yapacaksın?",
                image: "https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?auto=format&fit=crop&q=80&w=1000",
                choices: [
                    { label: "Otoriter konuş", next: "sonuc-kotu", style: "danger" },
                    { label: "Empati kur", next: "sonuc-iyi", style: "success" }
                ]
            },
            "sonuc-iyi": {
                id: "sonuc-iyi",
                type: "ending",
                speaker: "Ahmet Bey",
                text: "Sen iyi birine benziyorsun evlat... Tamam ver ilacı.",
                image: "https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?auto=format&fit=crop&q=80&w=1000",
                next: ""
            },
            "sonuc-kotu": {
                id: "sonuc-kotu",
                type: "ending",
                speaker: "Ahmet Bey",
                text: "Çık odamdan! Kimse bana emir veremez!",
                image: "https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?auto=format&fit=crop&q=80&w=1000",
                next: ""
            }
        }
    },

    // --- SENARYO 3: KELEBEK ETKİSİ ---
    3: {
        id: 3,
        title: "Kelebek Etkisi: Bir Gönüllünün Yolculuğu",
        startNodeId: "sahne-1",
        nodes: {
            // --- SAHNE 1: VARIŞ ---
            "sahne-1": {
                id: "sahne-1",
                type: "dialogue",
                speaker: "Ana (Koordinatör)",
                text: "Mehmet? Hoş geldin! Ben Ana. Seni burada görmek çok güzel. Yolculuk nasıl geçti?",
                image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&q=80&w=1000", // Havaalanı
                next: "sahne-1-cevap"
            },
            "sahne-1-cevap": {
                id: "sahne-1-cevap",
                type: "dialogue",
                speaker: "Sen",
                text: "Biraz heyecanlıyım… ama hazırım.",
                image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&q=80&w=1000",
                next: "sahne-1-ana"
            },
            "sahne-1-ana": {
                id: "sahne-1-ana",
                type: "dialogue",
                speaker: "Ana (Koordinatör)",
                text: "Bu heyecan çok normal. Hadi, önce eve gidelim. Yol boyunca sana ilk hafta planını anlatayım.",
                image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&q=80&w=1000",
                next: "sahne-2"
            },

            // --- SAHNE 2: İLK YOLCULUK ---
            "sahne-2": {
                id: "sahne-2",
                type: "dialogue",
                speaker: "Ana (Koordinatör)",
                text: "Dil bariyeri ve zaman yönetimi en çok zorlanılan iki alan. Stres dönemlerinde bazı gönüllüler yarıda bırakıyor. Bu normal ama biz bunu birlikte aşacağız.",
                image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=1000", // Yolculuk
                next: "sahne-2-ic-ses"
            },
            "sahne-2-ic-ses": {
                id: "sahne-2-ic-ses",
                type: "dialogue",
                speaker: "Sen (İç Ses)",
                text: "Dil konusu… içimde sıkışıyor. Zaman yönetimi… belki de gerçekten bilmediğim kadar zor olacak.",
                image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=1000",
                next: "sahne-3"
            },

            // --- SAHNE 3: GÖNÜLLÜ EVİ ---
            "sahne-3": {
                id: "sahne-3",
                type: "dialogue",
                speaker: "Sofia (Ev Arkadaşı)",
                text: "Hoş geldin! Adın Mehmet’ti, değil mi? Odayı sana hazırladık. Akşam küçük bir karşılama çayı yapacağız.",
                image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=1000", // Ev ortamı
                next: "sahne-3-cevap"
            },
            "sahne-3-cevap": {
                id: "sahne-3-cevap",
                type: "dialogue",
                speaker: "Sen",
                text: "Çok teşekkürler. Biraz dinlenirsem süper olur.",
                image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=1000",
                next: "sahne-3-info"
            },
            "sahne-3-info": {
                id: "sahne-3-info",
                type: "dialogue",
                speaker: "Bilgi Notu",
                text: "Erasmus+ gönüllülerinin %60’ı ilk 1 haftada sosyal çekingenlik yaşıyor. Bu normaldir.",
                image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=1000",
                next: "sahne-4"
            },

            // --- SAHNE 4: ORYANTASYON ---
            "sahne-4": {
                id: "sahne-4",
                type: "dialogue",
                speaker: "Ana (Koordinatör)",
                text: "Haftada 30 saat çalışacağız. Görevlerin: Günlük çocuk etkinlikleri, Topluluk projeleri ve Kişisel gelişim atölyeleri.",
                image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1000", // Ofis
                next: "sahne-4-ana"
            },
            "sahne-4-ana": {
                id: "sahne-4-ana",
                type: "dialogue",
                speaker: "Ana (Koordinatör)",
                text: "Ve şunu bil: Dil bilmen gerekmiyor. Biz süreçte geliştireceğiz. Zaten tüm gönüllüler ilk ay panik yaşıyor.",
                image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1000",
                next: "sahne-5"
            },

            // --- SAHNE 5: DİL BARİYERİ (MARKET) ---
            "sahne-5": {
                id: "sahne-5",
                type: "dialogue",
                speaker: "Kasiyer",
                text: "São dois euros, por favor. (2 euro lütfen.)",
                image: "https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&q=80&w=1000", // Market
                next: "sahne-5-ic-ses"
            },
            "sahne-5-ic-ses": {
                id: "sahne-5-ic-ses",
                type: "dialogue",
                speaker: "Sen (İç Ses)",
                text: "Kesin yanlış anladım… Dil bilmiyorum. Stres basıyor.",
                image: "https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&q=80&w=1000",
                next: "sahne-5-dusun"
            },
            "sahne-5-dusun": {
                id: "sahne-5-dusun",
                type: "choice",
                speaker: "DÜŞÜN",
                text: "Bu durumda bir gönüllüyü en çok zorlayan duygu hangisidir?",
                image: "https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&q=80&w=1000",
                choices: [
                    { label: "Kaybetme korkusu", next: "sahne-6", style: "default" },
                    { label: "Utanç", next: "sahne-6", style: "default" },
                    { label: "Sabırsızlık", next: "sahne-6", style: "default" }
                ]
            },

            // --- SAHNE 6: İLK GÖREV ---
            "sahne-6": {
                id: "sahne-6",
                type: "dialogue",
                speaker: "Maria (Sorumlu)",
                text: "Mehmet, bugün duygular atölyesinde bize yardım edeceksin. Sadece basit İngilizce yeterli. Unutma: Gülümseme evrenseldir.",
                image: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&q=80&w=1000", // Çocuk odası
                next: "sahne-6-ic-ses"
            },
            "sahne-6-ic-ses": {
                id: "sahne-6-ic-ses",
                type: "dialogue",
                speaker: "Sen (İç Ses)",
                text: "Aslında Japonca bilsem de çocuklar anlardı… O kadar saflar ki.",
                image: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&q=80&w=1000",
                next: "sahne-6-video"
            },
            "sahne-6-video": {
                id: "sahne-6-video",
                type: "dialogue",
                speaker: "Eğitim Videosu",
                text: "▶️ 'Non-verbal Communication Basics' oynatılıyor... (Sözsüz iletişimde beden dili %55 etkilidir.)",
                image: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&q=80&w=1000",
                next: "sahne-7"
            },

            // --- SAHNE 7: İLK ZORLANMA ---
            "sahne-7": {
                id: "sahne-7",
                type: "dialogue",
                speaker: "Sen (İç Ses)",
                text: "Bugün tam üç kez yanlış anlaşıldım. Zaman plansız gidiyor. Sanki herkes benden daha iyi uyum sağlıyor.",
                image: "https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&q=80&w=1000", // Dağınık oda
                next: "sahne-7-mesaj"
            },
            "sahne-7-mesaj": {
                id: "sahne-7-mesaj",
                type: "choice",
                speaker: "Ana (Mesaj)",
                text: "Yarın sabah kısa bir check-in yapalım mı? Nasıl gittiğini merak ediyorum :)",
                image: "https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&q=80&w=1000",
                choices: [
                    { label: "İyiyim, sıkıntı yok.", next: "sahne-8", style: "default" },
                    { label: "Biraz zorlanıyorum ama konuşmak isterim.", next: "sahne-8", style: "success" }
                ]
            },

            // --- SAHNE 8: MENTOR ---
            "sahne-8": {
                id: "sahne-8",
                type: "dialogue",
                speaker: "Mentor João",
                text: "Bak Mehmet, bu zorlanmalar başarısızlık değil — süreçtir. Stratejin şu olsun: 'Küçük alışkanlık — büyük düzen.' Günde 15 dakika planlama.",
                image: "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&q=80&w=1000", // Ofis/Cafe
                next: "sahne-8-cevap"
            },
            "sahne-8-cevap": {
                id: "sahne-8-cevap",
                type: "dialogue",
                speaker: "Sen",
                text: "Sanırım bunu gerçekten denemeliyim.",
                image: "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&q=80&w=1000",
                next: "sahne-9"
            },

            // --- SAHNE 9: TOPLULUK PROJESİ ---
            "sahne-9": {
                id: "sahne-9",
                type: "dialogue",
                speaker: "Yaşlı Teyze",
                text: "Benim telefon sürekli fotoğraf çekiyor yavrum, durduramıyorum. (Gülüyor)",
                image: "https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?auto=format&fit=crop&q=80&w=1000", // Yaşlılarla etkinlik
                next: "sahne-9-cevap"
            },
            "sahne-9-cevap": {
                id: "sahne-9-cevap",
                type: "dialogue",
                speaker: "Sen",
                text: "Birlikte bakalım teyzecim...",
                image: "https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?auto=format&fit=crop&q=80&w=1000",
                next: "sahne-9-info"
            },
            "sahne-9-info": {
                id: "sahne-9-info",
                type: "dialogue",
                speaker: "Bilgi Notu",
                text: "Gönüllüler en çok bu tarz küçük başarılarla motivasyon kazanır.",
                image: "https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?auto=format&fit=crop&q=80&w=1000",
                next: "sahne-10"
            },

            // --- SAHNE 10: KRİTİK ZORLUK ---
            "sahne-10": {
                id: "sahne-10",
                type: "dialogue",
                speaker: "Maria (Gergin)",
                text: "Bugün plan çöktü. Etkinlik iptal. Senden hızlı bir çözüm istiyorum.",
                image: "https://images.unsplash.com/photo-1499209974431-2761e2508590?auto=format&fit=crop&q=80&w=1000", // Gergin ortam
                next: "sahne-10-ic-ses"
            },
            "sahne-10-ic-ses": {
                id: "sahne-10-ic-ses",
                type: "choice",
                speaker: "DÜŞÜN",
                text: "Panik... Dil eksik, zaman dar. Ne yapardın?",
                image: "https://images.unsplash.com/photo-1499209974431-2761e2508590?auto=format&fit=crop&q=80&w=1000",
                choices: [
                    { label: "Hazır bir oyun önerirdim", next: "sahne-11", style: "default" },
                    { label: "Ekibe danışırdım", next: "sahne-11", style: "default" },
                    { label: "5 dk nefeslenip karar verirdim", next: "sahne-11", style: "default" }
                ]
            },

            // --- SAHNE 11: ORTA DÖNEM ---
            "sahne-11": {
                id: "sahne-11",
                type: "dialogue",
                speaker: "Ana (Koordinatör)",
                text: "Gelişmeni görüyorum Mehmet. Şimdi senden beklentim: Küçük bir hafta projesi öner.",
                image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=1000", // Ofis
                next: "sahne-11-cevap"
            },
            "sahne-11-cevap": {
                id: "sahne-11-cevap",
                type: "dialogue",
                speaker: "Sen",
                text: "Sanırım çocuklarla ‘Duyguları Öğreniyorum’ mini panosu yapabiliriz.",
                image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=1000",
                next: "sahne-11-onay"
            },
            "sahne-11-onay": {
                id: "sahne-11-onay",
                type: "dialogue",
                speaker: "Ana (Koordinatör)",
                text: "Harika fikir! Hazırlıkları yarın yaparız.",
                image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=1000",
                next: "sahne-12"
            },

            // --- SAHNE 12: TERS KÖŞE ---
            "sahne-12": {
                id: "sahne-12",
                type: "dialogue",
                speaker: "Leon (Çocuk)",
                text: "Mehmet… bugün ailem kavga etti. Kötü hissediyorum.",
                image: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&q=80&w=1000", // Çocukla konuşma
                next: "sahne-12-cevap"
            },
            "sahne-12-cevap": {
                id: "sahne-12-cevap",
                type: "dialogue",
                speaker: "Sen",
                text: "Burada güvendesin Leon. Konuşmak istersen dinlerim.",
                image: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&q=80&w=1000",
                next: "sahne-12-info"
            },
            "sahne-12-info": {
                id: "sahne-12-info",
                type: "dialogue",
                speaker: "Bilgi Notu",
                text: "Gönüllülerin en büyük rollerinden biri: empatik tanıklık. Sorunu çözmezsin, alan açarsın.",
                image: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&q=80&w=1000",
                next: "sahne-13"
            },

            // --- SAHNE 13: KELEBEK ETKİSİ ---
            "sahne-13": {
                id: "sahne-13",
                type: "dialogue",
                speaker: "Ana (Gülerek)",
                text: "Bak Mehmet… Senin başlattığın küçük pano, çocukların davranışlarında fark yarattı. Bir çocuk sakinken öfkesini ifade etti. Böyle şeyler büyür… yayılır.",
                image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=1000", // Pano görseli
                next: "sahne-13-ic-ses"
            },
            "sahne-13-ic-ses": {
                id: "sahne-13-ic-ses",
                type: "dialogue",
                speaker: "Sen (İç Ses)",
                text: "Ben sadece küçük bir pano yapmıştım sanıyordum…",
                image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=1000",
                next: "sahne-14"
            },

            // --- SAHNE 14: FİNAL ---
            "sahne-14": {
                id: "sahne-14",
                type: "dialogue",
                speaker: "Simülasyon Özeti",
                text: "Sen panoyu hazırladın → Çocuk duygusunu ifade etti → Aile içi iletişim önerisi aldı → Özgüven kazandı. Projenin uzun vadeli raporunda 'duygusal farkındalık %22 arttı' yazıyor.",
                image: "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?auto=format&fit=crop&q=80&w=1000", // Kelebek/Doğa
                next: "sahne-14-final"
            },
            "sahne-14-final": {
                id: "sahne-14-final",
                type: "ending",
                speaker: "Gönülver.ai",
                text: "Gönüllülük bir anda değil, küçük dokunuşlarla büyür. Her seçim, her sabır, her empati… dalga dalga yayılır. İşte kelebek etkisi böyle başlar.",
                image: "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?auto=format&fit=crop&q=80&w=1000",
                next: ""
            }
        }
    },

    4: {
        id: 4,
        title: "Gönüllünün Yolculuğu",
        startNodeId: "sahne-1",
        nodes: {
            // --- SAHNE 1: VARIŞ ---
            "sahne-1": {
                id: "sahne-1",
                type: "dialogue",
                speaker: "Ana (Koordinatör)",
                text: "Mehmet? Hoş geldin! Ben Ana. Seni burada görmek çok güzel. Yolculuk nasıl geçti?",
                image: "https://media.istockphoto.com/id/1254973568/photo/empty-airport-terminal-lounge-with-airplane-on-background.jpg?s=612x612&w=0&k=20&c=WoX_hcz_igZ1NNRlwwR9Cc_EjjL4Ncf_hoTMDatg2AU=",
                characterImage: "https://i.imgur.com/lZrJuih.png",
                environment: "Havaalanı • Gün 0",
                next: "sahne-1-icses"
            },
            "sahne-1-icses": {
                id: "sahne-1-icses",
                type: "dialogue",
                speaker: "Sen (İç Ses)",
                text: "",
                subtitle: "Buradayım. Artık geri dönüş yok. Dile, kültüre, sorumluluklara… hazır olmalıyım.",
                image: "https://media.istockphoto.com/id/1254973568/photo/empty-airport-terminal-lounge-with-airplane-on-background.jpg?s=612x612&w=0&k=20&c=WoX_hcz_igZ1NNRlwwR9Cc_EjjL4Ncf_hoTMDatg2AU=",
                environment: "Havaalanı Çıkışı",
                next: "sahne-2"
            },

            // --- SAHNE 2: ORYANTASYON ---
            "sahne-2": {
                id: "sahne-2",
                type: "dialogue",
                speaker: "Ana (Koordinatör)",
                text: "Burada iki şey gönüllüleri en çok zorlar: Dil ve Zaman. Bu yılın raporu çok net. Seninle bunları işlemeyi çok istiyorum.",
                image: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=1200",
                characterImage: "https://i.imgur.com/EoAZN2F.png",
                environment: "Oryantasyon Salonu • Gün 1",
                next: "sahne-2-video",
            },
            "sahne-2-video": {
                id: "sahne-2-video",
                type: "dialogue",
                speaker: "Ana (Koordinatör)",
                text: "Bu sürece başlamadan önce şu kısa videoya göz atman faydalı olabilir.",
                image: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=1200",
                characterImage: "https://i.imgur.com/EoAZN2F.png",
                environment: "Oryantasyon Salonu",
                next: "sahne-3",
                videoLink: {
                    label: "Cultural Shock Stages Explained – 3 min",
                    url: "https://www.youtube.com"
                }
            },

            // --- SAHNE 3: MENTOR TAKTİKLERİ ---
            "sahne-3": {
                id: "sahne-3",
                type: "dialogue",
                speaker: "Mentor João",
                text: "Gönüllülükte üç hatayı herkes yapar: Zamanı yanlış kullanmak, dil konusunda kendini suçlamak, sınır koymayı bilmemek. Bunları tek başına çözmek zorunda değilsin.",
                image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=1200",
                characterImage: "https://i.imgur.com/dY4DwKl.png", // Erkek Mentor
                environment: "Mentor Ofisi • Gün 2",
                next: "sahne-3-video1"
            },
            "sahne-3-video1": {
                id: "sahne-3-video1",
                type: "dialogue",
                speaker: "Eğitim Önerisi",
                text: "Zaman yönetimi için şu kaynağı inceleyebilirsin:",
                image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=1200",
                environment: "Eğitim Kaynakları",
                next: "sahne-3-video2",
                videoLink: {
                    label: "How to Build a Weekly Planning System (5 dk)",
                    url: "https://www.google.com"
                }
            },
            "sahne-3-video2": {
                id: "sahne-3-video2",
                type: "dialogue",
                speaker: "Eğitim Önerisi",
                text: "Kültürel hassasiyet konusunda ise şu video önemli:",
                image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=1200",
                environment: "Eğitim Kaynakları",
                next: "sahne-4",
                videoLink: {
                    label: "Empathy & Cultural Sensitivity 101 (3 dk)",
                    url: "https://www.google.com"
                }
            },

            // --- SAHNE 4: PROJENİN MANTIĞI ---
            "sahne-4": {
                id: "sahne-4",
                type: "dialogue",
                speaker: "Ana (Koordinatör)",
                text: "Burada yaptığın her küçük şey altı ay sonra yüzlerce kişiye dokunacak. Ama bunu süreçte fark etmeyebilirsin. Sık sık ‘Boşa mı yapıyorum?’ hissi olur. Bu normal.",
                image: "https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?auto=format&fit=crop&q=80&w=1200",
                characterImage: "https://i.imgur.com/EoAZN2F.png",
                environment: "Kurum Bahçesi • Gün 3",
                subtitle: "(Gönüllülerin %63’ü etkisini süreç boyunca göremez. Simülasyon sonunda kelebek etkisini göstereceğiz.)",
                next: "sahne-5"
            },

            // --- SAHNE 5: ÖZ DEĞERLENDİRME ---
            "sahne-5": {
                id: "sahne-5",
                type: "dialogue",
                speaker: "Mentor João",
                text: "Şimdi küçük bir öz-değerlendirme yapıyoruz. Bu sadece senin için. Dil? Zaman? Psikolojik iyi oluş? Kendine karşı dürüst ol. (Zihninde 1-10 arası puanla.)",
                image: "https://cdn-bnokp.nitrocdn.com/QNoeDwCprhACHQcnEmHgXDhDpbEOlRHH/assets/images/optimized/rev-162bb58/www.decorilla.com/online-decorating/wp-content/uploads/2020/12/Zoom-ready-home-office-background-ideas-by-Decorilla-1024x683-345x600.jpg",
                characterImage: "https://i.imgur.com/dY4DwKl.png",
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
                text: "I felt like you were not listening yesterday. I tried to explain the activity and you walked away. (Şok oldun, sadece malzeme almaya gitmiştin.)",
                image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1200",
                characterImage: "https://i.imgur.com/dY4DwKl.png", // Elena Karakteri
                environment: "Toplantı Odası • Gün 12",
                choices: [
                    // YENİ: struggleCategory eklendi
                    { label: "A) Direkt savunmaya geç", next: "sahne-6-A", style: "danger", struggleCategory: "Kültürel İletişim" },
                    { label: "B) Dili kullanamamanın etkisini kabul et", next: "sahne-6-B", style: "success" },
                    { label: "C) Sessiz kal ve geçiştir", next: "sahne-6-C", style: "default", struggleCategory: "Özgüven Eksikliği" }
                ]
            },
            "sahne-6-A": {
                id: "sahne-6-A",
                type: "dialogue",
                speaker: "Mentor João (Analiz)",
                text: "İlk tepkin savunma olduğunda güven duvarı büyür. Kültürler arası iletişimde niyet değil, algı etkilidir. Bu seçenek kısa vadede rahatlatır ama uzun vadede ekibi senden uzaklaştırır.",
                image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=1200",
                characterImage: "https://i.imgur.com/dY4DwKl.png",
                next: "sahne-7"
            },
            "sahne-6-B": {
                id: "sahne-6-B",
                type: "dialogue",
                speaker: "Mentor João (Analiz)",
                text: "Harika bir adım. Sorumluluk alman seni zayıf yapmaz; ilişkiyi güçlü yapar. Algıyı düzeltir, ekip seni güvenilir görür. Burada büyüme başlar.",
                image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=1200",
                characterImage: "https://i.imgur.com/dY4DwKl.png",
                next: "sahne-7"
            },
            "sahne-6-C": {
                id: "sahne-6-C",
                type: "dialogue",
                speaker: "Mentor João (Analiz)",
                text: "Pasif uyum kısa süre idare eder ama içeride birikir. Bir noktada patlar. Bunu kendine yapma.",
                image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=1200",
                characterImage: "https://i.imgur.com/dY4DwKl.png",
                next: "sahne-7"
            },

            // --- SAHNE 7: MİSCOMMUNICATION 101 ---
            "sahne-7": {
                id: "sahne-7",
                type: "dialogue",
                speaker: "Ana (Eğitim)",
                text: "İyi gönüllüler iyi konuşanlar değil, iyi açıklayanlardır. Şu videoya bir bakmanı istiyorum:",
                image: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=1200",
                characterImage: "https://i.imgur.com/dY4DwKl.png",
                environment: "Ofis • İletişim Eğitimi",
                next: "sahne-8",
                videoLink: {
                    label: "Miscommunication in International Teams — 4 min",
                    url: "https://www.google.com"
                }
            },

            // --- SAHNE 8: SINIR KOYMA KRİZİ ---
            "sahne-8": {
                id: "sahne-8",
                type: "choice",
                speaker: "Maria (Sorumlu)",
                text: "Bugün 3 yerine 5 grup alsan olur mu? Sen gençsin, enerjin var. (Günün zaten dolu.)",
                image: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&q=80&w=1200",
                characterImage: "https://i.imgur.com/dY4DwKl.png", // Maria (Elena ile aynı görseli kullandım placeholder olarak)
                environment: "Etkinlik Odası • Gün 25",
                choices: [
                    { label: "A) 'Tamam yaparım' de", next: "sahne-8-A", style: "danger", struggleCategory: "Sınır Koyma / Hayır Diyebilme" },
                    { label: "B) Kibarca sınır koy", next: "sahne-8-B", style: "success" },
                    { label: "C) Direkt reddet", next: "sahne-8-C", style: "default", struggleCategory: "Kültürel İletişim" }
                ]
            },
            "sahne-8-A": { id: "sahne-8-A", type: "dialogue", speaker: "Mentor João", text: "Kendine koymadığın sınır, seni zamanla yorar. En tehlikeli davranış budur.", characterImage: "https://i.imgur.com/dY4DwKl.png", image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=1200", next: "sahne-9" },
            "sahne-8-B": { id: "sahne-8-B", type: "dialogue", speaker: "Mentor João", text: "Bu olgunluk göstergesidir. Gönüllülük kölelik değildir. Sınır koyabilen gönüllü uzun süre dayanır.", characterImage: "https://i.imgur.com/dY4DwKl.png", image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=1200", next: "sahne-9" },
            "sahne-8-C": { id: "sahne-8-C", type: "dialogue", speaker: "Mentor João", text: "Haklı olsan bile sertlik yanlış okunur. Kültürel uyum bozulur.", characterImage: "https://i.imgur.com/dY4DwKl.png", image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=1200", next: "sahne-9" },

            // --- SAHNE 9: PSİKOLOJİK DÜŞÜŞ ---
            "sahne-9": {
                id: "sahne-9",
                type: "choice",
                speaker: "Sen (İç Ses)",
                text: "",
                subtitle: "(Odan dağınık. Yalnız hissediyorsun. Ana mesaj attı: 'Yarın yoğun bir atölye var, hazır mısın?')",
                image: "https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&q=80&w=1200",
                environment: "Yalnız Oda • Gün 40",
                choices: [
                    { label: "A) Yalnızlığı bastırıp çalışmaya gömül", next: "sahne-9-A", style: "danger", struggleCategory: "Duygusal Dayanıklılık" },
                    { label: "B) Mentora mesaj atıp yardım iste", next: "sahne-9-B", style: "success" },
                    { label: "C) Bir arkadaşına 'İyi hissetmiyorum' yaz", next: "sahne-9-C", style: "default" }
                ]
            },
            "sahne-9-A": { id: "sahne-9-A", type: "dialogue", speaker: "Mentor Analizi", text: "Duyguları bastırmak çalışmayı yüceltmez, sadece çatlatır.", image: "https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&q=80&w=1200", next: "sahne-10" },
            "sahne-9-B": { id: "sahne-9-B", type: "dialogue", speaker: "Mentor Analizi", text: "Bu profesyonel bir destek adımıdır. En sağlıklı davranış budur.", image: "https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&q=80&w=1200", next: "sahne-10" },
            "sahne-9-C": { id: "sahne-9-C", type: "dialogue", speaker: "Mentor Analizi", text: "İyi bir adım ama profesyonel destekle birleşirse daha güçlü olur.", image: "https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&q=80&w=1200", next: "sahne-10" },

            // --- SAHNE 10: ENERJİ YÖNETİMİ ---
            "sahne-10": {
                id: "sahne-10",
                type: "dialogue",
                speaker: "Ana (Koordinatör)",
                text: "Enerji yönetimi yapamayan gönüllü, en iyi niyetli bile olsa hızlı tükenir.",
                image: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=1200",
                characterImage: "https://i.imgur.com/EoAZN2F.png",
                environment: "Ofis • Enerji Eğitimi",
                next: "sahne-11",
                videoLink: {
                    label: "The 3-layer Energy Model — 3 min",
                    url: "https://www.google.com"
                }
            },

            // --- SAHNE 11: KÜLTÜREL ÇATIŞMA ---
            "sahne-11": {
                id: "sahne-11",
                type: "choice",
                speaker: "Elena (Gönüllü)",
                text: "Mehmet, her zaman bu kadar ciddi misin? (Gülüyorlar, ama sen rahatsız oldun.)",
                image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1200",
                characterImage: "https://i.imgur.com/dY4DwKl.png",
                environment: "Grup Toplantısı • Gün 55",
                choices: [
                    { label: "A) İçinden kırılıp sessizleş", next: "sahne-11-A", style: "danger" },
                    { label: "B) Duygunu yumuşakça ifade et ('It felt harsh')", next: "sahne-11-B", style: "success" },
                    { label: "C) 'Sorun sende' tarzı çıkış ('You shouldn't joke')", next: "sahne-11-C", style: "default" }
                ]
            },
            "sahne-11-A": { id: "sahne-11-A", type: "dialogue", speaker: "Mentor João", text: "Duyguları saklamak çatışmayı dondurur; yok etmez.", characterImage: "https://i.imgur.com/dY4DwKl.png", image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1200", next: "sahne-12" },
            "sahne-11-B": { id: "sahne-11-B", type: "dialogue", speaker: "Mentor João", text: "Bu mükemmel bir kültürel köprü kurma davranışıdır.", characterImage: "https://i.imgur.com/dY4DwKl.png", image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1200", next: "sahne-12" },
            "sahne-11-C": { id: "sahne-11-C", type: "dialogue", speaker: "Mentor João", text: "Kültürel çatışma büyür, ekip uyumu zarar görür.", characterImage: "https://i.imgur.com/dY4DwKl.png", image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1200", next: "sahne-12" },

            // --- SAHNE 12: SÜRDÜRÜLEBİLİRLİK ---
            "sahne-12": {
                id: "sahne-12",
                type: "choice",
                speaker: "Mentor João",
                text: "Son 2 haftadır yüzünde yorgunluk görüyorum. Devam etmeyi düşünüyor musun?",
                image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=1200",
                characterImage: "https://i.imgur.com/dY4DwKl.png",
                environment: "Mentor Ofisi • Gün 70",
                choices: [
                    { label: "A) 'Bırakmak istiyorum.'", next: "sahne-12-A", style: "danger" },
                    { label: "B) 'Devam etmek istiyorum ama yardım lazım.'", next: "sahne-12-B", style: "success" },
                    { label: "C) 'Zor ama tamamlayacağım.'", next: "sahne-12-C", style: "default" }
                ]
            },
            "sahne-12-A": { id: "sahne-12-A", type: "dialogue", speaker: "Mentor Analizi", text: "Kısa vadede rahatlık, uzun vadede pişmanlık getirebilir.", image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=1200", next: "sahne-13" },
            "sahne-12-B": { id: "sahne-12-B", type: "dialogue", speaker: "Mentor Analizi", text: "En sağlıklı yaklaşım. Yardım istemek güçlülüktür.", image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=1200", next: "sahne-13" },
            "sahne-12-C": { id: "sahne-12-C", type: "dialogue", speaker: "Mentor Analizi", text: "Kararlı ama destek almazsan süreç çok yorucu olabilir.", image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=1200", next: "sahne-13" },

            // --- SAHNE 13: SONUÇ ---
            "sahne-13": {
                id: "sahne-13",
                type: "dialogue",
                speaker: "Ana (Koordinatör)",
                text: "Mehmet… ilk günkü halinle bugünkü halin arasında dağlar var. Artık ekip sana güveniyor, çocuklar seni arıyor, program seni örnek gösteriyor.",
                image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=1200",
                characterImage: "https://i.imgur.com/EoAZN2F.png",
                environment: "Kapanış Toplantısı • Gün 150",
                subtitle: "(İstatistikler: Dil Gelişimi %85, Empati Puanı %90, Dayanıklılık %95)",
                next: "sahne-14"
            },

            // --- SAHNE 14: KELEBEK ETKİSİ ---
            "sahne-14": {
                id: "sahne-14",
                type: "dialogue",
                speaker: "Simülasyon Özeti",
                text: "Bir drama atölyesinde sakinleştirdiğin o küçük çocuk… iki yıl sonra kendi mahallesinde gönüllü oldu. Sen bilmesen bile — o gün aldığın kararlardan biri bugün onlarca kişiye umut oldu.",
                image: "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?auto=format&fit=crop&q=80&w=1200",
                environment: "Gelecekten Bir Görüntü",
                next: "sahne-15"
            },

            // --- SAHNE 15: KAPANIŞ ---
            "sahne-15": {
                id: "sahne-15",
                type: "ending",
                speaker: "Ana (Kapanış)",
                text: "Gönüllülük büyük hedeflerle değil, küçük ama bilinçli seçimlerle büyür. Sen bugün o seçimleri deneyimledin. Hazırsın.",
                image: "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?auto=format&fit=crop&q=80&w=1200",
                characterImage: "https://i.imgur.com/EoAZN2F.png",
                next: ""
            }
        }
    }
};