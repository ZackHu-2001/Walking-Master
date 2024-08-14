import { useEffect, useState } from "react";
import { View, StyleSheet, TouchableOpacity, Alert, Image } from "react-native";
import { getGameInfo, updateGame } from "../Firebase/firestoreHelper";
import Tile from "../Components/Tile";
import { useRoute } from "@react-navigation/native";
import { Modal, IconButton } from "react-native-paper";
import { Dimensions, ImageBackground } from "react-native";
import ImageList from "../Components/ImageList";
import ImageDetail from "../Components/ImageDetail";

const GameScreen = ({ navigation }) => {
  const [gameInfo, setGameInfo] = useState(null);
  const [tiles, setTiles] = useState([]);
  const [currentTile, setCurrentTile] = useState({
    row: 0,
    col: 0,
    data: null
  });
  const route = useRoute();
  const { gameId } = route.params;
  const [visible, setVisible] = useState(false);
  const [imageList, setImageList] = useState([]);
  const [modalState, setModalState] = useState({
    content: ImageList,
    props: { imageList: [] }
  });

  const updateModalContent = (content, props) => {
    setModalState({ content, props });
  };

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  const handleDismiss = () => {
    hideModal();
    let newTiles = tiles;
    newTiles[currentTile.row]['cells'][currentTile.col].photos = imageList;
    setTiles(newTiles);
    updateGame(gameId, { tiles: newTiles });
    setImageList([]);
  }

  useEffect(() => {
    updateModalContent(ImageList, { imageList, setImageList });
  }, [imageList]);

  useEffect(() => {
    const fetchGameInfo = async () => {
      const gameInfo = await getGameInfo(gameId);
      navigation.setOptions({ title: gameInfo?.name });
      setTiles(gameInfo.tiles);
      setGameInfo(gameInfo);
    }

    fetchGameInfo();
    updateModalContent(ImageList, { imageList: imageList, setImageList: setImageList });
  }, []);

  return (
    <>
      <View style={styles.container}>
        {
          gameInfo &&
          <View style={styles.tilesContainer}>
            {
              tiles.map((row, rowIndex) => {
                return <View key={rowIndex} style={styles.tilesRow}>
                  {
                    row['cells'].map((tile, colIndex) => {
                      // const tileIndex = rowIndex * row['cells'].length + colIndex;
                      return <Tile key={colIndex} imgUrl={tile.bgImgUrl} visited={tile.visited} onPress={() => {
                        // console.log(tile)
                        setImageList(tile.photos)
                        showModal()
                        updateModalContent(ImageList, { imageList: imageList, setImageList: setImageList });
                        setCurrentTile({
                          row: rowIndex,
                          col: colIndex,
                          data: tile
                        })
                      }} />
                    })
                  }
                </View>
              })
            }
          </View>
        }
      </View>

      <Modal visible={visible} onDismiss={handleDismiss} contentContainerStyle={modalStyles.modal}>
        <modalState.content {...modalState.props} />
      </Modal>
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
    alignItems: 'center'
  },
  tilesRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around'
  }
});

export default GameScreen;
