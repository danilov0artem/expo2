import React from 'react';
import { Marker } from 'react-native-maps';
import { Marker as MarkerData } from '../types';

interface Props {
  markers: MarkerData[];
  onMarkerPress: (id: number) => void;
}

export default function MarkerList({ markers, onMarkerPress }: Props) {
  return (
    <>
      {markers.map((marker) => (
        <Marker
          key={marker.id}
          coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
          onPress={() => onMarkerPress(marker.id)}
        />
      ))}
    </>
  );
}
