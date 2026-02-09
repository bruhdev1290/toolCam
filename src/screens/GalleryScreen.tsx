import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  Dimensions,
} from 'react-native';
import { useApp } from '../contexts/AppContext';
import { loadPhotos } from '../utils/storage';

const { width } = Dimensions.get('window');
const ITEM_SIZE = (width - 48) / 3;

interface GalleryScreenProps {
  navigation: any;
}

export default function GalleryScreen({ navigation }: GalleryScreenProps) {
  const { photos, setPhotos } = useApp();

  useEffect(() => {
    loadStoredPhotos();
  }, []);

  const loadStoredPhotos = async () => {
    const stored = await loadPhotos();
    setPhotos(stored);
  };

  const renderPhoto = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.photoItem}
      onPress={() => navigation.navigate('Detail', { photo: item })}
    >
      <Image source={{ uri: item.uri }} style={styles.photoImage} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backBtn}>← Back</Text>
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Image source={require('../../assets/icon.png')} style={styles.headerLogo} />
          <Text style={styles.title}>LinusCam</Text>
        </View>
        <View style={styles.spacer} />
      </View>

      {photos.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Image source={require('../../assets/icon.png')} style={styles.emptyLogo} />
          <Text style={styles.emptyText}>No photos yet</Text>
        </View>
      ) : (
        <FlatList
          data={[...photos].reverse()}
          renderItem={renderPhoto}
          keyExtractor={(item) => item.id}
          numColumns={3}
          contentContainerStyle={styles.grid}
          columnWrapperStyle={styles.row}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  backBtn: {
    color: '#0a84ff',
    fontSize: 17,
    width: 60,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerLogo: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  spacer: {
    width: 60,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyLogo: {
    width: 80,
    height: 80,
    marginBottom: 16,
    opacity: 0.5,
  },
  emptyText: {
    color: '#666',
    fontSize: 18,
  },
  grid: {
    padding: 16,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  photoItem: {
    width: ITEM_SIZE,
    height: ITEM_SIZE,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#1a1a1a',
  },
  photoImage: {
    width: '100%',
    height: '100%',
  },
});
