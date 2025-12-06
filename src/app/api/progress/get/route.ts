import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function POST(request: Request) {
    // GET yerine POST kullanıyoruz çünkü body içinde userId göndermek daha kolay (MVP için)
    const { userId } = await request.json();

    if (!userId) {
        return NextResponse.json({ error: 'Kullanıcı yok' }, { status: 400 });
    }

    const stmt = db.prepare('SELECT * FROM user_progress WHERE user_id = ? ORDER BY last_played DESC');
    const progressList = stmt.all(userId);

    return NextResponse.json({ success: true, data: progressList });
}