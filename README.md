# LinusCam — Camera PWA with Voice Notes in EXIF

A progressive web app that captures photos and embeds speech-to-text transcriptions directly into the image's EXIF metadata (ImageDescription + UserComment fields). Includes a standalone EXIF viewer to read notes back from any JPEG.

## How It Works

1. **Camera capture** via `getUserMedia` — front/back camera switching with mirror effect for selfies, works on Android, iOS, and desktop browsers
2. **Speech-to-text** via Web Speech API — tap the mic after taking a photo, or toggle auto-record to start listening immediately after each shutter press
3. **EXIF embedding** via piexifjs — your voice note gets written into the JPEG's metadata fields
4. **Local storage** via IndexedDB — photos persist in-app between sessions
5. **Save** — uses Web Share API on iOS (native share sheet → "Save Image" to Camera Roll), falls back to file download on Android/desktop

## Development

```bash
npm install
npm run dev
```

Vite dev server starts at `http://localhost:5173`. `localhost` is treated as a secure context by browsers, so camera access works without HTTPS.

For testing on a phone, use ngrok or similar to get an HTTPS URL.

## Building

```bash
npm run build
```

Output goes to `dist/`. Preview the production build with:

```bash
npm run preview
```

## Docker

```bash
docker build -t linuscam .
docker run -p 8080:80 linuscam
```

The Dockerfile runs a multi-stage build (Node for `npm run build`, then Nginx to serve the static output).

## Project Structure

```
index.html              Markup only — no inline CSS or JS
vite.config.js          Vite + vite-plugin-pwa config
capacitor.config.json   Capacitor app configuration
ios/                    Capacitor iOS project (Xcode)
android/                Capacitor Android project (Gradle)
src/
  main.js               Entry point: imports CSS, wires event listeners, runs init
  css/
    variables.css       Design tokens (:root custom properties)
    base.css            Reset and html/body styles
    camera.css          Camera view, controls, shutter button
    review.css          Photo review, voice note input
    gallery.css         Photo gallery grid
    detail.css          Photo detail view
    viewer.css          EXIF viewer (drag-drop metadata reader)
    components.css      Toast, flash overlay, permission screen
  modules/
    dom.js              $ helper, escapeHtml
    state.js            Centralized app state
    db.js               IndexedDB wrapper
    camera.js           Camera stream + photo capture
    platform.js         Capacitor/web platform detection
    speech.js           Speech recognition (native + web)
    exif.js             EXIF read/write via piexifjs
    photos.js           Save, share, download (native + web)
    views.js            View show/hide helpers
    gallery.js          Gallery + detail view
    viewer.js           EXIF viewer tab
    toast.js            Toast notifications
public/
  apple-touch-icon.png  iOS home screen icon
  favicon.png           Browser tab icon
  icon-192.png          PWA icon (192x192)
  icon-512.png          PWA icon (512x512)
  icon.svg              SVG app icon
  linuscamlogo.png      LinusCam logo (used in UI)
```

## PWA Install

On Android Chrome: Menu → "Add to Home Screen"
On iOS Safari: Share → "Add to Home Screen"

## Native App (Capacitor)

The app is wrapped with Capacitor for native iOS and Android builds. When running as a native app:

- **Photo saving** writes directly to the device camera roll via `@capacitor-community/media` (no share sheet needed)
- **Speech recognition** uses native speech engines via `@capgo/capacitor-speech-recognition` (more reliable than Web Speech API, especially on iOS)

When running as a PWA in a browser, the app falls back to Web Share API / file downloads and browser speech recognition.

### Building for Native

```bash
npm run build         # Build web assets
npm run cap:sync      # Sync to native projects
npm run cap:ios       # Open in Xcode
npm run cap:android   # Open in Android Studio
```

### Platform Detection

The `platform.js` module provides `isNative()` — modules branch on this to use native plugins vs browser APIs. Camera capture stays on `getUserMedia` in both modes (works fine in Capacitor's WebView).

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

## Compatibility

| Feature | Native (Capacitor) | Android Chrome | iOS Safari | Desktop Chrome |
|---------|-------------------|---------------|------------|----------------|
| Camera | ✅ | ✅ | ✅ | ✅ |
| Speech-to-Text | ✅ (native engine) | ✅ | ✅ (partial) | ✅ |
| EXIF Writing | ✅ | ✅ | ✅ | ✅ |
| Save to Photos | ✅ (direct) | ✅ (Downloads) | ✅ (via Share Sheet) | ✅ (Downloads) |

## License

Public domain. Do what you want. See [weebcoders.com/license](https://weebcoders.com/license).
