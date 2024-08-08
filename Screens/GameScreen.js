import { useEffect, useState } from "react";
import { View, ImageBackground, StyleSheet } from "react-native";
import { getGameInfo } from "../Firebase/firestoreHelper";
import { Dimensions } from "react-native";
import Tile from "../Components/tile";
import FloatingActionButton from "../Components/FloatingActionButton";

const GameScreen = ({ gameId }) => {
  const [gameInfo, setGameInfo] = useState(null);
  const [tiles, setTiles] = useState([]);
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));

  useEffect(() => {
    (async () => {
      const gameInfo = await getGameInfo(gameId);
      setTiles(gameInfo.tiles);
      setGameInfo(gameInfo);
    })();
  }, []);

  return (
    <View>
      <ImageBackground source={{ uri: gameInfo.bgImgUrl }} style={styles.bgImg}>
        <View style={styles.tilesContainer}>
        {
          tiles.map((row, index) => {
            <View key={index} style={styles.tilesRow}>
              {
                row.map((tile, index) => {
                  return <Tile key={index} imgUrl={tile.photos[0] ? tile.photos[0] : tile.bgImgUrl} visited={tile.visited} width={dimensions.width / gameInfo.cols} />
                })
              }
            </View>
          })
        }
        </View>
      </ImageBackground>
      
      <FloatingActionButton />
    </View>
  );
}

styles = StyleSheet.create({
  bgImg: {
    flex: 1,
    resizeMode: 'cover',
  },
  tilesContainer: {
    flexDirection: 'column',
    flexWrap: 'wrap',
    gap: 25,
    justifyContent: 'center',
    alignItems: 'center'
  },
  tilesRow: {
    flexDirection: 'row',
    gap: 25
  }
});

export default GameScreen;
