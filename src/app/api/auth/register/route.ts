import { NextResponse } from 'next/server';
import db from '@/lib/db';
import bcrypt from 'bcryptjs'; // YENİ

export async function POST(request: Request) {
    try {
        const { name, email, password } = await request.json();

        if (!email || !password || !name) {
            return NextResponse.json({ error: 'Tüm alanları doldurun.' }, { status: 400 });
        }

        // 1. Şifreyi Hashle (Güvenlik Katmanı)
        // 10 turluk bir salt işlemi uygular, kırılması çok zordur.
        const hashedPassword = await bcrypt.hash(password, 10);

        // 2. SQL ile ekle (Artık password yerine hashedPassword kaydediyoruz)
        const stmt = db.prepare('INSERT INTO users (name, email, password) VALUES (?, ?, ?)');
        const info = stmt.run(name, email, hashedPassword);

        return NextResponse.json({ success: true, userId: info.lastInsertRowid });
    } catch (error: any) {
        if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
            return NextResponse.json({ error: 'Bu e-posta zaten kayıtlı.' }, { status: 409 });
        }
        return NextResponse.json({ error: 'Kayıt hatası oluştu.' }, { status: 500 });
    }
}