import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BottomTabNavigator from './Navigation/BottomTabNavigator';
import NotificationCenterScreen from './Screens/NotificationCenterScreen';
import { PaperProvider } from 'react-native-paper';
import SignUp from './Screens/SignUp';
import LogIn from './Screens/LogIn';

const Stack = createNativeStackNavigator();

export default function App() {

  const createNewGame = (size, bgImgUrl, creater) => {


    console.log(Date.now());
    game = {
      timeStamp: Date.now(),
      creater: creater,
      size: size,
      bgImgUrl: bgImgUrl,
      tiles: [],
    }

    // Math.random() *
    for (let i = 0; i < size; i++) {
      row = [];
      for (let j = 0; j < size; j++) {
        row.push({
          photos: [],
          visited: false,
          bgImgUrl: bgImgUrl
        });
      }
      game.tiles.push(row);
    }

  }
  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="MainTabs" component={BottomTabNavigator} options={{ headerShown: false }} />
          <Stack.Screen name="NotificationCenter" component={NotificationCenterScreen} />
          <Stack.Screen name="SignUp" component={SignUp} />
          <Stack.Screen name="LogIn" component={LogIn} />
        </Stack.Navigator>
    </NavigationContainer>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
