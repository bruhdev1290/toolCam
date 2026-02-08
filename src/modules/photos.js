import state from './state.js';
import { $ } from './dom.js';
import { showToast } from './toast.js';
import { embedNoteInExif } from './exif.js';
import { dbPut, refreshPhotos } from './db.js';

export async function savePhoto() {
  const note = $('noteText').value.trim();
  let finalDataUrl = state.capturedDataUrl;

  // Embed note in EXIF (even if empty, for timestamp/software tags)
  finalDataUrl = embedNoteInExif(state.capturedDataUrl, note || '');

  const photo = {
    dataUrl: finalDataUrl,
    note: note,
    timestamp: Date.now(),
  };

  // Save to IndexedDB
  const id = await dbPut(photo);
  photo.id = id;
  await refreshPhotos();

  // Update thumbnail
  updateThumbnail(photo);

  // Close review
  $('reviewView').classList.remove('active');
  if (state.isListening && state.recognition) state.recognition.stop();

  showToast(note ? 'Saved with voice note \u2713' : 'Photo saved \u2713');

  // Share sheet on iOS (save to Photos), download fallback elsewhere
  shareOrDownload(finalDataUrl, photo.timestamp);
}

export function dataUrlToFile(dataUrl, filename) {
  const arr = dataUrl.split(',');
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  const n = bstr.length;
  const u8arr = new Uint8Array(n);
  for (let i = 0; i < n; i++) u8arr[i] = bstr.charCodeAt(i);
  return new File([u8arr], filename, { type: mime });
}

export function generateFilename(timestamp) {
  const date = new Date(timestamp);
  return `LinusCam_${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}_${String(date.getHours()).padStart(2, '0')}${String(date.getMinutes()).padStart(2, '0')}${String(date.getSeconds()).padStart(2, '0')}.jpg`;
}

export function triggerDownload(dataUrl, timestamp) {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = generateFilename(timestamp);
  link.click();
}

export async function shareOrDownload(dataUrl, timestamp) {
  const fname = generateFilename(timestamp);
  if (navigator.share && navigator.canShare) {
    const file = dataUrlToFile(dataUrl, fname);
    if (navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({ files: [file] });
        return;
      } catch (err) {
        if (err.name !== 'AbortError') console.warn('Share failed:', err);
      }
    }
  }
  triggerDownload(dataUrl, timestamp);
}

export function updateThumbnail(photo) {
  const btn = $('thumbBtn');
  btn.classList.remove('empty');
  btn.innerHTML = `<img src="${photo.dataUrl}" alt="Last photo">`;
}
