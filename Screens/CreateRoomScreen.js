import React, { useContext, useState } from 'react';
import { View, Button, StyleSheet, Text, TextInput, Alert } from 'react-native';
import { addGame, getUser,updateUser } from '../Firebase/firestoreHelper';
import Context from '../Context/context';
import { imgNames, baseURL } from '../misc';
import { RadioButton } from 'react-native-paper';
import { auth, storage } from '../Firebase/FirebaseSetup';
import { getStorage, ref, getDownloadURL } from "firebase/storage";

const CreateRoomScreen = ({ navigation }) => {
  const context = useContext(Context);
  const { user } = context;
  const [gameName, setGameName] = useState('');
  const [boardSize, setBoardSize] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const createNewGame = async (size, bgImgUrl) => {
    setSubmitted(true);
    if (!gameName) {
      Alert.alert('Validation Error', 'Please enter the game name.');
      return;
    }
    if (!boardSize) {
      Alert.alert('Validation Error', 'Please select the board size.');
      return;
    }

    game = {
      timeStamp: Date.now(),
      creater: auth.currentUser.uid,
      size: size,
      bgImgUrl: null,
      tiles: [],
      name: gameName,
    }

    const exist = new Set();
    for (let i = 0; i < size; i++) {
      const row = {
        cells: []
      };
      for (let j = 0; j < size; j++) {
        let idx = Math.floor(Math.random() * imgNames.length);
        while (exist.has(idx)) {
          idx = Math.floor(Math.random() * imgNames.length);
        }
        const imgUrl = await getImgUrl(baseURL + imgNames[idx]);
        row.cells.push({
          photos: [],
          visited: false,
          bgImgUrl: imgUrl
        });
      }
      game.tiles.push(row);
    }
    const gameId = await addGame(game);
    const newUser = await getUser(user.uid);
    newUser.games.push(gameId);
    await updateUser(user.uid, newUser);

    navigation.navigate('Game', { gameId: gameId });
  }

  const getImgUrl = async (imgRef) => {
    const storageRef = ref(storage, imgRef);
    const url = await getDownloadURL(storageRef);
    return url;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Game Name</Text>
      <TextInput
        style={styles.input}
        value={gameName}
        onChangeText={setGameName}
        placeholder="Enter game name"
      />

      <Text style={styles.label}>Board Size</Text>
      <View style={styles.radioContainer}>
        <RadioButton.Group onValueChange={value => setBoardSize(value)} value={boardSize}>
          <View style={styles.radioButton}>
            <RadioButton value="3" />
            <Text>3 X 3</Text>
          </View>
          <View style={styles.radioButton}>
            <RadioButton value="4" />
            <Text>4 X 4</Text>
          </View>
        </RadioButton.Group>
      </View>

      <Button onPress={() => createNewGame(3, '')} title='Create new game' />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
  },
  radioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  hint: {
    color: 'red',
    marginBottom: 10,
  },
});

export default CreateRoomScreen;
