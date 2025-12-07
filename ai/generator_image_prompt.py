# visual_asset_generator.py

import json
import os
from groq import Groq
import time
import re
import dotenv
import io
import os
import sys
from pathlib import Path

# .env.local dosyasından API anahtarını yükle
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8')

current_dir = Path(__file__).parent
env_path = os.path.join(current_dir, ".env.local")
dotenv.load_dotenv(env_path)

GROQ_API_KEY = os.getenv("GROQ_API_KEY")

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

class VisualAssetGenerator:
    def __init__(self, json_path=os.path.join(BASE_DIR, "..", "public", "ai", "iyaca_frontend_ready.json")):
        self.client = Groq(api_key=GROQ_API_KEY)
        self.json_path = json_path
        self.log("Sistem", f"JSON Yolu: {self.json_path}")

    def log(self, agent_name, message):
        print(f"\n⚡ [{agent_name}]: {message}")

    def load_scenario(self):
        try:
            with open(self.json_path, 'r', encoding='utf-8') as f:
                return json.load(f)
        except FileNotFoundError:
            self.log("HATA", f"Senaryo dosyası bulunamadı: {self.json_path}")
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
            self.log("API HATA", f"Groq API'den yanıt alınamadı: {e}")
            return None

    def extract_json_from_text(self, text):
        try:
            text = re.sub(r'```json\s*', '', text)
            text = re.sub(r'```\s*', '', text)
            match = re.search(r'(\{.*\})', text, re.DOTALL)
            if match: return json.loads(match.group(1))
            return json.loads(text)
        except:
            return None

    def agent_visual_architect(self, scenario_data):
        self.log("Görsel Mimar", "Sadece SAHNE ve ORTAM analizleri yapılıyor...")
        nodes = scenario_data.get('nodes', {})

        # Çıktı yapısını hazırlıyoruz
        visual_assets = {
            "sahne_gorselleri": {}
        }

        # Ortam görselleri için sadece 'info' veya 'ending' node'larını filtrele
        # (Genelde sahne başları _info ile biter)
        info_nodes = {k: v for k, v in nodes.items() if
                      k.endswith('_d1') or v.get('type') == 'ending'}

        total_scenes = len(info_nodes)
        current_count = 0

        for node_id, node in info_nodes.items():
            current_count += 1
            print(f"   ...İşleniyor ({current_count}/{total_scenes}): {node_id}")

            # --- Ortam Görseli (Background) ---
            system_prompt_scene = "Sen Hollywood set tasarımcısısın. Ortam metnini al ve atmosferi yansıtan, ultra detaylı, dramatik bir görsel prompt'a çevir."

            user_prompt_scene = f"""
            GÖREV: Aşağıdaki sahne metnini analiz et ve FLUX/Midjourney için tek bir İngilizce görsel prompt yaz.
            KESİN KURAL: Oluşturacağın prompt sahne metnindeki 'environment' key'inin karşılığını tam olarak betimlemek zorunda. Orada yazan ortamı her şeyin üstünde 1. önceliğin almalısın
            KURALLAR:
            1. Sadece mekanı ve atmosferi betimle (Işık, renkler, dokular).
            2. İnsan yüzlerine odaklanma, genel plan (wide shot) olsun.
            3. Çıktı sadece İngilizce prompt cümlesi olsun.
            
            KESİN KURAL: Oluşturacağın prompt sahne metnindeki 'environment' key'inin karşılığını tam olarak betimlemek zorunda. Orada yazan ortamı her şeyin üstünde 1. önceliğin almalısın

            METİN: {node.get('text', '')}
            """

            response_scene = self.call_groq("llama-3.3-70b-versatile", user_prompt_scene, system_prompt_scene,
                                            json_mode=False, temperature=0.7)

            if response_scene:
                # Elde edilen promptu sözlüğe kaydediyoruz
                visual_assets["sahne_gorselleri"][node_id] = {
                    "ortam_prompt": response_scene.strip()
                }

        return visual_assets

    def generate_assets_json(self):
        scenario_data = self.load_scenario()
        if not scenario_data:
            return

        final_prompts = self.agent_visual_architect(scenario_data)

        if final_prompts:
            # output_path = "../public/ai/visual_prompts_for_assets.json"
            output_path = os.path.join(BASE_DIR, "..", "public", "ai", "visual_prompts_for_assets.json")
            # Klasör yoksa oluştur (Opsiyonel güvenlik)
            os.makedirs(os.path.dirname(output_path), exist_ok=True)

            with open(output_path, 'w', encoding='utf-8') as f:
                json.dump(final_prompts, f, indent=4, ensure_ascii=False)

            self.log("BAŞARILI", f"Sahne promptları kaydedildi: {output_path}")
            self.log("SONRAKİ ADIM",
                     "Şimdi image_generator.py dosyasını çalıştırarak bu promptları görsele çevirebilirsiniz.")


# --- ÇALIŞTIRMA ---
if __name__ == "__main__":
    if not GROQ_API_KEY:
        print("Lütfen GROQ_API_KEY'i .env.local dosyasına ekleyin.")
    else:
        # generator = VisualAssetGenerator(json_path="../public/ai/iyaca_frontend_ready.json")
        generator = VisualAssetGenerator(json_path=os.path.join(BASE_DIR, "..", "public", "ai", "iyaca_frontend_ready.json"))
        generator.generate_assets_json()