import React, { useContext } from 'react';
import { View, Button, StyleSheet } from 'react-native';
import { addGame } from '../Firebase/firestoreHelper';
import Context from '../Context/context';
import { imgNames, baseURL } from '../misc';

const CreateRoomScreen = () => {
  const context = useContext(Context);
  const { userId } = context;

  const createNewGame = async (size, bgImgUrl) => {
    game = {
      timeStamp: Date.now(),
      creater: userId,
      size: size,
      bgImgRef: bgImgUrl,
      tiles: [],
    }

    const exist = new Set();
    for (let i = 0; i < size; i++) {
      const row = {
        cells: []
      };
      for (let j = 0; j < size; j++) {
        let idx = Math.random() * imgNames.length;
        while (exist.has(idx)) {
          idx = Math.random() * imgNames.length;
        }

        row.cells.push({
          photos: [],
          visited: false,
          bgImgRef: baseURL + imgNames[idx]
        });
      }
      game.tiles.push(row);
    }

    const gameId = await addGame(game);
    // navigator.
    return gameId
  }

  return (
    <View style={styles.container}>
      <Button onPress={() => createNewGame(3, '')} title='Create new game' />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CreateRoomScreen;
