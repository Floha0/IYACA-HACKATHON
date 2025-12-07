import os
import json
import requests
import replicate
import re
from dotenv import load_dotenv
import io
import os
import sys
from pathlib import Path

# .env.local dosyasından REPLICATE_API_TOKEN'ı çeker

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8')

current_dir = Path(__file__).parent
env_path = os.path.join(current_dir, ".env.local")
load_dotenv(env_path)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
OUTPUT_FILE = os.path.join(BASE_DIR, "..", "public", "iyaca_frontend_ready.json")

# KONFIGÜRASYON
INPUT_PROMPTS_FILE = os.path.join(BASE_DIR, "..", "public", "ai", "visual_prompts_for_assets.json")
MAIN_SCENARIO_FILE = os.path.join(BASE_DIR, "..", "public", "ai", "iyaca_frontend_ready.json")
BASE_OUTPUT_DIR = os.path.join(BASE_DIR, "..", "public", "ai", "assets")
MODEL_ID = "black-forest-labs/flux-schnell"


class ImageGenerator:
    def __init__(self):
        if not os.getenv("REPLICATE_API_TOKEN"):
            raise ValueError("REPLICATE_API_TOKEN bulunamadı! .env dosyanızı kontrol edin.")

    def sanitize_filename(self, name):
        """Dosya ve klasör isimlerini güvenli hale getirir."""
        name = name.lower()
        name = name.replace("ğ", "g").replace("ü", "u").replace("ş", "s").replace("ı", "i").replace("ö", "o").replace(
            "ç", "c")
        name = re.sub(r'[^a-z0-9\-_]', '_', name)
        return name

    def get_scenario_title_slug(self):
        """Ana JSON dosyasından başlığı okuyup klasör ismi üretir."""
        try:
            with open(MAIN_SCENARIO_FILE, 'r', encoding='utf-8') as f:
                data = json.load(f)
                title = data.get("title", "default_scenario")
                return self.sanitize_filename(title)
        except Exception:
            return "default_scenario"

    def download_image(self, url, save_path):
        """URL'den resmi indirir."""
        try:
            response = requests.get(url)
            if response.status_code == 200:
                with open(save_path, 'wb') as f:
                    f.write(response.content)
                print(f"✅ Kaydedildi: {save_path}")
                return True
        except Exception as e:
            print(f"❌ İndirme Hatası: {e}")
            return False

    def generate_image(self, prompt, aspect_ratio="16:9"):
        """Replicate ile resim üretir."""
        print(f"🎨 Üretiliyor: {prompt[:50]}...")
        try:
            output = replicate.run(
                MODEL_ID,
                input={
                    "prompt": prompt,
                    "go_fast": True,
                    "megapixels": "1",
                    "num_outputs": 1,
                    "aspect_ratio": aspect_ratio,
                    "output_format": "png",
                    "output_quality": 90
                }
            )
            return output[0] if output else None
        except Exception as e:
            print(f"⚠️ Replicate Hatası: {e}")
            return None

    def run(self):
        print("🚀 SAHNE GÖRSEL MOTORU BAŞLATILIYOR (Karakterler İptal Edildi)")

        # 1. Dosyaları Yükle
        try:
            with open(INPUT_PROMPTS_FILE, 'r', encoding='utf-8') as f:
                prompts_data = json.load(f)
            with open(MAIN_SCENARIO_FILE, 'r', encoding='utf-8') as f:
                scenario_data = json.load(f)
        except FileNotFoundError:
            print("❌ Gerekli JSON dosyaları bulunamadı. Lütfen dosya yollarını kontrol edin.")
            return

        # 2. Klasör Yapısını Kur
        scenario_slug = self.get_scenario_title_slug()
        scenario_dir = f"{BASE_OUTPUT_DIR}/{scenario_slug}"
        scenes_dir = f"{scenario_dir}/scenes"

        # Sadece scenes klasörü oluşturuyoruz
        os.makedirs(scenes_dir, exist_ok=True)

        print(f"📂 Hedef Klasör: {scenes_dir}")

        # --- 3. SAHNE GÖRSELLERİ (Smart Background Mapping) ---
        print("\n--- 🏙️ SAHNE GÖRSELLERİ ÜRETİLİYOR ---")

        # Sahne Prefix'i (s1) -> Resim Yolu haritası
        scene_image_map = {}

        scene_prompts = prompts_data.get("sahne_gorselleri", {})

        for node_id, data in scene_prompts.items():
            # node_id: "s1_info" -> scene_prefix: "s1"
            scene_prefix = node_id.split('_')[0]

            # Bu sahne için zaten resim ürettiysek tekrar üretme
            if scene_prefix in scene_image_map:
                continue

            prompt = data.get("ortam_prompt")
            if not prompt: continue

            filename = f"{scene_prefix}.png"  # Örn: s1.png
            file_path = f"{scenes_dir}/{filename}"
            # Frontend'de public klasörü root olduğu için yol /ai/assets/... şeklinde olmalı
            web_path = f"/ai/assets/{scenario_slug}/scenes/{filename}"

            # Dosya yoksa üret, varsa geç
            if not os.path.exists(file_path):
                url = self.generate_image(prompt, aspect_ratio="16:9")
                if url: self.download_image(url, file_path)
            else:
                print(f"⏩ Mevcut: {filename}")

            # Haritaya kaydet
            scene_image_map[scene_prefix] = web_path

        # --- 4. ANA JSON GÜNCELLE (Sadece Ortam Fotoğrafları) ---
        print("\n💾 SENARYO DOSYASI GÜNCELLENİYOR...")
        nodes = scenario_data.get("nodes", {})

        for node_id, node in nodes.items():
            # Node ID'sinin başındaki sahne kodunu al (s1_d1 -> s1)
            parts = node_id.split('_')
            if not parts: continue

            current_scene_prefix = parts[0]

            # Eğer bu sahne için bir arka plan resmi varsa ata
            if current_scene_prefix in scene_image_map:
                node["image"] = scene_image_map[current_scene_prefix]

            # Karakter resmi alanını boş string olarak ayarla (Frontend hatası olmaması için)
            # node["characterImage"] = ""

        scenario_data["nodes"] = nodes

        with open(MAIN_SCENARIO_FILE, 'w', encoding='utf-8') as f:
            json.dump(scenario_data, f, indent=4, ensure_ascii=False)

        print("✅ Başarıyla tamamlandı! (Sadece ortam görselleri işlendi)")


if __name__ == "__main__":
    generator = ImageGenerator()
    generator.run()