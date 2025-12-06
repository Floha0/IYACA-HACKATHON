import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function POST(request: Request) {
    try {
        const { userId, simulationId, currentNodeId, progress } = await request.json();

        if (!userId || !simulationId) {
            return NextResponse.json({ error: 'Eksik veri' }, { status: 400 });
        }

        const lastPlayed = new Date().toISOString(); // Şu anki zaman

        // SQL: Varsa güncelle, yoksa ekle (UPSERT mantığı)
        const stmt = db.prepare(`
            INSERT INTO user_progress (user_id, simulation_id, current_node_id, progress, last_played)
            VALUES (?, ?, ?, ?, ?)
                ON CONFLICT(user_id, simulation_id) 
      DO UPDATE SET
                current_node_id = excluded.current_node_id,
                             progress = excluded.progress,
                             last_played = excluded.last_played
        `);

        stmt.run(userId, simulationId, currentNodeId, progress, lastPlayed);

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Kaydetme hatası' }, { status: 500 });
    }
}