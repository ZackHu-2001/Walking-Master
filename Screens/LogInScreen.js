import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Animated, Easing } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../Firebase/FirebaseSetup';
import styles from '../Styles/LogInOutStyle';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Create animation values for each element
  const fadeTitleAnim = useRef(new Animated.Value(0)).current;
  const fadeDescriptionAnim = useRef(new Animated.Value(0)).current;
  const fadeLoginAnim = useRef(new Animated.Value(0)).current;
  const fadeInputsAnim = useRef(new Animated.Value(0)).current;
  const fadeButtonAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });

    // Chain the animations
    Animated.sequence([
      Animated.timing(fadeTitleAnim, {
        toValue: 1,
        duration: 500,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
      Animated.timing(fadeDescriptionAnim, {
        toValue: 1,
        duration: 500,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
      Animated.timing(fadeLoginAnim, {
        toValue: 1,
        duration: 500,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
      Animated.timing(fadeInputsAnim, {
        toValue: 1,
        duration: 500,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
      Animated.timing(fadeButtonAnim, {
        toValue: 1,
        duration: 500,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      <Animated.Text style={[styles.bigtitle, { opacity: fadeTitleAnim }]}>
        Welcome to Walking Master
      </Animated.Text>
      
      <Animated.Text style={[styles.description, { opacity: fadeDescriptionAnim }]}>
        Log in or sign up to record your adventure.
      </Animated.Text>
      
      <Animated.Text style={[styles.title, { opacity: fadeLoginAnim }]}>
        Login
      </Animated.Text>
      
      <Animated.View style={{ opacity: fadeInputsAnim }}>
        <View style={styles.inputContainer}>
          <Text style={styles.label} onPress={() => this.emailInput.focus()}>Email Address</Text>
          <TextInput
            ref={(input) => { this.emailInput = input }}
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label} onPress={() => this.passwordInput.focus()}>Password</Text>
          <TextInput
            ref={(input) => { this.passwordInput = input }}
            style={styles.input}
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>
      </Animated.View>

      <Animated.View style={{ opacity: fadeButtonAnim }}>
        <TouchableOpacity style={styles.button} onPress={() => {
          if (!email || !password) {
            alert('Please fill all fields');
            return;
          }
          signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
              // Signed in
              const user = userCredential.user;
              // Add any additional logic here
            })
            .catch((error) => {
              const errorCode = error.code;
              const errorMessage = error.message;
              alert('Failed to log in');
              // alert(errorMessage);
            });
        }}>
          <Text style={styles.buttonText}>Log In</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.replace('Signup')}>
          <Text style={styles.link}>New User? Create an account</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.replace('ForgotPassword')}>
          <Text style={styles.link}>Forgot Password?</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

export default LoginScreen;
