import React, { useCallback, useEffect, useState } from 'react';
import { Alert, ActivityIndicator, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { LongPressEvent } from 'react-native-maps';
import Map from '../components/Map';
import MarkerList from '../components/MarkerList';
import { useDatabase } from '../contexts/DatabaseContext';
import { Marker } from '../types';

export default function MapScreen() {
  const { addMarker, getMarkers, isLoading, error } = useDatabase();
  const [markers, setMarkers] = useState<Marker[]>([]);
  const router = useRouter();

  const loadMarkers = useCallback(async () => {
    try {
      const data = await getMarkers();
      setMarkers(data);
    } catch {
      Alert.alert('Ошибка', 'Не удалось загрузить маркеры');
    }
  }, [getMarkers]);

  useEffect(() => {
    if (!isLoading) {
      loadMarkers();
    }
  }, [isLoading, loadMarkers]);

  useFocusEffect(
    useCallback(() => {
      if (!isLoading) {
        loadMarkers();
      }
    }, [isLoading, loadMarkers])
  );

  useEffect(() => {
    if (error) {
      Alert.alert('Ошибка базы данных', error.message);
    }
  }, [error]);

  const handleLongPress = async (event: LongPressEvent) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    try {
      await addMarker(latitude, longitude);
      await loadMarkers();
    } catch {
      Alert.alert('Ошибка', 'Не удалось добавить маркер');
    }
  };

  const handleMarkerPress = (id: number) => {
    try {
      router.push(`/marker/${id}`);
    } catch {
      Alert.alert('Ошибка', 'Произошла ошибка при навигации');
    }
  };

  const handleMapError = () => {
    Alert.alert('Ошибка карты', 'Не удалось загрузить карту');
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Map onLongPress={handleLongPress} onError={handleMapError}>
      <MarkerList markers={markers} onMarkerPress={handleMarkerPress} />
    </Map>
  );
}