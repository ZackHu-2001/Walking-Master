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
import SignUp from './Screens/SignUp';
import LogIn from './Screens/LogIn';
import { ContextProvider } from './Context/context';
import GameScreen from './Screens/GameScreen';
import LoginScreen from './Screens/NewLogin';
import ForgotPasswordScreen from './Screens/ForgotPasswordScreen';
import SignupScreen from './Screens/NewSignUp';
import Map from './Map';

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

  const customTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: '#bb86fc', // Customize the primary color
      accent: '#f1c40f', // Customize the accent color
      background: '#ffffff', // Customize the background color
      surface: '#f5f5f5', // Customize the surface color
      text: '#333333', // Customize the text color
      placeholder: '#b0bec5', // Customize the placeholder color
      // You can customize other colors here
    },
  };

  return (
    <ContextProvider>
      <AuthStateListener>
        <PaperProvider theme={customTheme}>
          <NavigationContainer>
            <Stack.Navigator>
              {
                isUserAuthenticated ? <>
                  <Stack.Screen name="MainTabs" component={BottomTabNavigator} options={{ headerShown: false }} />
                  <Stack.Screen name="NotificationCenter" component={NotificationCenterScreen} />
                  <Stack.Screen name="Game" component={GameScreen} />
                  <Stack.Screen name="Map" component={Map} />
                  </> : <>
                    <Stack.Screen name="Login" component={LoginScreen} />
                    <Stack.Screen name="Signup" component={SignupScreen} />
                    <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
                  {/* <Stack.Screen name="LogIn" component={LogIn} />
                  <Stack.Screen name="SignUp" component={SignUp} /> */}
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
