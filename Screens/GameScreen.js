import { useEffect, useState } from "react";
import { View, Dimensions, StyleSheet, ImageBackground, Alert } from "react-native";
import { getGameInfo, updateGame } from "../Firebase/firestoreHelper";
import Tile from "../Components/Tile";
import { useRoute } from "@react-navigation/native";
import { Modal, FAB } from "react-native-paper";
import ImageList from "../Components/ImageList";
import modalStyles from "../Styles/ModalStyle";
import AddImage from "../Components/AddImage";
import ImageDetail from "../Components/ImageDetail";
import * as Clipboard from 'expo-clipboard';

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
  const [imageList, setImageList] = useState([]);
  const [currentImage, setCurrentImage] = useState(null);
  const [imageListVisible, setImageListVisible] = useState(false);
  const [imageDetailVisible, setImageDetailVisible] = useState(false);
  const [addImageVisible, setAddImageVisible] = useState(false);
  const [uploadImages, setUploadImages] = useState([]);

  const [open, setOpen] = useState(false);
  const onStateChange = ({ open }) => setOpen(open);

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const handleImageListDismiss = () => {
    setImageListVisible(false);
    let newTiles = tiles;
    newTiles[currentTile.row]['cells'][currentTile.col].photos = imageList;
    setTiles(newTiles);
    updateGame(gameId, { tiles: newTiles });
    setImageList([]);
  }

  const handleImageDetailDismiss = () => {
    setImageListVisible(true);
    setImageDetailVisible(false);
  }

  const dismissAddImage = () => {
    setAddImageVisible(false);
    setImageListVisible(true);
  }

  const handleAddImageDismiss = () => {
    Alert.alert("Confirm Exit Editing",
      "Are you sure you want to exit editing? Your changes will not be saved.",
      [
        {
          text: "Confirm",
          onPress: () => {
            setImageListVisible(true);
            setAddImageVisible(false);
          }
        },
        {
          text: "Cancel",
          onPress: () => { }
        }
      ]
    );
  }

  useEffect(() => {
    const fetchGameInfo = async () => {
      const gameInfo = await getGameInfo(gameId);
      navigation.setOptions({ title: gameInfo?.name });
      setTiles(gameInfo.tiles);
      setGameInfo(gameInfo);
    }

    fetchGameInfo();
  }, []);

  const copyCode = async () => {
    const code = gameId;
    await Clipboard.setStringAsync(code);

    Alert.alert("Room Code Copied!");
  }

  const backToHome = () => {
    navigation.navigate('GameBoard');
  }

  return (
    <>
      {
        gameInfo &&
        <ImageBackground source={{ uri: gameInfo.bgImgUrl }} style={styles.bgImg} />
      }
      <View style={styles.container}>
        {
          gameInfo &&
          <View style={styles.tilesContainer}>
            {
              tiles.map((row, rowIndex) => {
                return <View key={rowIndex} style={styles.tilesRow}>
                  {
                    row['cells'].map((tile, colIndex) => {
                      return <Tile key={colIndex} imgUrl={tile.bgImgUrl} visited={tile.visited} onPress={() => {
                        setImageList(tile.photos)
                        setImageListVisible(true);
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

      <Modal visible={imageListVisible} onDismiss={handleImageListDismiss} contentContainerStyle={modalStyles.modal}>
        <ImageList imageList={imageList} setAddImageVisible={setAddImageVisible} setImageDetailVisible={setImageDetailVisible}
          setImageListVisible={setImageListVisible} setCurrentImage={setCurrentImage} setUploadImages={setUploadImages}
          handleImageListDismiss={handleImageListDismiss} />
      </Modal>

      <Modal visible={imageDetailVisible} onDismiss={handleImageDetailDismiss} contentContainerStyle={modalStyles.modal}>
        <ImageDetail currentImage={currentImage} setImageDetailVisible={setImageDetailVisible} navigation={navigation}
          uploadImages={uploadImages} setImageList={setImageList} />
      </Modal>

      <Modal visible={addImageVisible} onDismiss={handleAddImageDismiss} contentContainerStyle={modalStyles.modal}>
        <AddImage uploadImages={uploadImages} setImageList={setImageList} navigation={navigation}
          handleAddImageDismiss={dismissAddImage} setImageListVisible={setImageListVisible} />
      </Modal>

      {
        !addImageVisible && !imageDetailVisible && !imageListVisible &&
        <FAB.Group
          open={open}
          fabStyle={{ backgroundColor: '#D3E4CD' }}
          style={{ paddingBottom: 50, paddingRight: 10, zIndex: 2 }}
          visible
          icon={open ? 'close' : 'progress-pencil'}
          actions={[
            {
              icon: 'content-copy',
              label: 'Share Journey Code',
              onPress: () => copyCode(),
            },
            {
              icon: 'home-variant-outline',
              label: 'Back to Home',
              onPress: () => backToHome(),
            },
          ]}
          onStateChange={onStateChange}
          onPress={() => {
            if (open) {
              // do something if the speed dial is open
            }
          }}
        />
      }

    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 150,
  },
  bgImg: {
    position: 'absolute',
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    zIndex: -1
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
