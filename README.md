# LinusCam — Camera PWA with Voice Notes in EXIF

A progressive web app that captures photos and embeds speech-to-text transcriptions directly into the image's EXIF metadata (ImageDescription + UserComment fields). Includes a standalone EXIF viewer to read notes back from any JPEG.

## How It Works

1. **Camera capture** via `getUserMedia` — works on both Android and iOS browsers
2. **Speech-to-text** via Web Speech API — tap the mic to dictate a note after taking a photo
3. **EXIF embedding** via piexifjs — your voice note gets written into the JPEG's metadata fields
4. **Local storage** via IndexedDB — photos persist in-app between sessions
5. **Download** — triggers a file download on save (lands in Downloads on Android, Files on iOS)

## Running Locally

Any static file server works:
```bash
npx serve .
# or
python3 -m http.server 8000
```

Then open on your phone (must be HTTPS for camera access — use ngrok or similar for testing).

## PWA Install

On Android Chrome: Menu → "Add to Home Screen"
On iOS Safari: Share → "Add to Home Screen"

## The iOS Photo Library Problem

As a PWA, this app **cannot** write directly to the iOS Camera Roll. Downloaded files go to the Files app. Users must manually "Save to Photos" from there.

## Upgrading to Native (Capacitor)

To get true photo library access on both platforms, wrap this with Capacitor:

```bash
npm init -y
npm install @capacitor/core @capacitor/cli
npx cap init LinusCam com.linuscam.app --web-dir .

# Add platforms
npm install @capacitor/ios @capacitor/android
npx cap add ios
npx cap add android

# Install native plugins
npm install @capacitor/camera          # Native camera (optional, can keep getUserMedia)
npm install @capacitor/filesystem      # File system access
npm install @capacitor-community/media # Save to photo library ← this is the key one

npx cap sync
npx cap open ios    # Opens in Xcode
npx cap open android # Opens in Android Studio
```

### Key Plugin: @capacitor-community/media

This plugin provides `Media.savePhoto()` which writes directly to the device's photo library on both iOS and Android. Replace the `triggerDownload()` function with:

```javascript
import { Media } from '@capacitor-community/media';
import { Filesystem, Directory } from '@capacitor/filesystem';

async function saveToPhotoLibrary(dataUrl, filename) {
  // Write to temp file first
  const result = await Filesystem.writeFile({
    path: filename,
    data: dataUrl.split(',')[1], // base64 part only
    directory: Directory.Cache
  });

  // Save to photo library
  await Media.savePhoto({
    path: result.uri,
    albumIdentifier: 'LinusCam' // Optional: creates/uses album
  });
}
```

### Native Speech Recognition (Optional Upgrade)

For better transcription than Web Speech API:

```bash
npm install @capacitor-community/speech-recognition
```

This gives you native speech engines on both platforms, which tend to be more reliable than the browser implementation.

## EXIF Fields Used

| Field | EXIF Tag | Content |
|-------|----------|---------|
| ImageDescription | 0x010e | Voice note text |
| UserComment | 0x9286 | Voice note text (ASCII encoded) |
| DateTimeOriginal | 0x9003 | Capture timestamp |
| DateTime | 0x0132 | Capture timestamp |
| Software | 0x0131 | "LinusCam PWA" |

## Verifying Metadata

After downloading a photo, you can verify the embedded note:

```bash
# Using exiftool
exiftool photo.jpg | grep -i "description\|comment\|software"

# Using Python
python3 -c "
import piexif
d = piexif.load('photo.jpg')
print('Description:', d['0th'].get(270, b'').decode())
print('UserComment:', d['Exif'].get(37510, b'')[8:].decode())
"
```

## Browser Compatibility

| Feature | Android Chrome | iOS Safari | Desktop Chrome |
|---------|---------------|------------|----------------|
| Camera | ✅ | ✅ | ✅ |
| Speech-to-Text | ✅ | ✅ (partial) | ✅ |
| EXIF Writing | ✅ | ✅ | ✅ |
| Download to Photos | ✅ (Downloads) | ❌ (Files only) | ✅ (Downloads) |
| PWA Install | ✅ | ✅ (limited) | ✅ |

For true "save to Photos" on iOS, use the Capacitor wrapper.
