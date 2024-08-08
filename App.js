import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { PaperProvider } from 'react-native-paper';

export default function App() {

  const createNewGame = (size, bgImgUrl, creater) => {


    console.log(Date.now());
    game = {
      timeStamp: Date.now(),
      creater: creater,
      size: size,
      bgImgUrl: bgImgUrl,
      tiles: [],
    }

    // Math.random() *
    for (let i = 0; i < size; i++) {
      row = [];
      for (let j = 0; j < size; j++) {
        row.push({
          photos: [],
          visited: false,
          bgImgUrl: bgImgUrl
        });
      }
      game.tiles.push(row);
    }

  }
  return (
    <PaperProvider>
      <View style={styles.container}>
        <GameScreen />
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
