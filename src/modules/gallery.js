import state from './state.js';
import { $, escapeHtml } from './dom.js';
import { showToast } from './toast.js';
import { dbDelete, refreshPhotos } from './db.js';
import { readExif } from './exif.js';
import { shareOrDownload } from './photos.js';
import { showView, hideView } from './views.js';

export async function openGallery() {
  await refreshPhotos();
  const grid = $('galleryGrid');
  const empty = $('galleryEmpty');

  grid.innerHTML = '';

  if (state.photos.length === 0) {
    grid.style.display = 'none';
    empty.style.display = 'flex';
  } else {
    grid.style.display = 'grid';
    empty.style.display = 'none';

    // Reverse to show newest first
    [...state.photos].reverse().forEach((p, i) => {
      const idx = state.photos.length - 1 - i;
      const item = document.createElement('div');
      item.className = 'gallery-item';
      item.innerHTML = `<img src="${p.dataUrl}" alt="Photo">` +
        (p.note ? '<div class="has-note">🎤</div>' : '');
      item.addEventListener('click', () => openDetail(idx));
      grid.appendChild(item);
    });
  }

  showView('galleryView');
}

export function openDetail(idx) {
  state.currentDetailIdx = idx;
  const photo = state.photos[idx];
  $('detailImage').src = photo.dataUrl;
  $('detailDate').textContent = new Date(photo.timestamp).toLocaleDateString();

  const noteEl = $('detailNoteContent');

  // Read EXIF back from the actual image data to prove round-trip
  const exifData = readExif(photo.dataUrl);
  const exifNote = exifData ? exifData.desc : '';

  if (photo.note || exifNote) {
    const displayNote = exifNote || photo.note;
    noteEl.innerHTML = `<div class="detail-note-text">${escapeHtml(displayNote)}</div>` +
      (exifNote ? '<div style="font-size:11px;color:var(--success);margin-top:6px;font-weight:600">\u2713 Verified from EXIF metadata</div>' : '');
  } else {
    noteEl.innerHTML = '<div class="detail-note-empty">No voice note</div>';
  }

  showView('detailView');
}

export async function detailDelete() {
  if (state.currentDetailIdx >= 0) {
    const p = state.photos[state.currentDetailIdx];
    await dbDelete(p.id);
    await refreshPhotos();
    hideView('detailView');
    openGallery();
    showToast('Photo deleted');
  }
}

export function detailDownload() {
  if (state.currentDetailIdx >= 0) {
    const p = state.photos[state.currentDetailIdx];
    shareOrDownload(p.dataUrl, p.timestamp);
  }
}
