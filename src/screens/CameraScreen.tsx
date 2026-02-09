import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useApp } from '../contexts/AppContext';
import * as FileSystem from 'expo-file-system';

interface CameraScreenProps {
  navigation: any;
}

export default function CameraScreen({ navigation }: CameraScreenProps) {
  const [permission, requestPermission] = useCameraPermissions();
  const { facingMode, setFacingMode, autoRecordAfterShutter, setAutoRecordAfterShutter, photos } = useApp();
  const cameraRef = useRef<any>(null);

  if (!permission) {
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Image
          source={require('../../assets/icon.png')}
          style={styles.permLogo}
        />
        <Text style={styles.permTitle}>LinusCam</Text>
        <Text style={styles.permDesc}>
          Capture photos with voice notes embedded right in the image metadata.
          Grant camera access to get started.
        </Text>
        <TouchableOpacity style={styles.permBtn} onPress={requestPermission}>
          <Text style={styles.permBtnText}>Enable Camera</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.permBtn, styles.permBtnSecondary]}
          onPress={() => navigation.navigate('Viewer')}
        >
          <Text style={[styles.permBtnText, styles.permBtnSecondaryText]}>
            Open Viewer Instead
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.9,
          base64: false,
        });
        
        navigation.navigate('Review', { photoUri: photo.uri });
      } catch (error) {
        console.error('Failed to take picture:', error);
        Alert.alert('Error', 'Failed to capture photo');
      }
    }
  };

  const toggleCamera = () => {
    setFacingMode(facingMode === 'front' ? 'back' : 'front');
  };

  const toggleAutoRecord = () => {
    setAutoRecordAfterShutter(!autoRecordAfterShutter);
  };

  const lastPhoto = photos.length > 0 ? photos[photos.length - 1] : null;

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing={facingMode as CameraType}
        ref={cameraRef}
      >
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.topBtn} onPress={toggleCamera}>
            <Text style={styles.topBtnText}>⟳</Text>
          </TouchableOpacity>
          <View style={styles.centerTitle}>
            <Image source={require('../../assets/icon.png')} style={styles.topBarLogo} />
            <Text style={styles.titleText}>LINUSCAM</Text>
          </View>
          <TouchableOpacity
            style={styles.topBtn}
            onPress={() => navigation.navigate('Gallery')}
          >
            <Text style={styles.topBtnText}>⊞</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.bottomControls}>
          <View style={styles.modeStrip}>
            <Text style={styles.activeMode}>Photo</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Viewer')}>
              <Text style={styles.inactiveMode}>Viewer</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.shutterRow}>
            <TouchableOpacity
              style={styles.thumbBtn}
              onPress={() => navigation.navigate('Gallery')}
            >
              {lastPhoto ? (
                <Image source={{ uri: lastPhoto.uri }} style={styles.thumbImage} />
              ) : (
                <Text style={styles.thumbIcon}>🖼</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity style={styles.shutterBtn} onPress={takePicture}>
              <View style={styles.shutterInner} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.sideBtn,
                autoRecordAfterShutter && styles.sideBtnActive,
              ]}
              onPress={toggleAutoRecord}
            >
              <Text style={styles.sideBtnText}>🎤</Text>
            </TouchableOpacity>
          </View>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  permissionContainer: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  permLogo: {
    width: 100,
    height: 100,
    marginBottom: 24,
  },
  permTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 16,
  },
  permDesc: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  permBtn: {
    backgroundColor: '#0a84ff',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    marginBottom: 12,
    width: '100%',
    maxWidth: 300,
  },
  permBtnSecondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#0a84ff',
  },
  permBtnText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
    textAlign: 'center',
  },
  permBtnSecondaryText: {
    color: '#0a84ff',
  },
  camera: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  topBtn: {
    width: 44,
    height: 44,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topBtnText: {
    color: '#fff',
    fontSize: 24,
  },
  centerTitle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  topBarLogo: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
  titleText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 1,
  },
  bottomControls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: 40,
  },
  modeStrip: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
    marginBottom: 24,
  },
  activeMode: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  inactiveMode: {
    color: '#999',
    fontSize: 16,
  },
  shutterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  thumbBtn: {
    width: 50,
    height: 50,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  thumbImage: {
    width: '100%',
    height: '100%',
  },
  thumbIcon: {
    fontSize: 24,
  },
  shutterBtn: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shutterInner: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#fff',
  },
  sideBtn: {
    width: 50,
    height: 50,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sideBtnActive: {
    backgroundColor: 'rgba(255,69,58,0.4)',
  },
  sideBtnText: {
    fontSize: 24,
  },
});
