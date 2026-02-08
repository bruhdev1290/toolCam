import state from './state.js';
import { $ } from './dom.js';
import { showToast } from './toast.js';
import { startListening, updateVoiceStatus } from './speech.js';

export async function startCamera() {
  if (state.stream) state.stream.getTracks().forEach((t) => t.stop());
  try {
    state.stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: state.facingMode, width: { ideal: 4032 }, height: { ideal: 3024 } },
      audio: false,
    });
    $('video').srcObject = state.stream;
    $('permissionScreen').classList.add('hidden');
    $('cameraView').classList.add('active');
  } catch (err) {
    console.error('Camera error:', err);
    showToast('Camera access denied');
  }
}

export function capturePhoto() {
  const video = $('video');
  const canvas = $('canvas');
  const ctx = canvas.getContext('2d');

  const track = state.stream.getVideoTracks()[0];
  const settings = track.getSettings();
  canvas.width = settings.width || video.videoWidth;
  canvas.height = settings.height || video.videoHeight;

  // Mirror front camera
  if (state.facingMode === 'user') {
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
  }
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  ctx.setTransform(1, 0, 0, 1, 0, 0);

  // Flash effect
  const flash = $('flashOverlay');
  flash.classList.add('flash');
  setTimeout(() => flash.classList.remove('flash'), 150);

  state.capturedDataUrl = canvas.toDataURL('image/jpeg', 0.92);

  // Show review
  $('reviewImage').src = state.capturedDataUrl;
  $('reviewView').classList.add('active');
  $('noteText').value = '';
  updateVoiceStatus('');

  // Auto-start recording if mic was toggled on
  if (state.autoRecordAfterShutter) {
    setTimeout(() => startListening(), 300);
  }
}
