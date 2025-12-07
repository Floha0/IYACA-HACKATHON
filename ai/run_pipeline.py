import subprocess
import sys


def run_script(script_name):
    print(f"🚀 {script_name} çalıştırılıyor...")
    try:
        # Scripti çalıştır ve hata kodu dönerse yakala
        result = subprocess.run([sys.executable, script_name], check=True)
        print(f"✅ {script_name} başarıyla tamamlandı.\n")
    except subprocess.CalledProcessError as e:
        print(f"❌ HATA: {script_name} çalışırken bir sorun oluştu.")
        print(f"Hata Kodu: {e.returncode}")
        sys.exit(1)  # İşlemi durdur
    except FileNotFoundError:
        print(f"❌ HATA: {script_name} dosyası bulunamadı.")
        sys.exit(1)


if __name__ == "__main__":
    # Çalıştırma sırası
    scripts = [
        "generator.py",
        "generator_image_prompt.py",
        "generator_image.py"
    ]

    print("--- OTOMATİK IYACA ÜRETİM HATTI BAŞLATILIYOR ---\n")

    for script in scripts:
        run_script(script)

    print("🎉 TÜM İŞLEMLER BAŞARIYLA TAMAMLANDI!")