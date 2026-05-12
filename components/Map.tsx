import React from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { MapViewProps } from 'react-native-maps';

export default function Map({ children, ...props }: MapViewProps) {
  return (
    <View style={styles.container}>
      <MapView style={styles.map} {...props}>
        {children}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { width: '100%', height: '100%' },
});