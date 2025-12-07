import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';

export async function POST(request: Request) {
    try {
        const { prompt } = await request.json();

        if (!prompt) {
            return NextResponse.json({ error: 'Prompt boş olamaz' }, { status: 400 });
        }

        // 1. DOSYAYI KAYDET (public/user_prompt.txt)
        const filePath = path.join(process.cwd(), 'public', 'user_prompt.txt');
        fs.writeFileSync(filePath, prompt, 'utf-8');

        // PYTHON SCRIPT
        const pythonScriptPath = path.join(process.cwd(), 'ai', 'generator.py');

        // Run Python
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

        return NextResponse.json({ success: true, message: 'Dosya yazıldı ve script çalıştı' });

    } catch (error: any) {
        console.error(error);
        return NextResponse.json({ error: 'İşlem başarısız oldu: ' + error.message }, { status: 500 });
    }
}