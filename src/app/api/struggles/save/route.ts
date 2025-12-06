import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function POST(request: Request) {
    try {
        // simulationId eklendi
        const { userId, simulationId, category } = await request.json();

        if (!userId || !category || !simulationId) {
            return NextResponse.json({ error: 'Eksik veri' }, { status: 400 });
        }

        // SQL Güncellendi: simulation_id eklendi
        const stmt = db.prepare(`
            INSERT INTO user_struggles (user_id, simulation_id, category, count)
            VALUES (?, ?, ?, 1)
                ON CONFLICT(user_id, simulation_id, category) 
      DO UPDATE SET count = count + 1
        `);

        stmt.run(userId, simulationId, category);

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'DB hatası' }, { status: 500 });
    }
}