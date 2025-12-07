import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';

export async function POST(request: Request) {
    try {
        // Frontend'den gelen title, prompt ve MODE bilgisini alıyoruz
        const { title, prompt, mode } = await request.json();

        // Basit validasyon
        if (!title || !prompt) {
            return NextResponse.json({ error: 'Başlık ve Prompt alanları zorunludur.' }, { status: 400 });
        }

        // 1. DOSYA İÇERİĞİNİ HAZIRLA (user_prompt.txt)
        const fileContent = `${title}\n${prompt}`;
        const filePath = path.join(process.cwd(), 'public', 'user_prompt.txt');
        fs.writeFileSync(filePath, fileContent, 'utf-8');

        // 2. HANGİ SCRIPT ÇALIŞACAK?
        // Eğer mode 'experimental' ise pipeline çalışır (Resimli), değilse sadece generator (Metin)
        const scriptName = mode === 'experimental' ? 'run_pipeline.py' : 'generator.py';

        const pythonScriptPath = path.join(process.cwd(), 'ai', scriptName);

        console.log(`📡 Mod: ${mode} | Çalıştırılan Script: ${scriptName}`);

        // 3. PYTHON SCRIPT ÇALIŞTIR
        await new Promise((resolve, reject) => {
            exec(`python "${pythonScriptPath}"`, (error, stdout, stderr) => {
                if (error) {
                    console.error(`Python Hatası: ${error.message}`);
                    reject(error);
                    return;
                }
                if (stderr) {
                    // Python warninglerini logla ama hata olarak döndürme
                    console.log(`Python Uyarısı: ${stderr}`);
                }
                console.log(`Python Çıktısı: ${stdout}`);
                resolve(stdout);
            });
        });

        return NextResponse.json({
            success: true,
            message: `İşlem tamamlandı (${mode === 'experimental' ? 'Tam Pipeline' : 'Hızlı Üretim'})`
        });

    } catch (error: any) {
        console.error(error);
        return NextResponse.json({ error: 'İşlem başarısız oldu: ' + error.message }, { status: 500 });
    }
}