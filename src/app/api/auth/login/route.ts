import { NextResponse } from 'next/server';
import db from '@/lib/db';
import bcrypt from 'bcryptjs'; // YENİ

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json();

        // 1. Önce sadece Email ile kullanıcıyı bul
        const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
        const user = stmt.get(email) as any;

        // Kullanıcı yoksa hata ver
        if (!user) {
            return NextResponse.json({ error: 'Hatalı e-posta veya şifre.' }, { status: 401 });
        }

        // 2. Şifreyi Kontrol Et (Hash Karşılaştırma)
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return NextResponse.json({ error: 'Hatalı e-posta veya şifre.' }, { status: 401 });
        }

        // 3. Güvenlik: Şifreyi (hashli olsa bile) frontend'e gönderme
        const { password: _, ...userWithoutPassword } = user;

        return NextResponse.json({ success: true, user: userWithoutPassword });

    } catch (error) {
        return NextResponse.json({ error: 'Bir hata oluştu.' }, { status: 500 });
    }
}