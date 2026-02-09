import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Photo, AppState } from '../types';

interface AppContextType extends AppState {
  setPhotos: (photos: Photo[]) => void;
  addPhoto: (photo: Photo) => void;
  removePhoto: (id: string) => void;
  setFacingMode: (mode: 'front' | 'back') => void;
  setAutoRecordAfterShutter: (value: boolean) => void;
  setIsListening: (value: boolean) => void;
  setCurrentPhoto: (photo: Photo | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [facingMode, setFacingMode] = useState<'front' | 'back'>('back');
  const [autoRecordAfterShutter, setAutoRecordAfterShutter] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [currentPhoto, setCurrentPhoto] = useState<Photo | null>(null);

  const addPhoto = (photo: Photo) => {
    setPhotos(prev => [...prev, photo]);
  };

  const removePhoto = (id: string) => {
    setPhotos(prev => prev.filter(p => p.id !== id));
  };

  return (
    <AppContext.Provider
      value={{
        photos,
        setPhotos,
        addPhoto,
        removePhoto,
        facingMode,
        setFacingMode,
        autoRecordAfterShutter,
        setAutoRecordAfterShutter,
        isListening,
        setIsListening,
        currentPhoto,
        setCurrentPhoto,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};
