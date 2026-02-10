import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AppProvider } from './src/contexts/AppContext';
import CameraScreen from './src/screens/CameraScreen';
import ReviewScreen from './src/screens/ReviewScreen';
import GalleryScreen from './src/screens/GalleryScreen';
import DetailScreen from './src/screens/DetailScreen';
import ViewerScreen from './src/screens/ViewerScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <AppProvider>
      <NavigationContainer>
        <StatusBar style="light" />
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            animation: 'slide_from_right',
          }}
        >
          <Stack.Screen name="Camera" component={CameraScreen} />
          <Stack.Screen name="Review" component={ReviewScreen} />
          <Stack.Screen name="Gallery" component={GalleryScreen} />
          <Stack.Screen name="Detail" component={DetailScreen} />
          <Stack.Screen name="Viewer" component={ViewerScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </AppProvider>
  );
}

