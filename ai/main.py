from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Any, Dict
import sqlite3
import json
from database import DB_NAME

app = FastAPI(
    title="IYACA AI Scenario Engine API",
    description="Llama 3.1 ve RealVisXL ile üretilmiş, çok katmanlı simülasyon senaryolarını sunar.",
    version="3.0"
)

# 1. CORS Ayarları (Web sitesinin erişimi için)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 2. Resimlerin Sunulması
app.mount("/static", StaticFiles(directory="static"), name="static")


# --- Veri Modelleri (ŞEMALAR) ---

class ScenarioListItem(BaseModel):
    id: int
    title: str
    category: str
    image_preview: Optional[str] = None  # Kartta görünecek küçük resim


class ScenarioDetail(BaseModel):
    """
    Detay sayfasında döneceğimiz veri yapısı.
    ARTIK DAHA KARMAŞIK: Tek bir metin yerine, tüm oyun ağacını (Graph) dönüyoruz.
    """
    id: int
    scenario_title: str
    category: str
    visual_url: Optional[str] = None
    # BURASI KRİTİK: Frontend bu listeyi alıp, node'lar (id ve next_id) arasında gezecek.
    full_graph: List[Dict[str, Any]]


# --- API Uç Noktaları ---

@app.get("/")
def read_root():
    return {
        "status": "Online",
        "system": "IYACA AI Engine (Running on RTX 4060)",
        "endpoints": ["/scenarios", "/scenarios/{id}"]
    }


@app.get("/scenarios", response_model=List[ScenarioListItem])
def get_scenario_list():
    """
    Ana sayfada gösterilecek senaryo kartlarını getirir.
    """
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()

    # En son eklenen en başta görünsün (ORDER BY id DESC)
    cursor.execute("SELECT id, title, category, full_json_content FROM scenarios ORDER BY id DESC")
    rows = cursor.fetchall()
    conn.close()

    results = []
    for row in rows:
        try:
            # DB'deki JSON metnini objeye çevir
            content = json.loads(row[3])

            # Görsel URL'sini çek (Yoksa None olsun)
            visual_url = content.get("visual_url", None)

            results.append({
                "id": row[0],
                "title": row[1],
                "category": row[2],
                "image_preview": visual_url
            })
        except json.JSONDecodeError:
            # Eğer veritabanında bozuk bir satır varsa API çökmesin, o satırı atlasın
            print(f"⚠️ Hata: ID {row[0]} bozuk veri içeriyor, atlandı.")
            continue

    return results


@app.get("/scenarios/{scenario_id}", response_model=ScenarioDetail)
def get_scenario_detail(scenario_id: int):
    """
    Seçilen senaryonun TÜM oynanış verisini (Graph) getirir.
    Frontend bu veriyi aldıktan sonra bir daha backend'e istek atmaz, oyunu kendi içinde oynatır.
    """
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()

    cursor.execute("SELECT title, category, full_json_content FROM scenarios WHERE id = ?", (scenario_id,))
    row = cursor.fetchone()
    conn.close()

    if row:
        try:
            content = json.loads(row[2])

            # Response Modelimize uygun hale getiriyoruz
            return {
                "id": scenario_id,
                "scenario_title": row[0],  # DB Sütunundan
                "category": row[1],  # DB Sütunundan
                "visual_url": content.get("visual_url"),
                "full_graph": content.get("full_graph", [])  # Graph verisi burada
            }
        except json.JSONDecodeError:
            raise HTTPException(status_code=500, detail="Veritabanı verisi bozuk.")
    else:
        raise HTTPException(status_code=404, detail="Senaryo bulunamadı")


if __name__ == "__main__":
    import uvicorn

    # Hackathon ortamında herkesin erişebilmesi için 0.0.0.0 kullanıyoruz
    uvicorn.run(app, host="0.0.0.0", port=8000)