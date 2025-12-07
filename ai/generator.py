import os
import json
import time
import re
import random
from groq import Groq
import dotenv
import httpx
from pathlib import Path
import io
import sys

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8')

current_dir = Path(__file__).parent
env_path = current_dir / ".env.local"

# API Key Kontrolü
dotenv.load_dotenv(env_path)
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

# --- IYACA BİLGİ BANKASI ---
IYACA_KNOWLEDGE_BASE = """
KURUM: IYACA. MİSYON: Gençlerin potansiyellerini ortaya çıkarmak.
TEMALAR: Zaman Yönetimi, Yetersizlik Hissi, Dil Bariyeri, Sosyal Kaygılar, İstikrarsızlık.
"""

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
OUTPUT_FILE = os.path.join(BASE_DIR, "..", "public", "iyaca_frontend_ready.json")
# OUTPUT_FILE = "../public/iyaca_frontend_ready.json"


class MultiAgentGenerator:
    def __init__(self):
        self.client = Groq(api_key=GROQ_API_KEY, timeout=180.0, max_retries=1)

    def log(self, agent_name, message):
        print(f"\n⚡ [{agent_name}]: {message}")

    def extract_json_from_text(self, text):
        try:
            text = re.sub(r'```json\s*', '', text)
            text = re.sub(r'```\s*', '', text)
            match = re.search(r'(\{.*\})', text, re.DOTALL)
            if match: return json.loads(match.group(1))
            return json.loads(text)
        except:
            return None

    def call_groq(self, model, user_prompt, system_prompt="Asistan.", json_mode=False, temperature=0.7,
                  max_tokens=8000):
        messages = [{"role": "system", "content": system_prompt}, {"role": "user", "content": user_prompt}]
        kwargs = {"model": model, "messages": messages, "temperature": temperature, "max_tokens": max_tokens,
                  "top_p": 1, "stop": None}
        if json_mode: kwargs["response_format"] = {"type": "json_object"}
        try:
            return self.client.chat.completions.create(**kwargs).choices[0].message.content
        except Exception as e:
            print(f"API Error: {e}")
            return None

    # --- 0. ADIM: CONTEXT BUILDER ---
    def agent_context_builder(self, user_topic):
        self.log("Context Builder", "Derinlikli tema ve karakterler oluşturuluyor...")
        coord_name = random.choice(["Elif", "Hakan", "Zeynep", "Mert", "Leyla"])
        system_prompt = "Sen IYACA Stratejistisin. Sadece JSON döndür."
        user_prompt = f"""
        KONU: "{user_topic}"
        VERİ: {IYACA_KNOWLEDGE_BASE}
        KOORDİNATÖR: {coord_name}
        GÖREV: Konuya uygun, derinlikli bir psikolojik/sosyal sorun ve hedef belirle.
        ÇIKTI: {{ "scenario_theme": "...", "conflict_core": "...", "coordinator_name": "{coord_name}" }}
        """
        response = self.call_groq("llama-3.3-70b-versatile", user_prompt, system_prompt, json_mode=True,
                                  temperature=0.9)
        return self.extract_json_from_text(response)

    # --- 1. ADIM: KURGU UZMANI ---
    def agent_narrative_designer(self, context):
        self.log("Kurgu Uzmanı", "10 Sahnelik Tam İskelet tasarlanıyor...")
        if not context: return None

        system_prompt = "Sen oyun tasarımcısısın. 10 bölümlük, dallanan bir yapı kurarsın."

        user_prompt = f"""
        BAĞLAM: {json.dumps(context, ensure_ascii=False)}

        GÖREV: 10 Sahneli akış şeması yaz.

        ZORUNLU AKIŞ:
        - Sahne 1-2: Giriş ve Tanışma (Lineer).
        - Sahne 3: BÜYÜK AYRIM (Yol A ve Yol B ayrılır).
        - Sahne 4-9: Olaylar gelişir. Her sahnede küçük krizler olur.
        - Sahne 10: Final ve Kapanış.

        ÇIKTI (JSON): {{ "beats": ["Sahne 1: ...", "Sahne 2: ...", ... "Sahne 10: ..."] }}
        """
        response = self.call_groq("llama-3.3-70b-versatile", user_prompt, system_prompt, json_mode=True,
                                  temperature=0.8)
        return self.extract_json_from_text(response)

    # --- 2. ADIM: MİMAR ---
    def agent_architect(self, beat_sheet):
        self.log("Mimar", "10 Sahneli detaylı metin yazılıyor...")
        if not beat_sheet: return None

        system_prompt = "Sen yaratıcı bir yazarsın. 10 sahnenin tamamını eksiksiz yazarsın."

        user_prompt = f"""
        Bu iskeleti TAM METİN haline getir.
        VERİ: {json.dumps(beat_sheet, ensure_ascii=False)}

        FORMAT KURALLARI (BUNA UY):
        Her sahneyi kesin çizgilerle ayır:

        --- SAHNE 1 ---
        ORTAM: ...
        DİYALOGLAR:
        [Konuşmacı]: ...
        SEÇİM: A) ..., B) ...

        --- SAHNE 2 ---
        ...

        (Bunu Sahne 10'a kadar devam ettir. Asla yarıda kesme.)
        """
        return self.call_groq("llama-3.3-70b-versatile", user_prompt, system_prompt, json_mode=False,
                              temperature=0.75, max_tokens=8000)

    # --- 3. ADIM: PSİKOLOG ---
    def agent_psychologist(self, draft_story):
        self.log("Psikolog", "Diyaloglar zenginleştiriliyor ve seçenekler derinleşiyor...")
        if not draft_story: return None

        system_prompt = "Sen senaryo doktorusun. Metni uzatır, derinleştirir ve duygusal hale getirirsin."

        user_prompt = f"""
        Bu metni düzenle:
        1. **DİYALOG ZİNCİRİ:** Her sahnede en az 3-4 karşılıklı konuşma (ping-pong) olsun. Sahne hemen bitmesin.
        2. **İÇ SES:** "Sen (İç Ses)" repliklerini artır. Karakterin korkularını görelim.
        3. **SEÇENEKLER:** Her karar anında MUTLAKA 2 veya 3 farklı, derinlikli seçenek yaz. Asla tek seçenek bırakma.

        METİN: {draft_story}
        """
        return self.call_groq("llama-3.3-70b-versatile", user_prompt, system_prompt, json_mode=False,
                              temperature=0.9, max_tokens=8000)

    # --- 4. AŞAMA: KODLAYICI (TAMAMLAMA GARANTİLİ) ---
    def agent_coder(self, rich_text, context_data):
        self.log("Kodlayıcı", "10 Sahnelik Diyalog Zinciri JSON'a dökülüyor...")
        if not rich_text: return None

        coord_name = context_data.get('coordinator_name', 'Koordinatör')

        system_prompt = """
        Sen bir Data Architect'sin.
        Görevin: Metnin TAMAMINI, 1. sahneden 10. sahneye kadar eksiksiz JSON'a çevirmek.
        Yarıda kesmek veya özetlemek YASAKTIR.
        """

        user_prompt = f"""
        HİKAYE:
        {rich_text}

        KOORDİNATÖR ADI: {coord_name}

        HEDEF ŞEMA (TypeScript):
        type ScenarioNode = {{
            id: string; (s1_info, s1_d1, s1_choice vb.)
            type: 'dialogue' | 'choice' | 'ending';
            speaker: string; ("Sen (İç Ses)", "Sen", "{coord_name} (Koordinatör)", "")
            text: string; (Metni aynen al)
            image: ""; 
            characterImage: "";
            next?: string;
            choices?: [ {{ "label": "...", "next": "...", "struggleCategory": "..." }} ]
        }}

        KRİTİK KURALLAR:
        1. **NODE ZİNCİRİ:** Her sahneyi parçala:
           - Info (Ortam) -> Dialogue 1 -> Dialogue 2 -> ... -> Choice -> (Sonraki Sahne Info).
           - Sahneleri birbirine `next` ile bağla. Zinciri koparma.

        2. **SAHNE SAYISI:** Metinde 10 sahne var. JSON çıktısında da 10 sahne olmalı.
           - s1_... den başlayıp s10_... a kadar git.

        3. **SEÇİMLER (CHOICE):**
           - `choices` dizisi EN AZ 2 seçenek içermeli.
           - Tek seçenek varsa, sen mantıklı bir "Vazgeç/Risk Al" seçeneği uydur.

        4. **BİTİŞ (ENDING):**
           - 10. Sahne bittikten sonra MUTLAKA `id: "ending"` olan, `type: "ending"` bir node ekle.
           - Son diyalog bu "ending" node'una bağlanmalı (`next: "ending"`).

        ÇIKTI FORMATI:
        {{
            "nodes": {{
                "s1_info": {{ ... }},
                "s1_d1": {{ ... }},
                ...
                "s10_d3": {{ "next": "ending" }},
                "ending": {{ "id": "ending", "type": "ending", "text": "Simülasyon Tamamlandı.", "speaker": "" }}
            }}
        }}
        """

        # Max tokens 8000 yaparak kesilmesini engelliyoruz
        response = self.call_groq("llama-3.3-70b-versatile", user_prompt, system_prompt, json_mode=True,
                                  temperature=0.1, max_tokens=8000)
        return self.extract_json_from_text(response)

    # --- 5. ADIM: EDİTÖR ---
    def agent_editor(self, text, context_data):
        self.log("Editör", "Metadata belirleniyor...")
        if not text: return {"title": "Hata"}

        theme = context_data.get('scenario_theme', '')
        user_prompt = f"""
        Metni ve temayı ({theme}) analiz et.
        JSON ver: {{ "title": "Çarpıcı Başlık", "description": "Merak uyandırıcı özet", "difficulty": "Zor", "estimatedTime": "20 dk" }}
        METİN: {text[:4000]}
        """
        response = self.call_groq("llama-3.1-8b-instant", user_prompt, "Asistan", json_mode=True, temperature=0.6)
        return self.extract_json_from_text(response)

    def run_pipeline(self):
        start_time = time.time()
        print(f"🚀 IYACA PRO SCENE ENGINE (True Branching Logic)")

        konu_girdisi = "Gönüllülükte yaşanan zorluklar"

        # 0. Context
        context = self.agent_context_builder(konu_girdisi)
        if not context: return
        print(f"🎯 Tema: {context.get('scenario_theme')} | Koordinatör: {context.get('coordinator_name')}")

        # 1. Beat Sheet
        beat_sheet = self.agent_narrative_designer(context)
        if not beat_sheet: return

        # 2. Taslak (Roman Modu)
        draft_story = self.agent_architect(beat_sheet)
        if not draft_story: return

        # 3. Derinlik (Psikolog)
        final_story = self.agent_psychologist(draft_story)
        if not final_story: return
        print(f"\n📄 Hikaye Metni Hazır ({len(final_story)} karakter)")

        # 4. JSON Graph (Mantık)
        graph_data = self.agent_coder(final_story, context)
        if not graph_data: return

        # 5. Metadata
        metadata = self.agent_editor(final_story, context)

        # 6. Final Birleştirme
        nodes_record = graph_data.get("nodes", {})
        start_node = list(nodes_record.keys())[0] if nodes_record else "s1_info"

        final_simulation = {
            "id": int(time.time()),
            "title": metadata.get("title", "Yeni Simülasyon"),
            "description": metadata.get("description", ""),
            "difficulty": metadata.get("difficulty", "Orta"),
            "estimatedTime": metadata.get("estimatedTime", "15 dk"),
            "startNodeId": start_node,
            "totalSteps": len(nodes_record),
            "nodes": nodes_record
        }

        with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
            json.dump(final_simulation, f, indent=4, ensure_ascii=False)

        print(f"\n✅ DOSYA HAZIR: {OUTPUT_FILE}")
        print(f"Toplam Node: {len(nodes_record)}")
        print(f"⏱️ Süre: {time.time() - start_time:.2f} saniye")


if __name__ == "__main__":
    if not GROQ_API_KEY:
        print("Lütfen GROQ_API_KEY ayarlayın.")
    else:
        generator = MultiAgentGenerator()
        generator.run_pipeline()