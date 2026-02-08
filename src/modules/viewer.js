import { $ } from './dom.js';
import { readExif } from './exif.js';
import { showView, hideView } from './views.js';

export function openViewer() {
  showView('viewerView');
}

export function closeViewer() {
  hideView('viewerView');
  // Reset viewer state
  $('viewerEmpty').style.display = 'flex';
  $('viewerResult').style.display = 'none';
  $('viewerFileInput').value = '';
}

function renderExifResult(dataUrl, exifData) {
  $('viewerImage').src = dataUrl;
  $('viewerEmpty').style.display = 'none';
  $('viewerResult').style.display = 'flex';

  if (!exifData) {
    const fields = ['viewerNote', 'viewerComment', 'viewerDate', 'viewerSoftware', 'viewerCamera', 'viewerResolution'];
    fields.forEach((id) => {
      const el = $(id);
      el.textContent = id === 'viewerNote' ? 'Could not read EXIF data' : 'N/A';
      el.className = 'viewer-meta-value empty';
    });
    return;
  }

  // ImageDescription (voice note)
  const noteEl = $('viewerNote');
  if (exifData.desc && exifData.desc.trim()) {
    noteEl.textContent = exifData.desc;
    noteEl.className = 'viewer-meta-value highlight';
  } else {
    noteEl.textContent = 'No description found';
    noteEl.className = 'viewer-meta-value empty';
  }

  // UserComment
  const commentEl = $('viewerComment');
  if (exifData.comment && exifData.comment.trim()) {
    commentEl.textContent = exifData.comment;
    commentEl.className = 'viewer-meta-value highlight';
  } else {
    commentEl.textContent = 'No user comment';
    commentEl.className = 'viewer-meta-value empty';
  }

  // Date
  const dateEl = $('viewerDate');
  if (exifData.dateOrig) {
    dateEl.textContent = exifData.dateOrig;
    dateEl.className = 'viewer-meta-value';
  } else {
    dateEl.textContent = 'Unknown';
    dateEl.className = 'viewer-meta-value empty';
  }

  // Software
  const swEl = $('viewerSoftware');
  if (exifData.software) {
    swEl.textContent = exifData.software;
    swEl.className = 'viewer-meta-value';
  } else {
    swEl.textContent = 'Unknown';
    swEl.className = 'viewer-meta-value empty';
  }

  // Camera
  const cameraEl = $('viewerCamera');
  if (exifData.camera) {
    cameraEl.textContent = exifData.camera;
    cameraEl.className = 'viewer-meta-value';
  } else {
    cameraEl.textContent = 'Unknown';
    cameraEl.className = 'viewer-meta-value empty';
  }

  // Resolution
  const resEl = $('viewerResolution');
  if (exifData.resolution) {
    resEl.textContent = exifData.resolution;
    resEl.className = 'viewer-meta-value';
  } else {
    // Fall back to image natural dimensions
    const img = $('viewerImage');
    img.onload = () => {
      resEl.textContent = `${img.naturalWidth} \u00d7 ${img.naturalHeight}`;
      resEl.className = 'viewer-meta-value';
    };
    resEl.textContent = 'Loading...';
    resEl.className = 'viewer-meta-value empty';
  }
}

export function readExifFromFile(file) {
  const reader = new FileReader();
  reader.onload = (e) => {
    const dataUrl = e.target.result;
    const exifData = readExif(dataUrl);
    renderExifResult(dataUrl, exifData);
  };
  reader.readAsDataURL(file);
}

export function initViewerDragDrop() {
  const dropZone = $('dropZone');
  if (!dropZone) return;

  dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('dragover');
  });
  dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('dragover');
  });
  dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('dragover');
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      readExifFromFile(file);
    }
  });
}
