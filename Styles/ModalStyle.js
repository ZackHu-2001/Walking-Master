import { StyleSheet, Dimensions } from 'react-native';

export default modalStyles = StyleSheet.create({
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
  addImage: {
    width: 180,
    height: 180,
    borderRadius: 15,
  },
  detailImage: {
    width: 300,
    height: 300,
    borderRadius: 15,
  },
  addButton: {
    width: 120,
    height: 120,
    backgroundColor: '#b9b9b9',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    width: "100%",
    padding: 10,
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 5,
    margin: 10,
  },
  focus: {
    transform: [{ translateY: -120 }]
  },
  button: {
    width: '100%'
  },
  detailImageContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    width: Dimensions.get('window').width - 40,
    gap: 10,
    paddingTop: 40,
    paddingBottom: 40,
    paddingLeft: 25,
    paddingRight: 25,
    backgroundColor: 'white',
    borderRadius: 20,
  },
  commentContainer: {
    width: '100%',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 5,
    marginBottom: 10,
  },
  scrollView: {
    flex: 1,
  },
  commentAuthor: {
    fontWeight: 'bold',
  },
  commentText: {
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    maxWidth: '80%',
    padding: 10,
  },
});
