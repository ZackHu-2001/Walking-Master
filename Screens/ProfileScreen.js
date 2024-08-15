import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Button, StyleSheet, Image, Alert, TouchableOpacity } from 'react-native';
import { getDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../Firebase/FirebaseSetup';
import { handleSelectImage, handleTakePhoto } from '../ImageManager';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useNavigation } from '@react-navigation/native';
import Context from '../Context/context';

const ProfileScreen = () => {
  const { user } = useContext(Context);
  const navigation = useNavigation(); // Add this to use navigation
  const [avatarUri, setAvatarUri] = useState('https://via.placeholder.com/100'); // Default avatar
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (user) {
      setEmail(user.email || '');
      fetchUserData(user.uid);
    }
  }, [user]);

  const fetchUserData = async (uid) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setUsername(userData.username || '');
        setAvatarUri(userData.avatarUrl || 'https://via.placeholder.com/100');
      } else {
        console.log('No such user document!');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const uploadImageAsync = async (uri, path) => {
    try {
      const storage = getStorage();
      const storageRef = ref(storage, path);
      const response = await fetch(uri);
      const blob = await response.blob();

      await uploadBytes(storageRef, blob);

      return await getDownloadURL(storageRef);
    } catch (error) {
      console.error('Error uploading image:', error);
      return null;
    }
  };

  const handleAvatarPress = async () => {
    Alert.alert(
      'Select an option',
      '',
      [
        {
          text: 'Take Photo',
          onPress: async () => {
            const uri = await handleTakePhoto();
            if (uri) await processImage(uri);
          },
        },
        {
          text: 'Choose from Library',
          onPress: async () => {
            const uriList = await handleSelectImage();
            if (uriList && uriList.length > 0) await processImage(uriList[0]); // process the first image
          },
        },
        { text: 'Cancel', style: 'cancel' },
      ],
      { cancelable: true }
    );
  };

  const processImage = async (uri) => {
    const uploadedUrl = await uploadImageAsync(uri, `avatars/${user.uid}`);
    if (uploadedUrl) {
      setAvatarUri(uploadedUrl);

      try {
        if (user?.uid) {
          await updateDoc(doc(db, 'users', user.uid), { avatarUrl: uploadedUrl });
          Alert.alert('Success', 'Avatar updated successfully!');
        } else {
          Alert.alert('Error', 'User ID is missing.');
        }
      } catch (error) {
        console.error('Error updating avatar:', error);
        Alert.alert('Error', 'Failed to update avatar.');
      }
    } else {
      Alert.alert('Error', 'Failed to upload image.');
    }
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      Alert.alert('Success', 'User logged out successfully');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      {user ? (
        <>
          <TouchableOpacity onPress={handleAvatarPress}>
            <Image source={{ uri: avatarUri }} style={styles.avatar} />
          </TouchableOpacity>
          <Text style={styles.userName}>{username}</Text>
          <Text style={styles.userEmail}>{email}</Text>
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
    marginBottom: 10,
  },
  userEmail: {
    fontSize: 16,
    marginBottom: 20,
  },
});

export default ProfileScreen;
