import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';

export async function POST(request: Request) {
    try {
        // Frontend'den gelen title ve prompt'u alıyoruz
        const { title, prompt } = await request.json();

        // Basit validasyon: İkisi de dolu olmalı
        if (!title || !prompt) {
            return NextResponse.json({ error: 'Başlık ve Prompt alanları zorunludur.' }, { status: 400 });
        }

        // 1. DOSYA İÇERİĞİNİ HAZIRLA
        // İsteğin: 1. satır Title, 2. satır (ve devamı) Prompt olsun.
        const fileContent = `${title}\n${prompt}`;

        // 2. DOSYAYI KAYDET (public/user_prompt.txt)
        const filePath = path.join(process.cwd(), 'public', 'user_prompt.txt');
        fs.writeFileSync(filePath, fileContent, 'utf-8');

        // 3. PYTHON SCRIPT ÇALIŞTIR
        const pythonScriptPath = path.join(process.cwd(), 'ai', 'run_pipeline.py');

        // Scripti çalıştır ve bekle
        await new Promise((resolve, reject) => {
            exec(`python "${pythonScriptPath}"`, (error, stdout, stderr) => {
                if (error) {
                    console.error(`Python Hatası: ${error.message}`);
                    reject(error);
                    return;
                }
                if (stderr) {
                    console.error(`Python Uyarısı: ${stderr}`);
                }
                console.log(`Python Çıktısı: ${stdout}`);
                resolve(stdout);
            });
        });

        return NextResponse.json({ success: true, message: 'Dosya yazıldı ve script başarıyla çalıştı' });

    } catch (error: any) {
        console.error(error);
        return NextResponse.json({ error: 'İşlem başarısız oldu: ' + error.message }, { status: 500 });
    }
}