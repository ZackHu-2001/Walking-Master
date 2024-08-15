import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Button, StyleSheet, Image, Alert, TouchableOpacity } from 'react-native';
import { getDoc, doc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../Firebase/FirebaseSetup';
import { handleSelectImage, handleTakePhoto } from '../ImageManager';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useNavigation } from '@react-navigation/native';
import Context from '../Context/context';
import { signOut } from 'firebase/auth';

const ProfileScreen = () => {
  const { user, setUser } = useContext(Context);
  const navigation = useNavigation();
  const [avatarUri, setAvatarUri] = useState('https://via.placeholder.com/100'); // Default avatar
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (user) {
      console.log('User is available:', user);
      setEmail(user.email || '');
      fetchUserData(user.uid);
    } else {
      console.log('No user in context');
    }
  }, [user]);

  const fetchUserData = async (uid) => {
    console.log('Fetching user data for UID:', uid);
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        console.log('User data fetched:', userData);
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
    console.log('Uploading image to path:', path);
    try {
      const storage = getStorage();
      const storageRef = ref(storage, path);
      const response = await fetch(uri);
      const blob = await response.blob();

      await uploadBytes(storageRef, blob);

      const downloadUrl = await getDownloadURL(storageRef);
      console.log('Image uploaded, download URL:', downloadUrl);
      return downloadUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      return null;
    }
  };

  const handleAvatarPress = async () => {
    console.log('Avatar pressed');
    Alert.alert(
      'Select an option',
      '',
      [
        {
          text: 'Take Photo',
          onPress: async () => {
            console.log('Take Photo selected');
            const uri = await handleTakePhoto();
            if (uri) await processImage(uri);
          },
        },
        {
          text: 'Choose from Library',
          onPress: async () => {
            console.log('Choose from Library selected');
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
    console.log('Processing image:', uri);
    const uploadedUrl = await uploadImageAsync(uri, `avatars/${user.uid}`);
    if (uploadedUrl) {
      console.log('Image uploaded successfully:', uploadedUrl);
      setAvatarUri(uploadedUrl);

      try {
        if (user?.uid) {
          console.log('Updating user document with new avatar URL');
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
      console.log('Logging out');
      await signOut(auth);
      setUser(null);
      Alert.alert('Success', 'User logged out successfully');
      navigation.navigate('Login');
    } catch (error) {
      console.error('Error logging out:', error);
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
