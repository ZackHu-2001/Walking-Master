import { useEffect, useState } from "react";
import { View, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { getGameInfo } from "../Firebase/firestoreHelper";
import Tile from "../Components/Tile";
import { useRoute } from "@react-navigation/native";
import { Portal, Modal, Button, IconButton } from "react-native-paper";
import { Dimensions } from "react-native";
import { handleSelectImage, handleTakePhoto } from "../ImageManager";

const GameScreen = ({ navigation }) => {
  const [gameInfo, setGameInfo] = useState(null);
  const [tiles, setTiles] = useState([]);
  const [currentTile, setCurrentTile] = useState(null);
  const route = useRoute();
  const { gameId } = route.params;
  const [visible, setVisible] = useState(false);
  const [imageUri, setImageUri] = useState(null);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  useEffect(() => {
    const fetchGameInfo = async () => {
      const gameInfo = await getGameInfo(gameId);
      navigation.setOptions({ title: gameInfo?.name });
      setTiles(gameInfo.tiles);
      setGameInfo(gameInfo);
    }

    fetchGameInfo();
  }, []);

  const handleButtonPress = () => {
    Alert.alert(
      'Select an option',
      '',
      [
        { text: 'Take Photo', onPress: () => handleTakePhoto(setImageUri) },
        { text: 'Choose from Library', onPress: () => handleSelectImage(setImageUri) },
        { text: 'Cancel', style: 'cancel' },
      ],
      { cancelable: true }
    );
  };

  let overallIndex = 0;

  return (
    <>
      <View style={styles.container}>
        {
          gameInfo &&
          <View style={styles.tilesContainer}>
            {
              tiles.map((row, index) => {
                return <View key={index} style={styles.tilesRow}>
                  {
                    row['cells'].map((tile, index) => {
                      overallIndex++;
                      return <Tile key={index} imgUrl={tile.bgImgUrl} visited={tile.visited} onPress={() => {
                        showModal()
                        setCurrentTile(overallIndex - 1)
                      }} />
                    })
                  }
                </View>
              })
            }
          </View>
        }
      </View>

      <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={modalStyles.modal}>
      <View style={modalStyles.container}>
        <TouchableOpacity >
          <IconButton
            onPress={handleButtonPress}
            icon="plus"
            color={'#000'}
            size={60}
            style={{ width: 120, height: 120, backgroundColor: '#898989' }}
          />
        </TouchableOpacity>
        {

        }
      </View>
    </Modal >
    </>
  );
}

const modalStyles = StyleSheet.create({
  modal: {
    width: Dimensions.get('window').width - 40,
    padding: 20,
    marginRight: 20,
  },
  container: {
    width: Dimensions.get('window').width - 40,
    flexDirection: 'column',
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
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  bgImg: {
    flex: 1,
    resizeMode: 'cover',
  },
  tilesContainer: {
    flex: 1,
    flexDirection: 'column',
    flexWrap: 'wrap',
    gap: 25,
    transform: [{ translateY: Dimensions.get('window').height / 6 }],
    // justifyContent: 'center',
    alignItems: 'center'
  },
  tilesRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around'
  }
});

export default GameScreen;
