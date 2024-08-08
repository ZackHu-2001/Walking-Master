import React, { useContext } from 'react';
import { View, Button, StyleSheet } from 'react-native';
import { addGame } from '../Firebase/firestoreHelper';
import { Context } from '../Context/context';

const CreateRoomScreen = () => {
  // const context = useContext(Context);
  // const { userId } = context;

  const createNewGame = async (size, bgImgUrl) => {
    game = {
      timeStamp: Date.now(),
      creater: null,
      size: size,
      bgImgUrl: bgImgUrl,
      tiles: [],
    }

    for (let i = 0; i < size; i++) {
      const row = {
        cells: []
      };
      for (let j = 0; j < size; j++) {
        row.cells.push({
          photos: [],
          visited: false,
          bgImgUrl: bgImgUrl
        });
      }
      game.tiles.push(row);
    }

    const gameId = await addGame(game);
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
