import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import { Photo } from '../types';

const STORAGE_KEY = '@linuscam_photos';

export const loadPhotos = async (): Promise<Photo[]> => {
  try {
    const stored = await FileSystem.readAsStringAsync(
      FileSystem.documentDirectory + STORAGE_KEY,
      { encoding: FileSystem.EncodingType.UTF8 }
    );
    return JSON.parse(stored);
  } catch (error) {
    return [];
  }
};

export const savePhotos = async (photos: Photo[]): Promise<void> => {
  try {
    await FileSystem.writeAsStringAsync(
      FileSystem.documentDirectory + STORAGE_KEY,
      JSON.stringify(photos),
      { encoding: FileSystem.EncodingType.UTF8 }
    );
  } catch (error) {
    console.error('Failed to save photos:', error);
  }
};

export const savePhotoToLibrary = async (uri: string): Promise<void> => {
  try {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status === 'granted') {
      await MediaLibrary.saveToLibraryAsync(uri);
    } else {
      throw new Error('Media library permission denied');
    }
  } catch (error) {
    console.error('Failed to save photo to library:', error);
    throw error;
  }
};

export const deletePhoto = async (uri: string): Promise<void> => {
  try {
    await FileSystem.deleteAsync(uri, { idempotent: true });
  } catch (error) {
    console.error('Failed to delete photo:', error);
  }
};
