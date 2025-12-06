import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function POST(request: Request) {
    const { userId } = await request.json();

    if (!userId) {
        return NextResponse.json({ error: 'Kullanıcı yok' }, { status: 400 });
    }

    // Kullanıcının tüm zorlandığı alanları getir
    const stmt = db.prepare('SELECT category, count FROM user_struggles WHERE user_id = ? ORDER BY count DESC');
    const struggles = stmt.all(userId);

    return NextResponse.json({ success: true, data: struggles });
}