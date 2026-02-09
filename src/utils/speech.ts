import * as Speech from 'expo-speech';

export const startSpeechRecognition = (
  onResult: (text: string) => void,
  onError?: (error: string) => void
): void => {
  // Note: Expo Speech does not have speech-to-text built in
  // This is a placeholder that will need to be extended with
  // a third-party service or native module
  console.log('Speech recognition not fully implemented in this version');
  console.log('You can type notes manually or integrate a service like Google Cloud Speech API');
  
  if (onError) {
    onError('Speech recognition requires additional setup. Please type your note manually.');
  }
};

export const stopSpeechRecognition = (): void => {
  // Placeholder for stopping speech recognition
};

export const speak = (text: string): void => {
  Speech.speak(text);
};
