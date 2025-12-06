import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function POST(request: Request) {
    try {
        const { userId, simulationId, startNodeId } = await request.json();

        if (!userId || !simulationId) {
            return NextResponse.json({ error: 'Eksik veri' }, { status: 400 });
        }

        // Transaction kullanarak iki işlemi aynı anda yapalım (Güvenli)
        const resetTransaction = db.transaction(() => {
            // 1. İlerlemeyi sıfırla
            const stmtProgress = db.prepare(`
        UPDATE user_progress 
        SET progress = 0, current_node_id = ? 
        WHERE user_id = ? AND simulation_id = ?
      `);
            stmtProgress.run(startNodeId, userId, simulationId);

            // 2. Bu simülasyona ait zorlukları SİL
            const stmtStruggles = db.prepare(`
        DELETE FROM user_struggles 
        WHERE user_id = ? AND simulation_id = ?
      `);
            stmtStruggles.run(userId, simulationId);
        });

        resetTransaction();

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Sıfırlama hatası' }, { status: 500 });
    }
}