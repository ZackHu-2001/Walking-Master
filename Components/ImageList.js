import React from 'react';
import { StyleSheet, Image, View, TouchableOpacity, Alert } from 'react-native';
import { handleSelectImage, handleTakePhoto } from '../ImageManager';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../Firebase/FirebaseSetup';
import { Dimensions } from 'react-native';

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
  setImageList,
}) => {
  const handleButtonPress = () => {
    Alert.alert(
      'Select an option',
      '',
      [
        {
          text: 'Take Photo', onPress: async () => {
            const tmpUri = await handleTakePhoto();
            if (!tmpUri) return;
            const uri = await uploadImageToFirebase(tmpUri);
            setImageList([...imageList, uri]);
          }
        },
        {
          text: 'Choose from Library', onPress: async () => {
            const tmpUris = await handleSelectImage();
            if (!tmpUris) return;
            for (let i = 0; i < tmpUris.length; i++) {
              const uri = await uploadImageToFirebase(tmpUris[i]);
              tmpUris[i] = uri;
            }
            setImageList([...imageList, ...tmpUris]);
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
          console.log(image);
          return <TouchableOpacity key={index} onPress={() => {
            setModalContent(ImageDetail)
          }}>
            <Image source={{ uri: image }} style={modalStyles.image} />
          </TouchableOpacity>
        })
      }
      <TouchableOpacity onPress={handleButtonPress}>
        <Image source={{
          uri: 'assets/SVG/add.svg'
        }} style={modalStyles.addButton} />
      </TouchableOpacity>
    </View>
  )
}

const modalStyles = StyleSheet.create({
  modal: {
    width: Dimensions.get('window').width - 40,
    padding: 20,
    marginRight: 20,
  },
  container: {
    width: Dimensions.get('window').width - 40,
    flexDirection: 'row',
    flexWrap: 'wrap',
    overflow: 'scroll',
    justifyContent: 'space-around',
    gap: 15,
    maxHeight: 470,
    paddingTop: 40,
    paddingBottom: 40,
    paddingLeft: 25,
    paddingRight: 25,
    backgroundColor: 'white',
    borderRadius: 20,
  },
  card: {
    width: '100%',
    flexDirection: 'column',
    gap: 10,
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 15,
  },
  addButton: {
    width: 120,
    height: 120,
    backgroundColor: '#898989',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ImageList;
