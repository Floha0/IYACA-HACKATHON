import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'gonulver.db');
const db = new Database(dbPath);

const initDb = () => {
    // 1. Kullanıcılar Tablosu
    db.exec(`
        CREATE TABLE IF NOT EXISTS users (
                                             id INTEGER PRIMARY KEY AUTOINCREMENT,
                                             name TEXT,
                                             email TEXT UNIQUE,
                                             password TEXT
        )
    `);

    // 2. YENİ: İlerleme Tablosu
    // user_id ve simulation_id ikilisi benzersiz (UNIQUE) olmalı
    db.exec(`
    CREATE TABLE IF NOT EXISTS user_progress (
      user_id INTEGER,
      simulation_id INTEGER,
      current_node_id TEXT,
      progress INTEGER,
      last_played TEXT,
      PRIMARY KEY (user_id, simulation_id),
      FOREIGN KEY(user_id) REFERENCES users(id)
    )
  `);
};

initDb();

export default db;