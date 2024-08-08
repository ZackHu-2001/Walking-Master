import React from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { auth, db } from "../Firebase/FirebaseSetup";
import { signInWithEmailAndPassword } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";
import { CommonActions } from '@react-navigation/native';
import { useContext } from "react";
import { Context } from "../Context/context";

const LogIn = ({ navigation }) => {
  const [identifier, setIdentifier] = React.useState("");
  const [password, setPassword] = React.useState("");
  const context = useContext(Context);
  const { setUser } = context;

  const handleLogIn = async () => {
    if (!identifier || !password) {
      Alert.alert("Error", "Username/Email and password are required");
      return;
    }

    try {
      let email = identifier;
      if (identifier.indexOf('@') === -1) {
        // Assume it's a username, not an email
        const q = query(collection(db, "users"), where("username", "==", identifier));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          email = querySnapshot.docs[0].data().email;
        } else {
          Alert.alert("Error", "No user found with this username");
          return;
        }
      }

      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user.uid);

      Alert.alert("Success", "User logged in successfully");
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [
            {
              name: 'MainTabs',
              state: {
                routes: [{ name: 'Profile' }],
              },
            },
          ],
        })
      );
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text>Log In</Text>
      <TextInput
        style={styles.input}
        placeholder="Username or Email"
        value={identifier}
        onChangeText={setIdentifier}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Sign Up" onPress={() => navigation.replace("SignUp")} />
      <Button title="Log In" onPress={handleLogIn} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    width: "80%",
    padding: 10,
    borderWidth: 1,
    borderColor: "black",
    margin: 10,
  },
});

export default LogIn;
