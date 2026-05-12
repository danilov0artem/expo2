import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import ImageList from '../../components/ImageList';
import { useDatabase } from '../../contexts/DatabaseContext';
import { Marker, MarkerImage } from '../../types';

export default function MarkerDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const markerId = Number(id);
  const router = useRouter();
  const { getMarkers, deleteMarker, addImage, deleteImage, getMarkerImages, isLoading, error } =
    useDatabase();

  const [marker, setMarker] = useState<Marker | null>(null);
  const [images, setImages] = useState<MarkerImage[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      const allMarkers = await getMarkers();
      const found = allMarkers.find((m) => m.id === markerId) ?? null;
      setMarker(found);
      if (found) {
        const imgs = await getMarkerImages(markerId);
        setImages(imgs);
      }
    } catch {
      Alert.alert('Ошибка', 'Не удалось загрузить данные маркера');
    } finally {
      setLoading(false);
    }
  }, [markerId, getMarkers, getMarkerImages]);

  useEffect(() => {
    if (!isLoading) {
      loadData();
    }
  }, [isLoading, loadData]);

  useEffect(() => {
    if (error) {
      Alert.alert('Ошибка базы данных', error.message);
    }
  }, [error]);

  const pickImage = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert('Ошибка', 'Требуется разрешение на доступ к галерее');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        quality: 1,
      });

      if (!result.canceled) {
        await addImage(markerId, result.assets[0].uri);
        const imgs = await getMarkerImages(markerId);
        setImages(imgs);
      }
    } catch {
      Alert.alert('Ошибка', 'Не удалось добавить изображение');
    }
  };

  const handleDeleteImage = async (imageId: number) => {
    try {
      await deleteImage(imageId);
      const imgs = await getMarkerImages(markerId);
      setImages(imgs);
    } catch {
      Alert.alert('Ошибка', 'Не удалось удалить изображение');
    }
  };

  const handleDeleteMarker = async () => {
    try {
      await deleteMarker(markerId);
      router.back();
    } catch {
      Alert.alert('Ошибка', 'Не удалось удалить маркер');
    }
  };

  const goBack = () => {
    try {
      router.back();
    } catch {
      Alert.alert('Ошибка', 'Сбой навигации при возврате');
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!marker) {
    return (
      <View style={styles.container}>
        <Text>Маркер не найден</Text>
        <Button title="Вернуться назад" onPress={goBack} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Координаты маркера:</Text>
      <Text>Широта: {marker.latitude.toFixed(5)}</Text>
      <Text>Долгота: {marker.longitude.toFixed(5)}</Text>

      <View style={styles.buttonContainer}>
        <Button title="Добавить изображение" onPress={pickImage} />
      </View>

      <ImageList
        images={images.map((img) => ({ id: String(img.id), uri: img.uri }))}
        onDelete={(strId) => handleDeleteImage(Number(strId))}
      />

      <View style={styles.buttonContainer}>
        <Button title="Удалить маркер" onPress={handleDeleteMarker} color="red" />
      </View>

      <View style={styles.buttonContainer}>
        <Button title="Вернуться на карту" onPress={goBack} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  buttonContainer: { marginVertical: 10 },
});
