import { Paths, File } from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import { Photo } from '../types';

const STORAGE_FILE = 'linuscam_photos.json';

export const loadPhotos = async (): Promise<Photo[]> => {
  try {
    const file = new File(Paths.document, STORAGE_FILE);
    const content = await file.text();
    return JSON.parse(content);
  } catch (error) {
    return [];
  }
};

export const savePhotos = async (photos: Photo[]): Promise<void> => {
  try {
    const file = new File(Paths.document, STORAGE_FILE);
    await file.write(JSON.stringify(photos));
  } catch (error) {
    console.error('Failed to save photos:', error);
    throw error;
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
    const file = new File(uri);
    await file.delete();
  } catch (error) {
    console.error('Failed to delete photo:', error);
    throw error;
  }
};
