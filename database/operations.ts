import * as SQLite from 'expo-sqlite';
import { Marker, MarkerImage } from '../types';

export const addMarker = async (
  db: SQLite.SQLiteDatabase,
  latitude: number,
  longitude: number
): Promise<number> => {
  try {
    const result = await db.runAsync(
      'INSERT INTO markers (latitude, longitude) VALUES (?, ?)',
      [latitude, longitude]
    );
    if (__DEV__) {
      console.log('[DB] Marker added, id:', result.lastInsertRowId);
    }
    return result.lastInsertRowId;
  } catch (error) {
    console.error('[DB] Error adding marker:', error);
    throw error;
  }
};

export const deleteMarker = async (
  db: SQLite.SQLiteDatabase,
  id: number
): Promise<void> => {
  try {
    await db.runAsync('DELETE FROM markers WHERE id = ?', [id]);
    if (__DEV__) {
      console.log('[DB] Marker deleted, id:', id);
    }
  } catch (error) {
    console.error('[DB] Error deleting marker:', error);
    throw error;
  }
};

export const getMarkers = async (
  db: SQLite.SQLiteDatabase
): Promise<Marker[]> => {
  try {
    const rows = await db.getAllAsync<Marker>(
      'SELECT * FROM markers ORDER BY created_at DESC'
    );
    if (__DEV__) {
      console.log('[DB] Fetched markers, count:', rows.length);
    }
    return rows;
  } catch (error) {
    console.error('[DB] Error fetching markers:', error);
    throw error;
  }
};

export const addImage = async (
  db: SQLite.SQLiteDatabase,
  markerId: number,
  uri: string
): Promise<void> => {
  try {
    await db.runAsync(
      'INSERT INTO marker_images (marker_id, uri) VALUES (?, ?)',
      [markerId, uri]
    );
    if (__DEV__) {
      console.log('[DB] Image added for marker id:', markerId);
    }
  } catch (error) {
    console.error('[DB] Error adding image:', error);
    throw error;
  }
};

export const deleteImage = async (
  db: SQLite.SQLiteDatabase,
  id: number
): Promise<void> => {
  try {
    await db.runAsync('DELETE FROM marker_images WHERE id = ?', [id]);
    if (__DEV__) {
      console.log('[DB] Image deleted, id:', id);
    }
  } catch (error) {
    console.error('[DB] Error deleting image:', error);
    throw error;
  }
};

export const getMarkerImages = async (
  db: SQLite.SQLiteDatabase,
  markerId: number
): Promise<MarkerImage[]> => {
  try {
    const rows = await db.getAllAsync<MarkerImage>(
      'SELECT * FROM marker_images WHERE marker_id = ? ORDER BY created_at ASC',
      [markerId]
    );
    if (__DEV__) {
      console.log('[DB] Fetched images for marker', markerId, ', count:', rows.length);
    }
    return rows;
  } catch (error) {
    console.error('[DB] Error fetching images:', error);
    throw error;
  }
};
