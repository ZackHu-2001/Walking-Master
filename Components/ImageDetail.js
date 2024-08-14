import React from 'react'
import { Image, View, StyleSheet } from 'react-native'
import { Dimensions } from 'react-native'
const ImageDetail = () => {
  return (
    <View style={modalStyles.container}>
      <Image source={null} style={modalStyles.image} />
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

export default ImageDetail;
