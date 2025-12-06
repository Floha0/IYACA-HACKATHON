import os
import json
import time
import re
from groq import Groq
import dotenv
import httpx

# API Key Kontrolü
dotenv.load_dotenv(".env.local")
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

# --- IYACA SABİT KURUMSAL KİMLİK ---
IYACA_STATIC_IDENTITY = """
KURUM: IYACA (Uluslararası Gençlik Aktiviteleri Merkezi Derneği).
TEMEL FELSEFE: Gönüllülük sadece "iyilik yapmak" değil, "kendini inşa etmek"tir.
PROGRAM: UGP (Ulusal Gönüllülük Programı) - Akran öğrenmesi ve aktif vatandaşlık esaslı.
"""

# --- IYACA DETAYLI BİLGİ BANKASI (User'ın verdiği metin) ---
IYACA_KNOWLEDGE_BASE = """
MİSYON: Gençlerin potansiyellerini ortaya çıkarmak, farkındalık oluşturmak, bilimsel/kültürel habitat sağlamak.
SORUNLAR VE KORKULAR (Türkiye/Global):
1. Zaman Yönetimi: Okul/İş/Gönüllülük dengesi. "Yetişememe" korkusu.
2. Yetersizlik Hissi: "Potansiyelimi gösteremiyorum", "Fikirlerim önemsenmiyor".
3. Dil Bariyeri: Özellikle uluslararası (Erasmus+/ESC) projelerde İngilizce konuşma utancı/korkusu.
4. Sosyal Kaygılar: İletişimsizlik, dışlanma, aidiyet hissedememe (Gergin ortam korkusu).
5. İstikrarsızlık: STK'ların en büyük sorunu gönüllü tutundurmadır (Retention). Hevesle başlayıp bırakma riski.

BEKLENTİLER VE KAZANIMLAR:
- "Korkudan Güvene": Başta çekinen gencin, sonunda "Yapabilirim" demesi.
- Kelebek Etkisi: Küçük bir işin (örn: kahve demleme, veri girme) büyük bir toplumsal etkiye dönüştüğünü görmek.
- Somut Beceriler: Proje yönetimi, kriz anında çözüm, stres kontrolü.
"""

OUTPUT_FILE = "iyaca_generated_scenario.json"


