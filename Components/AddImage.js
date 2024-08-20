import React, { useContext, useEffect } from 'react'
import { TextInput, Text, Image, View, TouchableOpacity } from 'react-native'
import { Button, ActivityIndicator } from 'react-native-paper'
import { Ionicons } from '@expo/vector-icons'
import { addComment } from '../Firebase/firestoreHelper'
import modalStyles from '../Styles/ModalStyle'
import Context from '../Context/context'
import * as Location from 'expo-location';

const AddImage = ({
  navigation,
  uploadImages,
  setImageList,
  handleAddImageDismiss,
  setImageListVisible,
}) => {
  const { user, setUser } = useContext(Context)
  const [focus, setFocus] = React.useState(false)
  const [comment, setComment] = React.useState('')
  const [location, setLocation] = React.useState(null)
  const [isLoading, setIsLoading] = React.useState(false)

  const submit = async () => {
    try {
      console.log('user', user);
      setIsLoading(true);
      let commentRef = null;

      if (!comment) {
        console.log("no comment");
        commentRef = await addComment({
          comments: []
        });
      } else {
        commentRef = await addComment({
          comments: [{
            content: comment,
            creater: user.uid,
          }]
        });
      }
      const photos = uploadImages.map(uri => ({ uri: uri, comment: commentRef, location: location }));

      setImageList(prev => {
        return [...prev, ...photos];
      });
      handleAddImageDismiss();
      setImageListVisible(true);
    } catch (error) {
      console.error('Failed to submit comment:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={[modalStyles.container, focus && modalStyles.focus]}>
      <Image source={{ uri: uploadImages[0] }} style={modalStyles.addImage} />

      <TextInput
        style={modalStyles.input}
        placeholder='Add your comment...'
        onChangeText={(value) => setComment(value)}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        value={comment}
      />

      <TouchableOpacity onPress={() => {
        navigation.navigate('LocationSelect', { setPickedLocation: setLocation })
      }}
      style={{
        width: '100%', display: 'flex', flexDirection: 'row',
        alignItems: 'center'
      }}>

        <Ionicons name="location-outline" size={30} />
        {
          location ? <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={{ marginLeft: 10, width: '80%' }}>{location.name+' | '+location.address}</Text>: <Text style={{ marginLeft: 10 }}>Select Location</Text>
        }

      </TouchableOpacity>
      {
        isLoading ? <ActivityIndicator style={{ marginBottom: -20, height: 40 }} /> : <Button style={[modalStyles.button, { marginBottom: -20, height: 40 }]} onPress={submit} >Release</Button>
      }

    </View>
  )
}


export default AddImage;
