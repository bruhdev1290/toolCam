# LinusCam - Expo Go Testing Guide

## Quick Start

### 1. Install Expo Go on Your Phone
- **iOS**: [Download from App Store](https://apps.apple.com/app/expo-go/id982107779)
- **Android**: [Download from Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)

### 2. Start the Development Server
```bash
npm install
npm start
```

### 3. Scan the QR Code
- **iOS**: Use your Camera app to scan the QR code
- **Android**: Use the Expo Go app to scan the QR code

The app will load directly in Expo Go on your phone!

## Features to Test

### ✅ Camera Functionality
1. Open the app - you'll see a permission screen
2. Tap "Enable Camera" to grant camera access
3. Camera view should appear with:
   - Live camera preview
   - Flip button (⟳) to switch between front/back camera
   - Gallery button (⊞) to view saved photos
   - Shutter button (large white circle) to take a photo
   - Microphone button (🎤) to toggle auto-record mode

### ✅ Photo Capture
1. Tap the shutter button to take a photo
2. Review screen appears with:
   - The captured photo
   - Text input for adding notes
   - "Record Note" button (currently shows info about speech-to-text)
   - "Retake" button to go back
   - "Save" button to save the photo

### ✅ Photo Gallery
1. Tap the gallery button (⊞) from camera view
2. See all your captured photos in a grid
3. Tap any photo to view details

### ✅ Photo Details
1. From gallery, tap a photo
2. View the full-size photo
3. See any notes you added
4. Use "Save" button to save to camera roll
5. Use "Delete" button to remove the photo

### ✅ EXIF Viewer
1. From camera view, tap "Viewer" in the mode strip
2. Tap "Choose Photo" to pick any JPEG from your library
3. View metadata information

## Known Limitations

### Speech-to-Text
The app currently includes a placeholder for speech-to-text functionality. To add voice notes:
1. Type your notes manually in the text field
2. Or integrate a service like:
   - Google Cloud Speech API
   - Azure Speech Services
   - AWS Transcribe

### EXIF Writing
Full EXIF metadata writing requires native modules. The current version:
- Stores notes in app data
- Associates notes with photos internally
- Can view basic metadata from any JPEG

## Troubleshooting

### Camera Not Working
- Make sure you granted camera permissions
- Restart the Expo Go app
- Check that your phone's camera works in other apps

### App Won't Load
```bash
# Clear the cache and restart
npx expo start -c
```

### Photos Not Saving
- Make sure you grant photo library permissions when prompted
- Check your phone's storage space
- Try restarting the app

### Connection Issues
- Make sure your phone and computer are on the same network
- Try switching between LAN and Tunnel modes in the Expo dev tools
- Check firewall settings

## Building for Production

### Android APK
```bash
npx eas build --platform android
```

### iOS IPA
```bash
npx eas build --platform ios
```

Note: iOS builds require an Apple Developer account ($99/year)

## Next Steps

Once you've tested the app in Expo Go, you can:

1. **Add Speech Recognition**: Integrate a cloud service for voice notes
2. **Enhance EXIF**: Add native modules for full EXIF metadata writing
3. **Add Features**: Cloud backup, sharing, filters, etc.
4. **Publish**: Submit to App Store and Google Play

## Support

For issues or questions:
- Check the [Expo documentation](https://docs.expo.dev/)
- Review the [React Native docs](https://reactnative.dev/)
- Open an issue on GitHub

Enjoy using LinusCam! 📸
