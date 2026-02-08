import state from './state.js';

const DB_NAME = 'linuscam_db';
const DB_VERSION = 1;
const STORE_NAME = 'photos';

export function initDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = (e) => {
      const d = e.target.result;
      if (!d.objectStoreNames.contains(STORE_NAME)) {
        d.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
      }
    };
    req.onsuccess = (e) => { state.db = e.target.result; resolve(state.db); };
    req.onerror = (e) => reject(e);
  });
}

export function dbPut(photo) {
  return new Promise((resolve, reject) => {
    const tx = state.db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const req = store.add(photo);
    req.onsuccess = () => resolve(req.result);
    req.onerror = (e) => reject(e);
  });
}

export function dbGetAll() {
  return new Promise((resolve, reject) => {
    const tx = state.db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const req = store.getAll();
    req.onsuccess = () => resolve(req.result);
    req.onerror = (e) => reject(e);
  });
}

export function dbDelete(id) {
  return new Promise((resolve, reject) => {
    const tx = state.db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const req = store.delete(id);
    req.onsuccess = () => resolve();
    req.onerror = (e) => reject(e);
  });
}

export async function refreshPhotos() {
  state.photos = await dbGetAll();
  return state.photos;
}
