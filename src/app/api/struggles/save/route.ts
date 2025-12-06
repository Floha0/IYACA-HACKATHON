import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function POST(request: Request) {
    try {
        const { userId, category } = await request.json();

        if (!userId || !category) {
            return NextResponse.json({ error: 'Eksik veri' }, { status: 400 });
        }

        // SQL: Varsa sayıyı 1 artır, yoksa yeni kayıt aç (1 olarak)
        const stmt = db.prepare(`
      INSERT INTO user_struggles (user_id, category, count)
      VALUES (?, ?, 1)
      ON CONFLICT(user_id, category) 
      DO UPDATE SET count = count + 1
    `);

        stmt.run(userId, category);

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'DB hatası' }, { status: 500 });
    }
}