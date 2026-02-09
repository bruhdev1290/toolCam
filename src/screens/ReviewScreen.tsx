import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
  ScrollView,
} from 'react-native';
import { useApp } from '../contexts/AppContext';
import { savePhotoToLibrary, savePhotos, loadPhotos } from '../utils/storage';
import { Photo } from '../types';
import { Paths, File } from 'expo-file-system';

interface ReviewScreenProps {
  route: any;
  navigation: any;
}

export default function ReviewScreen({ route, navigation }: ReviewScreenProps) {
  const { photoUri } = route.params;
  const { addPhoto, photos, autoRecordAfterShutter, isListening, setIsListening } = useApp();
  const [note, setNote] = useState('');
  const [voiceStatus, setVoiceStatus] = useState('');

  useEffect(() => {
    if (autoRecordAfterShutter) {
      startRecording();
    }
  }, []);

  const startRecording = () => {
    setIsListening(true);
    setVoiceStatus('Listening...');
    // Note: Speech-to-text would be implemented here
    // For now, users can type manually
    setTimeout(() => {
      setVoiceStatus('Speech recognition requires manual typing in this version');
      setIsListening(false);
    }, 2000);
  };

  const handleSave = async () => {
    try {
      const timestamp = Date.now();
      const fileName = `linuscam_${timestamp}.jpg`;
      const destFile = new File(Paths.document, fileName);

      // Copy the photo to permanent storage
      const sourceFile = new File(photoUri);
      await sourceFile.copy(destFile);

      // Save to photo library
      await savePhotoToLibrary(destFile.uri);

      // Create photo object
      const photo: Photo = {
        id: timestamp.toString(),
        uri: destFile.uri,
        note,
        timestamp,
      };

      // Add to state and save
      addPhoto(photo);
      const updatedPhotos = [...photos, photo];
      await savePhotos(updatedPhotos);

      Alert.alert('Success', 'Photo saved to library!');
      navigation.navigate('Camera');
    } catch (error) {
      console.error('Failed to save photo:', error);
      Alert.alert('Error', 'Failed to save photo');
    }
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.btn} onPress={handleCancel}>
          <Text style={styles.btnText}>Retake</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.btn, styles.saveBtn]} onPress={handleSave}>
          <Text style={[styles.btnText, styles.saveBtnText]}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.imageWrap}>
          <Image source={{ uri: photoUri }} style={styles.image} resizeMode="contain" />
        </View>

        <View style={styles.bottomSection}>
          <View style={styles.voiceHeader}>
            <Text style={styles.voiceLabel}>Voice Note</Text>
            {voiceStatus ? (
              <Text style={styles.voiceStatus}>{voiceStatus}</Text>
            ) : null}
          </View>

          <TextInput
            style={styles.noteInput}
            placeholder="Tap mic to add a voice note, or type here..."
            placeholderTextColor="#666"
            multiline
            numberOfLines={4}
            value={note}
            onChangeText={setNote}
          />

          <View style={styles.voiceActions}>
            <TouchableOpacity
              style={[styles.micBtn, isListening && styles.micBtnActive]}
              onPress={startRecording}
            >
              <Text style={styles.micBtnText}>🎤 Record Note</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.clearBtn}
              onPress={() => {
                setNote('');
                setVoiceStatus('');
              }}
            >
              <Text style={styles.clearBtnText}>✕</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.infoText}>
            Note: Speech recognition requires additional setup. You can type your note manually for now.
          </Text>
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
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  btn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  saveBtn: {
    backgroundColor: '#0a84ff',
  },
  btnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  saveBtnText: {
    color: '#fff',
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
  voiceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  voiceLabel: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  voiceStatus: {
    color: '#0a84ff',
    fontSize: 14,
  },
  noteInput: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    color: '#fff',
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: 'top',
    marginBottom: 16,
  },
  voiceActions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  micBtn: {
    flex: 1,
    backgroundColor: '#0a84ff',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  micBtnActive: {
    backgroundColor: '#ff453a',
  },
  micBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  clearBtn: {
    width: 50,
    backgroundColor: '#1a1a1a',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearBtnText: {
    color: '#fff',
    fontSize: 20,
  },
  infoText: {
    color: '#666',
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'center',
  },
});
