import sqlite3
import json
from datetime import datetime

# Veritabanı dosyasının adı
DB_NAME = "iyaca_scenarios.db"


def init_db():
    """
    Veritabanını ve tabloyu oluşturur.
    ID artık SERIAL (Otomatik Artan Integer) mantığında çalışır.
    """
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()

    # ID kısmı: INTEGER PRIMARY KEY AUTOINCREMENT
    # full_json_content: Senaryonun tüm ağaç yapısını (node'lar, stats, görsel url) tutar.
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS scenarios (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT,
            category TEXT,
            full_json_content TEXT,
            created_at TIMESTAMP
        )
    """)

    conn.commit()
    conn.close()
    print(f"✅ Veritabanı '{DB_NAME}' hazır ve tablo kontrol edildi.")


def add_scenario(title, category, full_data_dict):
    """
    Yeni bir senaryo ekler.
    full_data_dict: Senaryonun tüm verisini (başlık, metin, görsel, graph) içeren Python sözlüğü.
    """
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()

    # Python sözlüğünü JSON string'e çevir (Türkçe karakterleri bozmadan)
    json_str = json.dumps(full_data_dict, ensure_ascii=False)

    # Zaman damgasını Python tarafında oluşturmak daha güvenlidir
    created_at = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    try:
        cursor.execute(
            "INSERT INTO scenarios (title, category, full_json_content, created_at) VALUES (?, ?, ?, ?)",
            (title, category, json_str, created_at)
        )

        # Oluşturulan ID'yi alalım
        new_id = cursor.lastrowid

        conn.commit()
        print(f"➕ Senaryo eklendi! DB ID: {new_id} | Başlık: {title}")
        return new_id

    except Exception as e:
        print(f"❌ HATA: Veritabanına ekleme başarısız. Sebep: {e}")
        return None
    finally:
        conn.close()


def delete_scenario(scenario_id):
    """
    ID'si verilen senaryoyu siler.
    """
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()

    try:
        cursor.execute("DELETE FROM scenarios WHERE id = ?", (scenario_id,))

        if cursor.rowcount > 0:
            print(f"🗑️ Senaryo silindi (ID: {scenario_id})")
            conn.commit()
            return True
        else:
            print(f"⚠️ Silinecek senaryo bulunamadı (ID: {scenario_id})")
            return False

    except Exception as e:
        print(f"❌ Silme işlemi başarısız: {e}")
        return False
    finally:
        conn.close()


def get_all_scenarios():
    """
    Tüm senaryoların özet listesini (ID, Başlık, Kategori, Görsel) getirir.
    Web sitesindeki 'Senaryo Seç' ekranı için kullanılır.
    """
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()

    # En yeniden en eskiye sırala
    cursor.execute("SELECT id, title, category, full_json_content, created_at FROM scenarios ORDER BY id DESC")
    rows = cursor.fetchall()
    conn.close()

    results = []
    for row in rows:
        try:
            # JSON içeriğinden görsel URL'sini çekip önizleme (thumbnail) yapalım
            content = json.loads(row[3])
            visual_url = content.get("visual_url", None)

            results.append({
                "id": row[0],
                "title": row[1],
                "category": row[2],
                "image_preview": visual_url,
                "created_at": row[4]
            })
        except json.JSONDecodeError:
            # Eğer DB'de bozuk JSON varsa patlamasın, pas geçsin
            continue

    return results


def get_scenario_detail(scenario_id):
    """
    Tek bir senaryonun TÜM detaylarını (oyun ağacı dahil) getirir.
    Web sitesinde senaryo başladığında kullanılır.
    """
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()

    cursor.execute("SELECT title, category, full_json_content FROM scenarios WHERE id = ?", (scenario_id,))
    row = cursor.fetchone()
    conn.close()

    if row:
        try:
            # Veritabanındaki metni tekrar Python sözlüğüne çevir
            full_data = json.loads(row[2])

            # API yanıtı için ID ve Başlığı da içine gömelim (Garanti olsun)
            full_data["id"] = scenario_id
            full_data["scenario_title"] = row[0]
            full_data["category"] = row[1]

            return full_data
        except json.JSONDecodeError:
            print(f"❌ HATA: ID {scenario_id} için JSON verisi bozuk.")
            return None
    else:
        return None


# Test Bölümü (Bu dosya doğrudan çalıştırılırsa veritabanını kurar)
if __name__ == "__main__":
    init_db()