import { $ } from './dom.js';

export function showView(viewId) {
  $(viewId).classList.add('active');
}

export function hideView(viewId) {
  $(viewId).classList.remove('active');
}
