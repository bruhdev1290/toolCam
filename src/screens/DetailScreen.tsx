import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
} from 'react-native';
import { useApp } from '../contexts/AppContext';
import { savePhotoToLibrary, savePhotos, deletePhoto } from '../utils/storage';

interface DetailScreenProps {
  route: any;
  navigation: any;
}

export default function DetailScreen({ route, navigation }: DetailScreenProps) {
  const { photo } = route.params;
  const { removePhoto, photos } = useApp();

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const handleDownload = async () => {
    try {
      await savePhotoToLibrary(photo.uri);
      Alert.alert('Success', 'Photo saved to library!');
    } catch (error) {
      Alert.alert('Error', 'Failed to save photo');
    }
  };

  const handleDelete = async () => {
    Alert.alert(
      'Delete Photo',
      'Are you sure you want to delete this photo?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deletePhoto(photo.uri);
              removePhoto(photo.id);
              const updatedPhotos = photos.filter(p => p.id !== photo.id);
              await savePhotos(updatedPhotos);
              navigation.goBack();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete photo');
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backBtn}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.date}>{formatDate(photo.timestamp)}</Text>
        <View style={styles.spacer} />
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.imageWrap}>
          <Image source={{ uri: photo.uri }} style={styles.image} resizeMode="contain" />
        </View>

        <View style={styles.bottomSection}>
          <Text style={styles.noteLabel}>Voice Note</Text>
          <View style={styles.noteContent}>
            {photo.note ? (
              <Text style={styles.noteText}>{photo.note}</Text>
            ) : (
              <Text style={styles.noNote}>No note added</Text>
            )}
          </View>

          <View style={styles.actions}>
            <TouchableOpacity style={styles.downloadBtn} onPress={handleDownload}>
              <Text style={styles.downloadBtnText}>⤓ Save</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete}>
              <Text style={styles.deleteBtnText}>✕ Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
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
    width: 80,
  },
  date: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  spacer: {
    width: 80,
  },
  scrollView: {
    flex: 1,
  },
  imageWrap: {
    width: '100%',
    aspectRatio: 3 / 4,
    backgroundColor: '#1a1a1a',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  bottomSection: {
    padding: 20,
  },
  noteLabel: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  noteContent: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    minHeight: 100,
  },
  noteText: {
    color: '#fff',
    fontSize: 16,
    lineHeight: 24,
  },
  noNote: {
    color: '#666',
    fontSize: 16,
    fontStyle: 'italic',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  downloadBtn: {
    flex: 1,
    backgroundColor: '#0a84ff',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  downloadBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  deleteBtn: {
    flex: 1,
    backgroundColor: '#ff453a',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  deleteBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
