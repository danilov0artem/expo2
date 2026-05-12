import * as SQLite from 'expo-sqlite';

const DATABASE_NAME = 'markers.db';
const DATABASE_VERSION = 1;

let dbInstance: SQLite.SQLiteDatabase | null = null;

export const initDatabase = async (): Promise<SQLite.SQLiteDatabase> => {
  try {
    if (dbInstance) {
      return dbInstance;
    }

    const db = await SQLite.openDatabaseAsync(DATABASE_NAME);

    await db.execAsync(`
      PRAGMA journal_mode = WAL;
      PRAGMA foreign_keys = ON;

      CREATE TABLE IF NOT EXISTS markers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        latitude REAL NOT NULL,
        longitude REAL NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS marker_images (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        marker_id INTEGER NOT NULL,
        uri TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (marker_id) REFERENCES markers (id) ON DELETE CASCADE
      );
    `);

    if (__DEV__) {
      console.log('[DB] Database initialized successfully, version:', DATABASE_VERSION);
    }

    dbInstance = db;
    return db;
  } catch (error) {
    console.error('[DB] Error initializing database:', error);
    throw error;
  }
};

export const closeDatabase = async (): Promise<void> => {
  try {
    if (dbInstance) {
      await dbInstance.closeAsync();
      dbInstance = null;
      if (__DEV__) {
        console.log('[DB] Database connection closed');
      }
    }
  } catch (error) {
    console.error('[DB] Error closing database:', error);
  }
};
