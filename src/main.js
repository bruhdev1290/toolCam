// CSS
import './css/variables.css';
import './css/base.css';
import './css/camera.css';
import './css/review.css';
import './css/gallery.css';
import './css/detail.css';
import './css/viewer.css';
import './css/components.css';

// Modules
import { $ } from './modules/dom.js';
import state from './modules/state.js';
import { initDB, dbGetAll } from './modules/db.js';
import { startCamera, capturePhoto } from './modules/camera.js';
import { startListening, updateVoiceStatus } from './modules/speech.js';
import { savePhoto, updateThumbnail } from './modules/photos.js';
import { showToast } from './modules/toast.js';
import { hideView } from './modules/views.js';
import { openGallery, openDetail, detailDelete, detailDownload } from './modules/gallery.js';
import { openViewer, closeViewer, readExifFromFile, initViewerDragDrop } from './modules/viewer.js';

// ─── Event Listeners ───

$('grantPermBtn').addEventListener('click', startCamera);

$('shutterBtn').addEventListener('click', capturePhoto);

$('flipBtn').addEventListener('click', () => {
  state.facingMode = state.facingMode === 'environment' ? 'user' : 'environment';
  startCamera();
});

$('micToggle').addEventListener('click', () => {
  state.autoRecordAfterShutter = !state.autoRecordAfterShutter;
  $('micToggle').style.background = state.autoRecordAfterShutter
    ? 'rgba(255,69,58,0.4)' : 'var(--ui-bg)';
  showToast(state.autoRecordAfterShutter ? 'Auto-record ON' : 'Auto-record OFF');
});

$('reviewCancel').addEventListener('click', () => {
  hideView('reviewView');
  if (state.isListening && state.recognition) state.recognition.stop();
});

$('reviewSave').addEventListener('click', savePhoto);

$('reviewMicBtn').addEventListener('click', startListening);

$('clearNoteBtn').addEventListener('click', () => {
  $('noteText').value = '';
  if (state.isListening && state.recognition) state.recognition.stop();
  updateVoiceStatus('');
});

$('galleryBtn').addEventListener('click', openGallery);
$('galleryBack').addEventListener('click', () => hideView('galleryView'));
$('detailBack').addEventListener('click', () => hideView('detailView'));

$('detailDownload').addEventListener('click', detailDownload);
$('detailDelete').addEventListener('click', detailDelete);

$('thumbBtn').addEventListener('click', openGallery);

// EXIF Viewer
$('viewerFileInput').addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) readExifFromFile(file);
});

$('viewerBack').addEventListener('click', closeViewer);
$('openViewerMode').addEventListener('click', openViewer);

$('viewerOnlyBtn').addEventListener('click', () => {
  $('permissionScreen').classList.add('hidden');
  openViewer();
});

initViewerDragDrop();

// ─── Init ───

initDB().then(async () => {
  state.photos = await dbGetAll();
  if (state.photos.length > 0) {
    updateThumbnail(state.photos[state.photos.length - 1]);
  }

  // Auto-start camera if permission already granted
  try {
    const result = await navigator.permissions.query({ name: 'camera' });
    if (result.state === 'granted') {
      startCamera();
    }
  } catch (e) {
    // permissions API not supported, user will click button
  }
});
