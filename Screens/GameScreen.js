import { useEffect, useState } from "react";
import { View, ImageBackground, Image, StyleSheet } from "react-native";
import { getGameInfo } from "../Firebase/firestoreHelper";
import { Dimensions } from "react-native";
import Tile from "../Components/tile";
import FloatingActionButton from "../Components/FloatingActionButton";
import { getStorage, ref, getDownloadURL } from "firebase/storage";

import { storage } from "../Firebase/FirebaseSetup";
const GameScreen = ({ gameId, game }) => {
  const [gameInfo, setGameInfo] = useState(null);
  const [tiles, setTiles] = useState([]);
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));
  const [bgImgUrl, setBgImgUrl] = useState(null);

  useEffect(() => {
    console.log(game['bgImgUrl']);

    // const ref = ref(storage, game['bgImgUrl']);
    // (async () => {
    //   // const storage = getStorage();
    //   getDownloadURL(ref(storage, game['bgImgUrl'])).then((url) => {
    //     setBgImgUrl(url);
    //     console.log(url)
    //   }).catch((error) => {
    //     console.log(error);
    //   });
    // })()


    setGameInfo(game);
    (async () => {
      const gameInfo = await getGameInfo(gameId);
      setTiles(gameInfo.tiles);
      setGameInfo(gameInfo);
    })();
  }, []);

  return (
    <View style={styles.container}>
      <ImageBackground source={{ uri: bgImgUrl }} style={styles.bgImg} />

      {/* {
        gameInfo &&
          <View style={styles.tilesContainer}>
            {
              tiles.map((row, index) => {
                <View key={index} style={styles.tilesRow}>
                  {
                    row.map((tile, index) => {
                      return <View style={{backgroundColor: 'red', width: 100, height: 100}}></View>
                      // return <Tile key={index} imgUrl={tile.photos[0] ? tile.photos[0] : tile.bgImgUrl} visited={tile.visited} width={dimensions.width / gameInfo.cols} />
                    })
                  }
                </View>
              })
            }
          </View>
      } */}
      {/* <FloatingActionButton /> */}
    </View>
  );
}

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
    justifyContent: 'center',
    alignItems: 'center'
  },
  tilesRow: {
    backgroundColor: 'red',
    flexDirection: 'row',
    gap: 25
  }
});

export default GameScreen;
