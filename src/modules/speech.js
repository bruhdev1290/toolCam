import state from './state.js';
import { $ } from './dom.js';
import { showToast } from './toast.js';

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

export function startListening() {
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
