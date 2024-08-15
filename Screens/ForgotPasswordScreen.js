import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { getAuth, sendPasswordResetEmail } from "firebase/auth";

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');

  const handleForgotPassword = () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }

    const auth = getAuth();
    sendPasswordResetEmail(auth, email)
      .then(() => {
        Alert.alert('Success', 'Password reset email sent successfully');
      })
      .catch((error) => {
        const errorMessage = error.message;
        Alert.alert('Error', errorMessage);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Forgot Password</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label} onPress={() => this.emailInput.focus()}>Email Address</Text>
        <TextInput
          ref={(input) => { this.emailInput = input }}
          style={styles.input}
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleForgotPassword}>
        <Text style={styles.buttonText}>Reset Password</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.replace('Login')}>
        <Text style={styles.link}>Back to Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    color: '#6a0dad',
    textAlign: 'center',
    marginVertical: 20,
  },
  inputContainer: {
    marginVertical: 10,
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
  },
  button: {
    backgroundColor: '#6a0dad',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  link: {
    color: '#6a0dad',
    textAlign: 'center',
    marginVertical: 10,
  },
});

export default ForgotPasswordScreen;
