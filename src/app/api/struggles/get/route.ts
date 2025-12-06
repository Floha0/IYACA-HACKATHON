import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function POST(request: Request) {
    const { userId } = await request.json();

    if (!userId) {
        return NextResponse.json({ error: 'Kullanıcı yok' }, { status: 400 });
    }

    // GÜNCELLENDİ: Simülasyon ayrımı yapmaksızın kategorileri topla
    const stmt = db.prepare(`
    SELECT category, SUM(count) as count 
    FROM user_struggles 
    WHERE user_id = ? 
    GROUP BY category 
    ORDER BY count DESC
  `);

    const struggles = stmt.all(userId);

    return NextResponse.json({ success: true, data: struggles });
}