export interface Marker {
  id: number;
  latitude: number;
  longitude: number;
  created_at: string;
}

export interface MarkerImage {
  id: number;
  marker_id: number;
  uri: string;
  created_at: string;
}

// Legacy types kept for backward compatibility
export interface ImageData {
  id: string;
  uri: string;
}

export interface MarkerData {
  id: string;
  latitude: number;
  longitude: number;
  images: ImageData[];
}

export type NavigationParams = {
  id: string;
};
