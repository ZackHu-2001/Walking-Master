import React, { useContext } from 'react'
import { TextInput, Text, Dimensions, Image, View, StyleSheet, TouchableOpacity } from 'react-native'
import { Button, ActivityIndicator } from 'react-native-paper'
import { Ionicons } from '@expo/vector-icons'
import { addComment } from '../Firebase/firestoreHelper'
import modalStyles from '../Styles/ModalStyle'
import Context from '../Context/context'

const AddImage = ({
  uploadImages,
  setImageList,
  handleAddImageDismiss,
  setImageListVisible,
}) => {
  const { user, setUser } = useContext(Context)
  const [focus, setFocus] = React.useState(false)
  const [comment, setComment] = React.useState('')
  const [location, setLocation] = React.useState('')
  const [isLoading, setIsLoading] = React.useState(false)

  const submit = async () => {
    console.log('user', user)
    setIsLoading(true)
    const commentRef = await addComment({
      comments: [{
        content: comment,
        creater: user.uid,
      }]
    });
    const photos = uploadImages.map(uri => ({ uri: uri, comment: commentRef, location: location }))

    setImageList(prev => {
      return [...prev, ...photos]
    })
    setIsLoading(false)
    handleAddImageDismiss()
    setImageListVisible(true)
  }

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
      <TouchableOpacity style={{
        width: '100%', display: 'flex', flexDirection: 'row',
         alignItems: 'center'
      }}>

        <Ionicons name="location-outline" size={30} />
        <Text style={{marginLeft: 10}}>Select Location</Text>
      </TouchableOpacity>
      {
        isLoading ? <ActivityIndicator style={{ marginBottom: -20, height: 40 }} /> : <Button style={[modalStyles.button, { marginBottom: -20, height: 40 }]} onPress={submit} >Release</Button>
      }

    </View>
  )
}


export default AddImage;