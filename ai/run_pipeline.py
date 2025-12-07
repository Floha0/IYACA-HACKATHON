import subprocess
import sys
from pathlib import Path
import io
import os

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8')

def run_script(script_name):
    # Şu anki dosyanın (run_pipeline.py) bulunduğu klasörü al
    base_dir = Path(__file__).parent

    # Çalıştırılacak scriptin tam yolunu oluştur (örn: .../ai/generator.py)
    #script_path = base_dir / script_name
    script_path = os.path.join(base_dir, script_name)

    print(f"🚀 {script_name} çalıştırılıyor...")
    print(f"📂 Dosya Yolu: {script_path}")

    try:
        # Scripti tam yol ile çalıştır
        result = subprocess.run([sys.executable, str(script_path)], check=True)
        print(f"✅ {script_name} başarıyla tamamlandı.\n")
    except subprocess.CalledProcessError as e:
        print(f"❌ HATA: {script_name} çalışırken bir sorun oluştu.")
        print(f"Hata Kodu: {e.returncode}")
        sys.exit(1)
    except FileNotFoundError:
        print(f"❌ HATA: {script_name} dosyası belirtilen yolda bulunamadı.")
        sys.exit(1)

if __name__ == "__main__":
    scripts = [
        "generator.py",
        "generator_image_prompt.py",
        "generator_image.py"
    ]

    print("--- OTOMATİK IYACA ÜRETİM HATTI BAŞLATILIYOR ---\n")

    for script in scripts:
        run_script(script)

    print("🎉 TÜM İŞLEMLER BAŞARIYLA TAMAMLANDI!")