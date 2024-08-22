import { useEffect, useState, useContext } from 'react'
import { Image, View, Text, ScrollView, TextInput, Alert, TouchableOpacity } from 'react-native'
import { ActivityIndicator, Button } from 'react-native-paper'
import modalStyles from '../Styles/ModalStyle'
import { getUser, getCommentThroughRef, updateCommentThroughRef } from '../Firebase/firestoreHelper'
import Context from '../Context/context'
import { Ionicons } from '@expo/vector-icons'

const Comment = ({ content, creater, orientation }) => {
  const [createrInfo, setCreaterInfo] = useState(null);

  useEffect(() => {
    const fetchCreaterInfo = async () => {
      const createrInfo = await getUser(creater)
      setCreaterInfo(createrInfo)
    }
    fetchCreaterInfo()
  }, [creater])

  return (
    <>
      {
        createrInfo &&
        <View style={modalStyles.commentContainer}>
          <Text style={modalStyles.commentAuthor}>{createrInfo.username}:</Text>
          <View style={modalStyles.commentText}>
            <Text >{content}</Text>
          </View>
        </View>
      }
    </>
  )
}

const ImageDetail = ({
  currentImage,
  setImageDetailVisible,
  navigation,
}) => {
  const [comments, setComments] = useState([])
  const [comment, setComment] = useState(null);
  const [focus, setFocus] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useContext(Context)

  useEffect(() => {
    const fetchComments = async () => {
      const data = await getCommentThroughRef(currentImage.comment)
      if (data) {
        setComments(data.comments)
      }
    }
    fetchComments()
  }, [currentImage])

  const submit = async () => {
    if (!comment) {
      Alert.alert('Comment cannot be empty')
      return;
    }

    setIsLoading(true)
    const newComments = [...comments]
    newComments.push({ content: comment, creater: user.uid })
    setComments(newComments)
    setComment('')
    await updateCommentThroughRef(currentImage.comment, { comments: newComments });
    Alert.alert('Comment added successfully')
    setIsLoading(false)
  }

  return (
    <View style={[modalStyles.detailImageContainer, focus && modalStyles.focus]}>

      <View style={modalStyles.detailImage} >
        <ActivityIndicator color='#1C5D3A' size={60} style={modalStyles.largeImageLoading} />
        <Image source={{
          uri: currentImage.uri
        }} style={modalStyles.detailImage} />
      </View>

      <TouchableOpacity onPress={() => {
        navigation.navigate('InteractiveMap', { location: currentImage.location })
      }}
        style={{
          width: '100%', display: 'flex', flexDirection: 'row',
          alignItems: 'center'
        }}>

        {
          currentImage.location && <>
            <Ionicons name="location-outline" size={30} />
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={{ marginLeft: 10, width: '80%' }}>
              {currentImage.location.name + ' | ' + currentImage.location.address}
            </Text>
          </>
        }

      </TouchableOpacity>

      {
        comments === null && <ActivityIndicator color='#1C5D3A' style={{ marginTop: 10 }} />
      }
      {
        comments !== null &&
          comments.length === 0 ? <Text style={{ color: '#4f4f4f', paddingTop: 10, paddingBottom: 10 }}>No comments yet, add your first comment~</Text> :
          <>
            {
              !focus && <View style={{ height: 80, display: 'flex', width: '90%' }}>

                <ScrollView style={modalStyles.scrollView} contentContainerStyle={{ alignItems: 'flex-start' }}>
                  {
                    comments && comments.map((comment, index) => {
                      return <Comment key={index} content={comment.content} creater={comment.creater} />
                    })
                  }
                </ScrollView>
              </View>
            }
          </>
      }


      <TextInput
        style={modalStyles.input}
        placeholder='Add your comment...'
        onChangeText={(value) => setComment(value)}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        value={comment}
      />
      {
        isLoading ? <ActivityIndicator color='#1C5D3A' style={{ marginBottom: -20, height: 40 }} /> :
        <Button style={[modalStyles.button, { marginBottom: -20, height: 40 }]} onPress={submit} >Add Comment</Button>
      }
    </View>

  )
}

export default ImageDetail;
