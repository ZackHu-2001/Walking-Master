import React, { useEffect, useState } from 'react';
import { Image, View, TouchableOpacity, Alert } from 'react-native';
import { handleSelectImage, handleTakePhoto } from '../ImageManager';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../Firebase/FirebaseSetup';
import { ActivityIndicator } from 'react-native-paper'
import { Ionicons } from '@expo/vector-icons';
import modalStyles from '../Styles/ModalStyle';

const uploadImageToFirebase = async (uri) => {
  const response = await fetch(uri);
  const blob = await response.blob();

  const imageName = uri.substring(uri.lastIndexOf('/') + 1);
  const imageRef = ref(storage, `images/${imageName}`);
  const uploadResult = await uploadBytesResumable(imageRef, blob);  // Corrected variable name from imageBlob to blob
  const downloadUri = await getDownloadURL(uploadResult.ref);
  return downloadUri;
}

const ImageList = ({
  imageList,
  setAddImageVisible,
  setImageDetailVisible,
  setImageListVisible,
  setCurrentImage,
  setUploadImages,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleButtonPress = () => {
    Alert.alert(
      'Select an option',
      '',
      [
        {
          text: 'Take Photo', onPress: async () => {
            setIsLoading(true);
            const tmpUri = await handleTakePhoto();
            if (!tmpUri) return;
            const uri = await uploadImageToFirebase(tmpUri);
            setUploadImages([uri]);
            setIsLoading(false);
            setImageListVisible(false);
            setAddImageVisible(true);
          }
        },
        {
          text: 'Choose from Library', onPress: async () => {
            setIsLoading(true);
            const tmpUris = await handleSelectImage();
            if (!tmpUris) return;
            for (let i = 0; i < tmpUris.length; i++) {
              const uri = await uploadImageToFirebase(tmpUris[i]);
              tmpUris[i] = uri;
            }
            setUploadImages(tmpUris);
            setIsLoading(false);
            setImageListVisible(false);
            setAddImageVisible(true);
          }
        },
        { text: 'Cancel', style: 'cancel' },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={modalStyles.container}>
      {
        imageList.map((image, index) => {
          return <TouchableOpacity key={index} onPress={() => {
            setCurrentImage(image);
            setImageDetailVisible(true);
            setImageListVisible(false);
          }}>
            <ActivityIndicator color='#1C5D3A' size={40} style={modalStyles.smallImageLoading} />
            <Image source={{ uri: image.uri }} style={modalStyles.image} />
          </TouchableOpacity>
        })
      }
      <TouchableOpacity onPress={handleButtonPress} style={modalStyles.addButton}>
        {
          isLoading ? <ActivityIndicator color='#1C5D3A' size={40} /> : <Ionicons name="add-outline" size={110} color="#999999" />
        }

      </TouchableOpacity>
    </View>
  )
}

export default ImageList;
