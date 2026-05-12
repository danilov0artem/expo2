import React, { createContext, useContext, useEffect, useState } from 'react';
import * as SQLite from 'expo-sqlite';
import { initDatabase, closeDatabase } from '../database/schema';
import {
  addMarker as dbAddMarker,
  deleteMarker as dbDeleteMarker,
  getMarkers as dbGetMarkers,
  addImage as dbAddImage,
  deleteImage as dbDeleteImage,
  getMarkerImages as dbGetMarkerImages,
} from '../database/operations';
import { Marker, MarkerImage } from '../types';

interface DatabaseContextType {
  addMarker: (latitude: number, longitude: number) => Promise<number>;
  deleteMarker: (id: number) => Promise<void>;
  getMarkers: () => Promise<Marker[]>;
  addImage: (markerId: number, uri: string) => Promise<void>;
  deleteImage: (id: number) => Promise<void>;
  getMarkerImages: (markerId: number) => Promise<MarkerImage[]>;
  isLoading: boolean;
  error: Error | null;
}

const DatabaseContext = createContext<DatabaseContextType | null>(null);

export const DatabaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [db, setDb] = useState<SQLite.SQLiteDatabase | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    initDatabase()
      .then((database) => {
        setDb(database);
      })
      .catch((err) => {
        setError(err instanceof Error ? err : new Error(String(err)));
      })
      .finally(() => {
        setIsLoading(false);
      });

    return () => {
      closeDatabase();
    };
  }, []);

  const ensureDb = (): SQLite.SQLiteDatabase => {
    if (!db) {
      throw new Error('Database is not initialized');
    }
    return db;
  };

  const addMarker = async (latitude: number, longitude: number): Promise<number> => {
    try {
      return await dbAddMarker(ensureDb(), latitude, longitude);
    } catch (err) {
      const e = err instanceof Error ? err : new Error(String(err));
      setError(e);
      throw e;
    }
  };

  const deleteMarker = async (id: number): Promise<void> => {
    try {
      await dbDeleteMarker(ensureDb(), id);
    } catch (err) {
      const e = err instanceof Error ? err : new Error(String(err));
      setError(e);
      throw e;
    }
  };

  const getMarkers = async (): Promise<Marker[]> => {
    try {
      return await dbGetMarkers(ensureDb());
    } catch (err) {
      const e = err instanceof Error ? err : new Error(String(err));
      setError(e);
      throw e;
    }
  };

  const addImage = async (markerId: number, uri: string): Promise<void> => {
    try {
      await dbAddImage(ensureDb(), markerId, uri);
    } catch (err) {
      const e = err instanceof Error ? err : new Error(String(err));
      setError(e);
      throw e;
    }
  };

  const deleteImage = async (id: number): Promise<void> => {
    try {
      await dbDeleteImage(ensureDb(), id);
    } catch (err) {
      const e = err instanceof Error ? err : new Error(String(err));
      setError(e);
      throw e;
    }
  };

  const getMarkerImages = async (markerId: number): Promise<MarkerImage[]> => {
    try {
      return await dbGetMarkerImages(ensureDb(), markerId);
    } catch (err) {
      const e = err instanceof Error ? err : new Error(String(err));
      setError(e);
      throw e;
    }
  };

  const contextValue: DatabaseContextType = {
    addMarker,
    deleteMarker,
    getMarkers,
    addImage,
    deleteImage,
    getMarkerImages,
    isLoading,
    error,
  };

  return (
    <DatabaseContext.Provider value={contextValue}>
      {children}
    </DatabaseContext.Provider>
  );
};

export const useDatabase = (): DatabaseContextType => {
  const context = useContext(DatabaseContext);
  if (!context) {
    throw new Error('useDatabase must be used within a DatabaseProvider');
  }
  return context;
};

export default DatabaseContext;
