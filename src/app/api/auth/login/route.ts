import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function POST(request: Request) {
    const { email, password } = await request.json();

    // SQL ile kullanıcıyı bul (Düz metin şifre kontrolü)
    const stmt = db.prepare('SELECT * FROM users WHERE email = ? AND password = ?');
    const user = stmt.get(email, password);

    if (!user) {
        return NextResponse.json({ error: 'Hatalı e-posta veya şifre.' }, { status: 401 });
    }

    // Kullanıcı bulundu, frontend'e bilgilerini dön
    return NextResponse.json({ success: true, user });
}