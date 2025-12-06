import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function POST(request: Request) {
    try {
        const { name, email, password } = await request.json();

        // Basit validasyon
        if (!email || !password || !name) {
            return NextResponse.json({ error: 'Tüm alanları doldurun.' }, { status: 400 });
        }

        // SQL ile ekle
        const stmt = db.prepare('INSERT INTO users (name, email, password) VALUES (?, ?, ?)');
        const info = stmt.run(name, email, password);

        return NextResponse.json({ success: true, userId: info.lastInsertRowid });
    } catch (error: any) {
        if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
            return NextResponse.json({ error: 'Bu e-posta zaten kayıtlı.' }, { status: 409 });
        }
        return NextResponse.json({ error: 'Kayıt hatası oluştu.' }, { status: 500 });
    }
}