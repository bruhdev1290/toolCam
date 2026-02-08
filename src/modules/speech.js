import state from './state.js';
import { $ } from './dom.js';
import { showToast } from './toast.js';
import { isNative } from './platform.js';
import { SpeechRecognition as CapSpeechRecognition } from '@capgo/capacitor-speech-recognition';

let nativeListener = null;

export function initSpeechRecognition() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) return null;

  const r = new SpeechRecognition();
  r.continuous = true;
  r.interimResults = true;
  r.lang = 'en-US';

  let finalTranscript = '';

  r.onresult = (e) => {
    let interim = '';
    for (let i = e.resultIndex; i < e.results.length; i++) {
      const t = e.results[i][0].transcript;
      if (e.results[i].isFinal) {
        finalTranscript += t + ' ';
      } else {
        interim = t;
      }
    }
    $('noteText').value = (finalTranscript + interim).trim();
  };

  r.onend = () => {
    state.isListening = false;
    $('reviewMicBtn').classList.remove('listening');
    $('reviewMicBtn').innerHTML = '🎤 Record Note';
    $('recStrip').classList.remove('active');
    updateVoiceStatus($('noteText').value ? 'done' : '');
    finalTranscript = $('noteText').value + ' ';
  };

  r.onerror = (e) => {
    console.error('Speech error:', e.error);
    state.isListening = false;
    $('reviewMicBtn').classList.remove('listening');
    $('reviewMicBtn').innerHTML = '🎤 Record Note';
    $('recStrip').classList.remove('active');
    if (e.error === 'not-allowed') {
      showToast('Microphone access denied');
    }
  };

  return r;
}

export async function startListening() {
  if (isNative()) {
    await startNativeListening();
    return;
  }

  if (!state.recognition) state.recognition = initSpeechRecognition();
  if (!state.recognition) {
    showToast('Speech recognition not supported');
    return;
  }

  if (state.isListening) {
    state.recognition.stop();
    return;
  }

  state.isListening = true;
  $('reviewMicBtn').classList.add('listening');
  $('reviewMicBtn').innerHTML = '⏹ Stop';
  $('recStrip').classList.add('active');
  updateVoiceStatus('listening');

  try {
    state.recognition.start();
  } catch (e) {
    // Already started
    state.recognition.stop();
    setTimeout(() => state.recognition.start(), 100);
  }
}

export async function stopListening() {
  if (!state.isListening) return;
  if (isNative()) {
    await stopNativeListening();
  } else if (state.recognition) {
    state.recognition.stop();
  }
}

async function startNativeListening() {
  if (state.isListening) {
    await stopNativeListening();
    return;
  }

  const permResult = await CapSpeechRecognition.requestPermissions();
  if (permResult.speechRecognition !== 'granted') {
    showToast('Speech recognition permission denied');
    return;
  }

  state.isListening = true;
  $('reviewMicBtn').classList.add('listening');
  $('reviewMicBtn').innerHTML = '⏹ Stop';
  $('recStrip').classList.add('active');
  updateVoiceStatus('listening');

  nativeListener = await CapSpeechRecognition.addListener('partialResults', (data) => {
    if (data.matches && data.matches.length > 0) {
      $('noteText').value = data.matches[0];
    }
  });

  await CapSpeechRecognition.start({
    language: 'en-US',
    partialResults: true,
    popup: false,
  });
}

async function stopNativeListening() {
  await CapSpeechRecognition.stop();
  if (nativeListener) {
    nativeListener.remove();
    nativeListener = null;
  }
  state.isListening = false;
  $('reviewMicBtn').classList.remove('listening');
  $('reviewMicBtn').innerHTML = '🎤 Record Note';
  $('recStrip').classList.remove('active');
  updateVoiceStatus($('noteText').value ? 'done' : '');
}

export function updateVoiceStatus(statusState) {
  const el = $('voiceStatus');
  el.className = 'voice-status';
  if (statusState === 'listening') {
    el.classList.add('listening');
    el.innerHTML = '<span class="rec-dot" style="width:6px;height:6px"></span> Listening';
  } else if (statusState === 'done') {
    el.classList.add('done');
    el.textContent = '✓ Note added';
  } else {
    el.textContent = '';
  }
}
