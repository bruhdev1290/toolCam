export interface Photo {
  id: string;
  uri: string;
  note: string;
  timestamp: number;
}

export interface AppState {
  photos: Photo[];
  facingMode: 'front' | 'back';
  autoRecordAfterShutter: boolean;
  isListening: boolean;
  currentPhoto: Photo | null;
}
