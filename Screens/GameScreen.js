import { useEffect, useState } from "react";
import { View, ImageBackground, Image, StyleSheet } from "react-native";
import { getGameInfo } from "../Firebase/firestoreHelper";
import { Dimensions } from "react-native";
import Tile from "../Components/Tile";
import FloatingActionButton from "../Components/FloatingActionButton";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { storage } from "../Firebase/FirebaseSetup";
import { useRoute } from "@react-navigation/native";

const GameScreen = () => {
  const [gameInfo, setGameInfo] = useState(null);
  const [tiles, setTiles] = useState([]);
  // const [dimensions, setDimensions] = useState(Dimensions.get('window'));
  // const [bgImgUrl, setBgImgUrl] = useState(null);

  const route = useRoute();
  const { gameId } = route.params;

  useEffect(() => {

    (async () => {
      const gameInfo = await getGameInfo(gameId);
      console.log(gameInfo.tiles)
      setTiles(gameInfo.tiles);

      console.log(gameInfo);
      setGameInfo(gameInfo);
    })();
  }, []);

  return (
    <View style={styles.container}>
      {/* <ImageBackground source={{ uri: bgImgUrl }} style={styles.bgImg} /> */}

      {
        gameInfo &&
          <View style={styles.tilesContainer}>
            {
              tiles.map((row, index) => {
                <View key={index} style={styles.tilesRow}>
                  {
                    row['cells'].map((tile, index) => {
                      // return <View style={{backgroundColor: 'red', width: 100, height: 100}}></View>
                      return <Tile key={index} imgUrl={tile.photos[0] ? tile.photos[0] : tile.bgImgUrl} visited={tile.visited}/>
                    })
                  }
                </View>
              })
            }
          </View>
      }
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
