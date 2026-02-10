# LinusCam — React Native Camera App with Voice Notes

A React Native mobile app built with Expo that captures photos and allows you to add voice notes. Works on iOS and Android using Expo Go for development.

## Features

- **Camera capture** with front/back camera switching
- **Voice notes** - Add text notes to your photos (speech-to-text can be added with additional services)
- **Photo gallery** - View all your captured photos
- **Photo library saving** - Save photos directly to your device's camera roll
- **EXIF viewer** - View metadata from any JPEG image
- **Cross-platform** - Works on both iOS and Android

## Quick Start with Expo Go

### Prerequisites

- Node.js (v16 or newer)
- npm or yarn
- Expo Go app installed on your phone ([iOS](https://apps.apple.com/app/expo-go/id982107779) | [Android](https://play.google.com/store/apps/details?id=host.exp.exponent))

### Installation

1. Clone the repository:
```bash
git clone https://github.com/bruhdev1290/toolCam.git
cd toolCam
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Scan the QR code with:
   - **iOS**: Use the Camera app to scan the QR code
   - **Android**: Use the Expo Go app to scan the QR code

## Development

### Running on Specific Platforms

```bash
# Start dev server
npm start

# Or target specific platforms directly
npm run android   # Android emulator/device
npm run ios       # iOS simulator (requires macOS)
```

### Testing on Your Phone

The easiest way to test is using Expo Go:

1. Install Expo Go on your phone
2. Run `npm start` in your project
3. Scan the QR code with your phone
4. The app will load directly in Expo Go

### Project Structure

```
App.tsx                 Main app entry with navigation
app.json               Expo configuration
package.json           Dependencies and scripts
src/
  screens/             Screen components
    CameraScreen.tsx   Main camera interface
    ReviewScreen.tsx   Photo review with voice notes
    GalleryScreen.tsx  Photo gallery grid
    DetailScreen.tsx   Individual photo view
    ViewerScreen.tsx   EXIF metadata viewer
  contexts/
    AppContext.tsx     Global state management
  utils/
    storage.ts         Photo storage and file management
    speech.ts          Speech recognition utilities
    exif.ts            EXIF metadata handling
  types/
    index.ts           TypeScript type definitions
assets/                App icons and images
```

## Building for Production

### Using EAS Build (Recommended)

1. Install EAS CLI:
```bash
npm install -g eas-cli
```

2. Configure EAS:
```bash
eas build:configure
```

3. Build for Android:
```bash
npx eas build --platform android
```

4. Build for iOS (requires Apple Developer account):
```bash
npx eas build --platform ios
```

5. Build for both platforms:
```bash
eas build --platform all
```

## Permissions

The app requires the following permissions:

- **Camera** - To capture photos
- **Microphone** - For voice note recording (when implemented)
- **Photo Library** - To save photos to your device
- **Storage** - To store photos locally

These are configured in `app.json` and will be requested at runtime.

## Features in Detail

### Camera
- Switch between front and back cameras
- Capture high-quality photos
- Auto-record mode for voice notes

### Voice Notes
- Add text notes to photos
- Manual text input supported
- Speech-to-text can be integrated with services like:
  - Google Cloud Speech API
  - Azure Speech Services
  - AWS Transcribe

### Gallery
- View all captured photos in a grid
- Tap to view details
- Reverse chronological order

### Photo Detail
- View full-size photo
- Read voice note
- Save to camera roll
- Delete photo

### EXIF Viewer
- Pick any JPEG from your library
- View embedded metadata
- Read EXIF data from LinusCam photos

## Technologies Used

- **React Native** - Mobile framework
- **Expo** - Development platform and build tools
- **TypeScript** - Type safety
- **expo-camera** - Camera access
- **expo-media-library** - Photo library integration
- **expo-image-picker** - Image selection
- **React Navigation** - Screen navigation
- **piexifjs** - EXIF metadata (web fallback)

## Notes

- Speech-to-text requires additional implementation. The app currently supports manual text input.
- EXIF embedding is simplified in this version. Full EXIF writing requires native modules.
- The app stores photos in app-specific storage and can save to the camera roll.

## Compatibility

| Feature | iOS | Android | Expo Go |
|---------|-----|---------|---------|
| Camera | ✅ | ✅ | ✅ |
| Photo Capture | ✅ | ✅ | ✅ |
| Gallery | ✅ | ✅ | ✅ |
| Save to Library | ✅ | ✅ | ✅ |
| Text Notes | ✅ | ✅ | ✅ |
| Speech-to-Text* | ⚠️ | ⚠️ | ⚠️ |

*Speech-to-text requires additional service integration

## Troubleshooting

### "Cannot find module" errors
```bash
rm -rf node_modules package-lock.json
npm install
```

### Camera not working in Expo Go
Make sure you've granted camera permissions when prompted. You can reset permissions in your phone's settings.

### Build errors
Clear the Expo cache:
```bash
npx expo start -c
```

## License

Public domain. Do what you want. See [weebcoders.com/license](https://weebcoders.com/license).

## Credits

Original PWA version by the LinusCam team. React Native conversion maintains the core functionality while adapting to native mobile platforms.

