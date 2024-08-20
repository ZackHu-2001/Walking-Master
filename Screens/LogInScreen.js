import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Animated, Easing } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../Firebase/FirebaseSetup';
import styles from '../Styles/LogInOutStyle';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const fadeAnim = useRef(new Animated.Value(0)).current; // Initial opacity is 0

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });

    // Trigger the fade-in animation when the screen loads
    Animated.timing(fadeAnim, {
      toValue: 1, // Final opacity
      duration: 1000, // Duration of the animation in milliseconds
      easing: Easing.ease, // Easing function
      useNativeDriver: true, // Use native driver for better performance
    }).start();
  }, [fadeAnim]);

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <Text style={styles.bigtitle}>Welcome to Walking Master</Text>
      <Text style={styles.description}>
        Log in or sign up to 
        record your adventure.
      </Text>
      <Text style={styles.title}>Login</Text>
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
  );
};

export default LoginScreen;
