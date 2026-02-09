import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { readExifData } from '../utils/exif';

interface ViewerScreenProps {
  navigation: any;
}

export default function ViewerScreen({ navigation }: ViewerScreenProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [exifData, setExifData] = useState<any>(null);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled && result.assets[0]) {
      const uri = result.assets[0].uri;
      setSelectedImage(uri);
      
      // Read EXIF data
      const data = readExifData(uri);
      setExifData(data);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backBtn}>← Back</Text>
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Image source={require('../../assets/icon.png')} style={styles.headerLogo} />
          <Text style={styles.title}>EXIF Viewer</Text>
        </View>
        <View style={styles.spacer} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {!selectedImage ? (
          <View style={styles.emptyContainer}>
            <Image source={require('../../assets/icon.png')} style={styles.emptyLogo} />
            <Text style={styles.emptyTitle}>View Photo Metadata</Text>
            <Text style={styles.emptyDesc}>
              Pick any JPEG to read the voice note embedded in its EXIF data
            </Text>
            <TouchableOpacity style={styles.pickBtn} onPress={pickImage}>
              <Text style={styles.pickBtnText}>Choose Photo</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.resultContainer}>
            <View style={styles.imageWrap}>
              <Image source={{ uri: selectedImage }} style={styles.image} resizeMode="contain" />
            </View>

            <View style={styles.metaSection}>
              <Text style={styles.metaLabel}>Voice Note / Description</Text>
              <Text style={styles.metaValue}>
                {exifData?.note || 'No voice note found'}
              </Text>
            </View>

            <View style={styles.metaSection}>
              <Text style={styles.metaLabel}>Date Taken</Text>
              <Text style={styles.metaValue}>
                {exifData?.timestamp 
                  ? new Date(exifData.timestamp).toLocaleString()
                  : 'Not available'}
              </Text>
            </View>

            <View style={styles.metaSection}>
              <Text style={styles.metaLabel}>Software</Text>
              <Text style={styles.metaValue}>
                {exifData?.software || 'Not available'}
              </Text>
            </View>

            <View style={styles.infoBox}>
              <Text style={styles.infoText}>
                Note: Full EXIF reading/writing requires native modules. This is a simplified version.
                Photos taken with LinusCam store notes in app data.
              </Text>
            </View>

            <TouchableOpacity style={styles.pickBtn} onPress={pickImage}>
              <Text style={styles.pickBtnText}>Choose Another Photo</Text>
            </TouchableOpacity>
          </View>
        )}
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
  content: {
    flexGrow: 1,
    padding: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyLogo: {
    width: 64,
    height: 64,
    marginBottom: 16,
    opacity: 0.7,
  },
  emptyTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptyDesc: {
    color: '#999',
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 280,
    marginBottom: 24,
  },
  pickBtn: {
    backgroundColor: '#0a84ff',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 10,
  },
  pickBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  resultContainer: {
    flex: 1,
  },
  imageWrap: {
    width: '100%',
    aspectRatio: 3 / 4,
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 20,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  metaSection: {
    marginBottom: 20,
  },
  metaLabel: {
    color: '#999',
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  metaValue: {
    color: '#fff',
    fontSize: 16,
    lineHeight: 24,
  },
  infoBox: {
    backgroundColor: 'rgba(10,132,255,0.1)',
    padding: 16,
    borderRadius: 10,
    marginBottom: 20,
  },
  infoText: {
    color: '#0a84ff',
    fontSize: 13,
    lineHeight: 20,
  },
});
