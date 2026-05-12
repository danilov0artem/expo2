import React from 'react';
import { FlatList, Image, TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { ImageData } from '../types';

interface Props {
  images: ImageData[];
  onDelete: (id: string) => void;
}

export default function ImageList({ images, onDelete }: Props) {
  return (
    <FlatList
      data={images}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View style={styles.container}>
          <Image source={{ uri: item.uri }} style={styles.image} />
          <TouchableOpacity onPress={() => onDelete(item.id)} style={styles.deleteButton}>
            <Text style={styles.deleteText}>Удалить</Text>
          </TouchableOpacity>
        </View>
      )}
      ListEmptyComponent={<Text>Нет добавленных изображений</Text>}
    />
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  image: { width: 100, height: 100, marginRight: 10, borderRadius: 8 },
  deleteButton: { backgroundColor: '#ff4444', padding: 10, borderRadius: 5 },
  deleteText: { color: 'white' },
});