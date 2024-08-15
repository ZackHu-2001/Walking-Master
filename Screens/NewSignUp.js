import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../Firebase/FirebaseSetup';
import { Alert } from 'react-native';
import { addUser } from '../Firebase/firestoreHelper';

const SignupScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

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
        // if (password !== confirmPassword) {
        //   alert('Passwords do not match');
        //   return;
        // }
        // if (!email || !username || !password) {
        //   alert('Please fill all fields');
        //   return;
        // }

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

        try {
          const userCredential = await createUserWithEmailAndPassword(auth, email, password);
          const newUser = {
            username: username,
            email: email,
            games: [],
          };

          addUser(userCredential.user.uid, newUser)

          Alert.alert("Success", "User registered successfully");
          // navigation.replace("Login");
        } catch (error) {
          Alert.alert("Error", error.message);
          console.log(error);
        }

        // createUserWithEmailAndPassword(auth, email, password)
        //   .then((userCredential) => {
        //     // Signed in
        //     const user = userCredential.user;
        //     // Here you would typically save the username to your database
        //     // For example: saveUsernameToDB(user.uid, username);
        //   })
        //   .catch((error) => {
        //     const errorCode = error.code;
        //     const errorMessage = error.message;
        //     console.log('Error:', errorCode, errorMessage);
        //     alert(errorMessage);
        //   });
      }}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.replace('Login')}>
        <Text style={styles.link}>Already Registered? Login</Text>
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

export default SignupScreen;
