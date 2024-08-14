import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, Image, Alert, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { auth, db, storage } from '../Firebase/FirebaseSetup';
import { handleSelectImage, handleTakePhoto } from '../ImageManager';

const ProfileScreen = () => {
  const navigation = useNavigation();
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [avatarUrl, setAvatarUrl] = useState('https://via.placeholder.com/100');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const docRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setUsername(data.username);
          if (data.avatarUrl) {
            setAvatarUrl(data.avatarUrl);
          }
        } else {
          // If the document does not exist, create it
          await setDoc(docRef, { username: 'New User', avatarUrl: '', userId: currentUser.uid });
          setUsername('New User');
        }
      }
    });

    return unsubscribe;
  }, []);

  const handleImageUpload = async (uri) => {
    if (!user) return;
    const response = await fetch(uri);
    const blob = await response.blob();

    const imageName = uri.substring(uri.lastIndexOf('/') + 1);
    const imageRef = ref(storage, `avatars/${user.uid}/${imageName}`);
    const uploadResult = await uploadBytesResumable(imageRef, blob);
    const downloadUri = await getDownloadURL(uploadResult.ref);

    await updateDoc(doc(db, "users", user.uid), {
      avatarUrl: downloadUri,
    });

    setAvatarUrl(downloadUri);
  };

  const handleAvatarPress = () => {
    Alert.alert(
      'Select an option',
      '',
      [
        {
          text: 'Take Photo',
          onPress: async () => {
            const tmpUri = await handleTakePhoto();
            if (tmpUri) {
              await handleImageUpload(tmpUri);
            }
          },
        },
        {
          text: 'Choose from Library',
          onPress: async () => {
            const tmpUris = await handleSelectImage();
            if (tmpUris && tmpUris.length > 0) {
              await handleImageUpload(tmpUris[0]); // Assuming only one image is selected
            }
          },
        },
        { text: 'Cancel', style: 'cancel' },
      ],
      { cancelable: true }
    );
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      Alert.alert('Success', 'User logged out successfully');
      setUser(null);
      setUsername("");
      setAvatarUrl('https://via.placeholder.com/100');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      {user ? (
        <>
          <TouchableOpacity onPress={handleAvatarPress}>
            <Image source={{ uri: avatarUrl }} style={styles.avatar} />
          </TouchableOpacity>
          <Text style={styles.userName}>{username}</Text>
          <Text style={styles.userName}>{user.email}</Text>
          <Button title="Logout" onPress={handleLogout} />
          <Button title="Notifications" onPress={() => navigation.navigate('NotificationCenter')} />
        </>
      ) : (
        <>
          <Button title="Login" onPress={() => navigation.navigate('LogIn')} />
          <Button title="Sign Up" onPress={() => navigation.navigate('SignUp')} />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  userName: {
    fontSize: 20,
    marginBottom: 20,
  },
});

export default ProfileScreen;
