import time
import json
import os
import torch
import ollama
import gc
# DPM++ 2M Karras Scheduler (Detayların Efendisi)
from diffusers import AutoPipelineForText2Image, DPMSolverMultistepScheduler
from database import add_scenario

# --- DONANIM VE MODEL AYARLARI ---
TEXT_MODEL_ID = "llama3.1" # GROK/llama
# DEĞİŞİKLİK: Sıkıştırılmamış, tam sürüm RealVisXL. Fotorealizmde zirve.
IMAGE_MODEL_ID = "SG161222/RealVisXL_V4.0" # google collab

# RTX 4060 (8GB) Ayarları
DEVICE = "cuda"
DTYPE = torch.float16


def ensure_static_folder():
    if not os.path.exists("static"):
        os.makedirs("static")


def benchmark_text_generation(prompt, category):
    print(f"\n📝 [Llama 3.1] Senaryo yazılıyor... Kategori: {category}")
    start_time = time.time()

    system_prompt = """
    Sen bir senaryo yazarı yapay zekasın. JSON formatında kriz senaryosu yaz.
    JSON Şeması:
    {
        "scenario_title": "Başlık",
        "scenario_text": "Hikaye metni (Max 2 cümle)",
        "category": "Kategori Adı",
        "options": [
            {"id": "opt_A", "text": "Seçenek A", "impact_analysis": "Analiz A"},
            {"id": "opt_B", "text": "Seçenek B", "impact_analysis": "Analiz B"}
        ]
    }
    Sadece JSON döndür.
    """
    try:
        response = ollama.chat(model=TEXT_MODEL_ID, messages=[
            {'role': 'system', 'content': system_prompt},
            {'role': 'user', 'content': f"Konu: {prompt}. Kategori: {category}."}
        ], format='json')
        return json.loads(response['message']['content']), time.time() - start_time
    except:
        return None, 0


def benchmark_image_generation(pipeline, prompt, filename):
    print(f"📸 [RealVisXL Ultra] Yüksek çözünürlüklü işleniyor (Sabırlı olun): {filename}")
    start_time = time.time()

    gc.collect()
    torch.cuda.empty_cache()

    # --- ULTRA KALİTE AYARLARI ---
    # Prompt Mühendisliği: Doku (texture) ve ışık (lighting) kelimeleri eklendi.
    full_prompt = prompt + ", raw photo, 8k uhd, dslr, soft lighting, high quality, film grain, Fujifilm XT3, highly detailed skin texture, pores, subsurface scattering, sharp eyes, detailed iris, intricate details, depth of field"

    # Negative Prompt: Plastik görüntüyü engellemek için.
    neg_prompt = "(smooth skin, plastic, wax:1.3), (deformed iris, deformed pupils, bad eyes, semi-realistic, cgi, 3d, render, sketch, cartoon, drawing, anime), text, watermark, worst quality, low quality, jpeg artifacts, ugly, duplicate, morbid, mutilated, extra fingers, mutated hands, poorly drawn hands, poorly drawn face, mutation, deformed, blurry, dehydrated, bad anatomy, bad proportions, extra limbs, cloned face, disfigured, gross proportions, malformed limbs, missing arms, missing legs, extra arms, extra legs, fused fingers, too many fingers, long neck"

    image = pipeline(
        prompt=full_prompt,
        negative_prompt=neg_prompt,
        # KALİTE AYARLARI:
        num_inference_steps=40,  # 40 adımda detaylar tam oturur (Turbo'da 2 idi!)
        guidance_scale=7.5,  # Komuta tam sadakat
        width=1024,  # SDXL Native çözünürlük
        height=1024
    ).images[0]

    duration = time.time() - start_time
    save_path = f"static/{filename}"
    image.save(save_path)
    print(f"✅ [Görsel] Tamamlandı! Süre: {duration:.4f} saniye")
    return f"http://127.0.0.1:8000/{save_path}", duration


def run_benchmark():
    ensure_static_folder()

    print(f"🚀 IYACA AI BENCHMARK (ULTRA QUALITY)")
    print(f"🖥️  GPU: NVIDIA RTX 4060")
    print(f"🖼️  Model: RealVisXL V4.0 (Full)")
    print("-" * 60)

    print("⏳ Model yükleniyor (6GB+)...")
    try:
        # Hata almamak için variant='fp16' kaldırıldı, torch_dtype halleder.
        pipe = AutoPipelineForText2Image.from_pretrained(
            IMAGE_MODEL_ID,
            torch_dtype=DTYPE,
        )

        # DPM++ 2M Karras Scheduler: Detaylar için endüstri standardı
        pipe.scheduler = DPMSolverMultistepScheduler.from_config(
            pipe.scheduler.config,
            use_karras_sigmas=True,
            algorithm_type="dpmsolver++"
        )

        # 8GB VRAM Koruması
        pipe.enable_model_cpu_offload()
        pipe.enable_vae_slicing()

    except Exception as e:
        print(f"Model yükleme hatası: {e}")
        return

    scenarios_created = 0
    total_text_time = 0
    total_image_time = 0

    # Promptlar: Özellikle göz ve kağıt dokusu için güçlendirildi
    test_cases = [
        {
            "prompt": "Gönüllü Polonya'da markette dil sorunu yaşıyor.",
            "category": "Dil Bariyeri",
            "img_prompt": "close up shot of a stressed young volunteer inside a polish grocery store, looking directly at camera, angry cashier in background, realistic skin pores, sweat droplets, detailed anxious eyes, hyperrealistic, cinematic lighting",
            "file": "market_real.png"
        },
        {
            "prompt": "Gönüllü Cuma gecesi yurtta yalnız.",
            "category": "Sosyal İzolasyon",
            "img_prompt": "medium shot of a sad young person sitting alone on a bed in a dark dormitory room, looking down at phone screen, illuminating face, moonlight from window, moody atmosphere, detailed messy fabric texture of bed sheets, realistic shadows",
            "file": "room_real.png"
        },
        {
            "prompt": "Gönüllü proje teslimine yetişmeye çalışıyor.",
            "category": "Zaman Yönetimi",
            "img_prompt": "close up of a tired student working on a laptop at a messy desk, hands on head, stressed expression, extremely detailed crumpled paper texture on desk, pen marks, dust particles, warm lamp lighting, sharp focus on papers",
            "file": "study_real.png"
        }
    ]

    for case in test_cases:
        data, t_time = benchmark_text_generation(case["prompt"], case["category"])
        img_url, i_time = benchmark_image_generation(pipe, case["img_prompt"], case["file"])

        if data:
            data['visual_url'] = img_url
            add_scenario(data['scenario_title'], data['category'], data)
            total_text_time += t_time
            total_image_time += i_time
            scenarios_created += 1

    if scenarios_created > 0:
        avg_img = total_image_time / scenarios_created
        print(f"\n📊 ORTALAMA GÖRSEL SÜRESİ: {avg_img:.4f} sn (Ultra Kalite)")


if __name__ == "__main__":
    run_benchmark()