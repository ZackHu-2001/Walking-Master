import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity, Image } from 'react-native'; // Ensure Image is imported from 'react-native'
import { getDoc, doc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../Firebase/FirebaseSetup';
import { handleSelectImage, handleTakePhoto } from '../ImageManager';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useNavigation } from '@react-navigation/native';
import Context from '../Context/context';
import { IconButton, Avatar, ActivityIndicator } from 'react-native-paper'; // Import Avatar and ActivityIndicator components from react-native-paper
import { signOut } from 'firebase/auth';
import * as ImageManipulator from 'expo-image-manipulator';

const ProfileScreen = () => {
  const { user, setUser } = useContext(Context);
  const navigation = useNavigation();
  const [avatarUri, setAvatarUri] = useState(null); // Set default to null
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(true); // State for loading indicator

  useEffect(() => {
    if (user) {
      setEmail(user.email || '');
      fetchUserData(user.uid);
    } else {
      console.log('No user in context');
      setIsLoading(false); // Stop loading if no user
    }
  }, [user]);

  const fetchUserData = async (uid) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setUsername(userData.username || '');
        setAvatarUri(userData.avatarUrl || null); // Set avatarUri based on the fetched data
      } else {
        console.log('No such user document!');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setIsLoading(false); // Stop loading after data fetch
    }
  };

  const uploadImageAsync = async (uri, path) => {
    try {
      console.log('Attempting to upload image from URI:', uri);
      const storage = getStorage();
      const storageRef = ref(storage, path);

      const response = await fetch(uri);
      console.log('Fetch response:', response);
      const blob = await response.blob();
      console.log('Blob created:', blob);

      console.log('Uploading image...');
      await uploadBytes(storageRef, blob);
      console.log('Image uploaded to storage');

      const downloadUrl = await getDownloadURL(storageRef);
      console.log('Download URL:', downloadUrl);
      return downloadUrl;
    } catch (error) {
      console.error('Error in uploadImageAsync:', error);
      Alert.alert('Upload Error', error.message);
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
    try {
      // compress and resize the image to 800px width
      const manipulatedImage = await ImageManipulator.manipulateAsync(
        uri,
        [{ resize: { width: 800 } }],
        { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
      );

      console.log('Processing image with URI:', manipulatedImage.uri);
      const uploadedUrl = await uploadImageAsync(manipulatedImage.uri, `avatars/${user.uid}`);
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
    } catch (error) {
      console.error('Error in processImage:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      Alert.alert('Success', 'User logged out successfully');
      navigation.navigate('Login');
    } catch (error) {
      console.error('Error logging out:', error);
      Alert.alert('Error', error.message);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator animating={true} size="large" color="#1C5D3A"/>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {user ? (
        <>
          <View style={styles.avatarContainer}>
            <TouchableOpacity style={styles.avatarTouchable} onPress={handleAvatarPress}>
              {avatarUri ? (
                <Image source={{ uri: avatarUri }} style={styles.avatar} />
              ) : (
                <Avatar.Icon size={150} icon="account" style={styles.avatarIcon} />
              )}
              <View style={styles.cameraIconContainer}>
                <IconButton icon="camera" size={24} style={styles.cameraIcon} />
              </View>
            </TouchableOpacity>
          </View>
          <Text style={styles.userName}>{username}</Text>
          <Text style={styles.userEmail}>{email}</Text>
          <TouchableOpacity style={{
            backgroundColor: '#E57373',
            padding: 15,
            borderRadius: 10,
            width: '100%',
            alignItems: 'center',
            marginVertical: 10,
          }} onPress={handleLogout}
          >
            <Text style={{ color: '#1C5D3A', fontSize: 18 }}>Log Out</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              backgroundColor: '#D3E4CD',
              padding: 15,
              borderRadius: 10,
              alignItems: 'center',
              width: '100%',
            }}
            onPress={() => navigation.navigate('NotificationCenter')}
          >
            <Text style={{ color: '#1C5D3A', fontSize: 18 }}>Set Reminder</Text>
          </TouchableOpacity>
        </>
      ) : (
        <></>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 20,
    marginTop: 10,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatarTouchable: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    width: 150,
    height: 150,
    borderRadius: 75, // Half of the width/height to make it circular
    marginBottom: 10,
  },
  avatarIcon: {
    backgroundColor: '#e0e0e0',
    marginBottom: 10,
  },
  cameraIconContainer: {
    position: 'absolute',
    bottom: 10,
    right: 10,
  },
  cameraIcon: {
    backgroundColor: '#fff',
  },
  userName: {
    fontSize: 20, // Slightly increased font size
    fontWeight: 'bold',
    color: '#4A4A4A',
    marginBottom: 5,
    textAlign: 'center',
  },
  userEmail: {
    fontSize: 16, // Slightly increased font size
    color: '#7A7A7A',
    marginBottom: 20,
    textAlign: 'center',
  },
});

export default ProfileScreen;
