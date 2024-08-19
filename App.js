import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BottomTabNavigator from './Navigation/BottomTabNavigator';
import NotificationCenterScreen from './Screens/NotificationCenterScreen';
import { PaperProvider, DefaultTheme } from 'react-native-paper';
import AuthStateListener from './Context/AuthStateListener';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './Firebase/FirebaseSetup';
import { useEffect, useState } from 'react';
import { ContextProvider } from './Context/context';
import GameScreen from './Screens/GameScreen';
import LoginScreen from './Screens/LogInScreen';
import ForgotPasswordScreen from './Screens/ForgotPasswordScreen';
import Map from './Screens/Map';
import SignupScreen from './Screens/SignUpScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsUserAuthenticated(true);
      } else {
        setIsUserAuthenticated(false);
      }
    });

    return unsubscribe; // Cleanup the listener on unmount
  }, []);

  return (
    <ContextProvider>
      <AuthStateListener>
        <PaperProvider>
          <NavigationContainer>
            <Stack.Navigator>
              {
                isUserAuthenticated ? <>
                  <Stack.Screen name="GameBoard" component={BottomTabNavigator} options={{ headerShown: false }} />
                  <Stack.Screen name="NotificationCenter" component={NotificationCenterScreen} />
                  <Stack.Screen name="Game" component={GameScreen} />
                  <Stack.Screen name="Map" component={Map} />
                  </> : <>
                    <Stack.Screen name="Login" component={LoginScreen} />
                    <Stack.Screen name="Signup" component={SignupScreen} />
                    <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
                </>
              }
            </Stack.Navigator>
          </NavigationContainer>
        </PaperProvider>
      </AuthStateListener>
    </ContextProvider>
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
