import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ActivityIndicator, TouchableOpacity, StyleSheet } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../Firebase/FirebaseSetup';
import { Alert } from 'react-native';
import { addUser } from '../Firebase/firestoreHelper';
import styles from '../Styles/LogInOutStyle';

const SignupScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Signup</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label} onPress={() => this.usernameInput.focus()}>Username</Text>
        <TextInput
          ref={(input) => { this.usernameInput = input }}
          style={styles.input}
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
        />
      </View>

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

      <View style={styles.inputContainer}>
        <Text style={styles.label} onPress={() => this.confirmPasswordInput.focus()}>Confirm Password</Text>
        <TextInput
          ref={(input) => { this.confirmPasswordInput = input }}
          style={styles.input}
          placeholder="Confirm Password"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={async () => {
        if (email === "" || password === "" || username === "") {
          Alert.alert("Error", "Email, username, and password are required!");
          return;
        }
        if (password !== confirmPassword) {
          Alert.alert("Error", "Passwords do not match");
          return;
        }
        if (password.length < 6) {
          Alert.alert("Error", "Password must be at least 6 characters");
          return;
        }
        if (password.search(/[a-z]/i) < 0) {
          Alert.alert("Error", "Password must contain at least one letter.");
          return;
        }
        if (email.search(/@/) < 0) {
          Alert.alert("Error", "Email must contain @");
          return;
        }

        setIsLoading(true);
        try {
          const userCredential = await createUserWithEmailAndPassword(auth, email, password);
          const newUser = {
            username: username,
            email: email,
            games: [],
          };

          addUser(userCredential.user.uid, newUser)

          Alert.alert("Success", "User registered successfully");
        } catch (error) {
          Alert.alert("Error", error.message);
          console.log(error);
        } finally {
          setIsLoading(false);
        }
      }}>
        {
          isLoading ? <ActivityIndicator /> : <Text style={styles.buttonText}>Register</Text>
        }
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.replace('Login')}>
        <Text style={styles.link}>Already Registered? Login</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SignupScreen;