class MultiAgentGenerator:
    def __init__(self):
        self.client = Groq(
            api_key=GROQ_API_KEY,
            timeout=120.0,
            max_retries=1
        )

    def log(self, agent_name, message):
        print(f"\n⚡ [{agent_name}]: {message}")

    def extract_json_from_text(self, text):
        """Metin içindeki JSON bloğunu regex ile bulur."""
        try:
            text = re.sub(r'```json\s*', '', text)
            text = re.sub(r'```\s*', '', text)
            match = re.search(r'(\{.*\})', text, re.DOTALL)
            if match:
                return json.loads(match.group(1))
            return json.loads(text)
        except:
            return None

    def call_groq(self, model, user_prompt, system_prompt="Yardımcı asistan.", json_mode=False, temperature=0.7):
        messages = [{"role": "system", "content": system_prompt}, {"role": "user", "content": user_prompt}]
        kwargs = {
            "model": model, "messages": messages, "temperature": temperature,
            "max_tokens": 8000, "top_p": 1, "stop": None
        }
        if json_mode: kwargs["response_format"] = {"type": "json_object"}

        try:
            return self.client.chat.completions.create(**kwargs).choices[0].message.content
        except Exception as e:
            print(f"API Error: {e}")
            return None

    # --- 0. AŞAMA: CONTEXT BUILDER (YENİ AJAN) ---
    def agent_context_builder(self, user_topic):
        self.log("Context Builder", "Kullanıcı girdisi ve IYACA verileriyle özgün bir senaryo teması yaratılıyor...")

        system_prompt = """
        Sen IYACA'nın Strateji ve Psikoloji Danışmanısın.
        Görevin: Kullanıcının girdiği konuyu, IYACA'nın gerçek rapor verileriyle harmanlayarak derinlikli bir SENARYO TEMASI oluşturmak.
        Sadece JSON döndür.
        """

        user_prompt = f"""
        KULLANICI GİRDİSİ: "{user_topic}"

        IYACA BİLGİ BANKASI:
        {IYACA_KNOWLEDGE_BASE}

        GÖREV:
        1. Kullanıcının girdisini analiz et.
        2. Bilgi bankasındaki "Korkular", "Sorunlar" ve "Beklentiler"den en uygun olanları seç.
        3. Türkiye'deki gençlerin sosyolojik durumunu (sınav stresi, gelecek kaygısı, dil sorunu vb.) göz önüne al.
        4. Simülasyon için TEK ve NET bir "Çatışma Durumu" kurgula.

        ÇIKTI FORMATI (JSON):
        {{
            "scenario_theme": "Senaryonun Başlığı (Örn: Dil Bariyeri ve Özgüven)",
            "protagonist_profile": "Gönüllü Karakterin Ruh Hali (Örn: İstekli ama İngilizcesinden utanan üniversite öğrencisi)",
            "conflict_core": "Temel Çatışma (Örn: Yabancı bir gönüllüye yardım etmesi gerekirken kaçmak istemesi)",
            "target_goal": "Kazanılması Gereken Hedef (Örn: Hata yapmaktan korkmamak)",
            "atmosphere": "Sahnenin geçeceği ortam ve his (Örn: Kalabalık, gürültülü bir oryantasyon günü)"
        }}
        """

        response = self.call_groq("llama-3.3-70b-versatile", user_prompt, system_prompt, json_mode=True,
                                  temperature=0.85)
        return self.extract_json_from_text(response)

    # --- 1. AŞAMA: KURGU UZMANI (NARRATIVE DESIGNER) ---
    def agent_narrative_designer(self, generated_context):
        self.log("Kurgu Uzmanı", "Oluşturulan temaya göre hikaye iskeleti kuruluyor...")

        if not generated_context: return None

        system_prompt = "Sen usta bir senaryo mimarısın. Sadece JSON döndür."

        user_prompt = f"""
        Aşağıdaki ÖZEL BAĞLAMA göre 10 sahneli, dallanan bir hikaye iskeleti (Beat Sheet) yaz.

        BAĞLAM VERİSİ:
        {json.dumps(generated_context, ensure_ascii=False)}

        KURALLAR:
        1. Toplam 10 Sahne.
        2. Sahne 3: BÜYÜK KIRILMA (YOL A: Korkuya Yenik Düşme / YOL B: Üzerine Gitme).
        3. Sahne 7: İKİNCİ KIRILMA (Finalin kalitesini belirleyen karar).
        4. Final (Sahne 10): IYACA raporundaki "Dönüşüm" (Korkudan Güvene) gerçekleşmeli veya başarısız olunmalı.

        ÇIKTI (JSON):
        {{
            "meta": {{ "theme": "{generated_context['scenario_theme']}", "goal": "{generated_context['target_goal']}" }},
            "beats": [
                {{ "scene": 1, "desc": "Giriş..." }},
                ...
                {{ "scene": 3, "type": "branching", "desc": "Seçim anı...", "path_a_desc": "...", "path_b_desc": "..." }}
                ...
            ]
        }}
        """
        response = self.call_groq("llama-3.3-70b-versatile", user_prompt, system_prompt, json_mode=True,
                                  temperature=0.8)
        return self.extract_json_from_text(response)

    # --- 2. AŞAMA: MİMAR ---
    def agent_architect(self, beat_sheet):
        self.log("Mimar", "Senaryo metne dökülüyor...")
        if not beat_sheet: return None

        system_prompt = "Sen yaratıcı bir yazarsın. Akıcı, gençlere hitap eden bir dille yaz."

        user_prompt = f"""
        Bu iskeleti TAM METİN haline getir.
        VERİ: {json.dumps(beat_sheet, ensure_ascii=False)}

        ÖNEMLİ:
        - Sahne 3'ten sonra hikaye ikiye ayrılır (YOL A ve YOL B).
        - İki yolu da ayrı ayrı, 10. sahneye kadar yaz.

        ÇIKTI (Sadece Metin):
        SAHNE 1: ...
        ...
        --- YOL A (NEGATİF/ÇEKİNGEN) ---
        SAHNE 4A: ...
        ...
        --- YOL B (POZİTİF/CESUR) ---
        SAHNE 4B: ...
        """
        return self.call_groq("llama-3.3-70b-versatile", user_prompt, system_prompt, json_mode=False, temperature=0.75)

    # --- 3. AŞAMA: PSİKOLOG ---
    def agent_psychologist(self, draft_story):
        self.log("Psikolog", "IYACA değerleri ve duygusal derinlik işleniyor...")
        if not draft_story: return None

        system_prompt = "Sen ödüllü bir editör ve gençlik psikoloğusun."

        user_prompt = f"""
        Bu metni düzenle ve derinleştir.

        ODAKLANMAN GEREKENLER (IYACA RAPORUNDAN):
        1. **İç Sesler:** Gönüllünün "Acaba yetersiz miyim?" veya "Buraya ait miyim?" sorgulamalarını ekle.
        2. **Dönüşüm:** Finalde "Küçük bir işin büyük etkisi" (Kelebek Etkisi) hissini ver.
        3. **Seçenekler:** Karar anlarındaki seçenekleri sadece eylem değil, duygu durumu olarak yaz (Örn: "Utancına yenik düşüp oradan uzaklaş").

        METİN:
        {draft_story}
        """
        return self.call_groq("llama-3.3-70b-versatile", user_prompt, system_prompt, json_mode=False, temperature=0.85)

    # --- 4. AŞAMA: KODLAYICI ---
    def agent_coder(self, rich_text):
        self.log("Kodlayıcı", "Puanlama ve JSON Graph oluşturuluyor...")
        if not rich_text: return None

        system_prompt = "Sen JSON dönüştürücüsüsün. SADECE JSON döndür. Markdown YOK."

        user_prompt = f"""
        Hikayeyi JSON Graph'a çevir.
        HİKAYE: {rich_text}

        PUANLAMA (score_impact): 
        - motivasyon (İstek)
        - yetkinlik (Skill)
        - aidiyet (Belonging)

        YAPI:
        - Sahne 3 (Decision) -> Options -> [Next: 4A], [Next: 4B]
        - YOL A: 4A -> ... -> 10A
        - YOL B: 4B -> ... -> 10B
        - Decision node'larında options ZORUNLU.
        - Tırnakları escape et.

        FORMAT:
        {{
            "nodes": [
                {{ "id": "scene_1", "type": "info", "text": "...", "next_id": "scene_2" }},
                ...
            ]
        }}
        """
        response = self.call_groq("llama-3.3-70b-versatile", user_prompt, system_prompt, json_mode=True,
                                  temperature=0.1)
        return self.extract_json_from_text(response)

    # --- 5. AŞAMA: EDİTÖR ---
    def agent_editor(self, text):
        self.log("Editör", "Başlık belirleniyor...")
        if not text: return {"title": "Hata", "category": "Hata"}

        system_prompt = "Sadece JSON döndür."
        user_prompt = f"""Başlık ve Kategori bul. JSON: {{ "title": "...", "category": "..." }} Metin: {text[:2000]}"""

        response = self.call_groq("llama-3.1-8b-instant", user_prompt, system_prompt, json_mode=True, temperature=0.5)
        return self.extract_json_from_text(response)

    def run_pipeline(self):
        start_time = time.time()
        print(f"🚀 IYACA DYNAMIC CONTEXT ENGINE")

        # KULLANICI GİRDİSİ (Genel veya Spesifik olabilir)
        # Örnek 1: "İngilizce konuşmaktan korkan biri"
        # Örnek 2: "Çok yoğun dersleri olan bir öğrenci"
        # Örnek 3: "Gönüllülük zorlukları" (Genel bırakırsan o seçer)
        konu_girdisi = "Gönüllülükte yaşanan zorluklar ve kişisel gelişim"

        # 0. Context Builder (YENİ ADIM)
        context_data = self.agent_context_builder(konu_girdisi)
        if not context_data:
            print("❌ Context oluşturulamadı.")
            return

        print(f"🎯 OLUŞTURULAN TEMA: {context_data.get('scenario_theme')}")
        print(f"🧠 ÇATIŞMA: {context_data.get('conflict_core')}")

        # 1. Beat Sheet
        beat_sheet = self.agent_narrative_designer(context_data)
        if not beat_sheet: return

        # 2. Taslak
        draft_story = self.agent_architect(beat_sheet)
        if not draft_story: return

        # 3. Derinlik
        final_story = self.agent_psychologist(draft_story)

        print(f"\n📄 Hikaye Hazır ({len(final_story)} karakter)")

        # 4. JSON Graph
        graph_data = self.agent_coder(final_story)
        if not graph_data: return

        # 5. Metadata
        metadata = self.agent_editor(final_story)

        final_output = {
            "title": metadata.get("title", "Başlıksız"),
            "category": metadata.get("category", "Genel"),
            "context_metadata": context_data,
            "nodes": graph_data.get("nodes", [])
        }

        with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
            json.dump(final_output, f, indent=4, ensure_ascii=False)

        print(f"\n✅ DOSYA OLUŞTURULDU: {OUTPUT_FILE}")
        print(f"Toplam Sahne: {len(final_output['nodes'])}")
        print(f"⏱️ Süre: {time.time() - start_time:.2f} saniye")


if __name__ == "__main__":
    if not GROQ_API_KEY:
        print("Lütfen GROQ_API_KEY ayarlayın.")
    else:
        generator = MultiAgentGenerator()
        generator.run_pipeline()