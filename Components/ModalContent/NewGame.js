import { Text, Dimensions, View, Image, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { Button, Checkbox, ActivityIndicator } from "react-native-paper";
import React, { useEffect, useState } from "react";
import { addGame, getUser, updateUser } from "../../Firebase/firestoreHelper";
import { getDownloadURL, ref } from "firebase/storage";
import { imgNames, baseURL } from "../../misc";
import { useContext } from "react";
import Context from "../../Context/context";
import { storage } from "../../Firebase/FirebaseSetup";

const ThemeCard = ({ theme, setTheme, selected }) => {
  return (
    <TouchableOpacity onPress={() => setTheme(theme)} style={{ display: 'flex', alignItems: 'center' }}>
      <Image source={{
        uri: theme
      }} style={{ height: 180, width: 90, marginLeft: 10, marginRight: 10 }} />
      <Checkbox status={selected ? 'checked' : 'unchecked'} />
    </TouchableOpacity>
  );
}

const getImgUrl = async (imgRef) => {
  const storageRef = ref(storage, imgRef);
  const url = await getDownloadURL(storageRef);
  return url;
}

const NewGame = ({ hideModal, navigateToGame }) => {
  const [size, setSize] = useState(3);
  const [isLoading, setIsLoading] = useState(false);
  const { user, setUser } = useContext(Context);

  const createNewGame = async (size, theme, uid) => {
    const userData = await getUser(uid);

    const newGame = {
      timeStamp: Date.now(),
      creater: uid,
      createrName: userData.username,
      size: size,
      bgImgUrl: theme,
      tiles: [],
    }

    const exist = new Set();
    for (let i = 0; i < size; i++) {
      const row = {
        cells: []
      };
      for (let j = 0; j < 3; j++) {
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
      newGame.tiles.push(row);
    }
    const gameId = await addGame(newGame);

    const newUser = await getUser(uid);
    newUser.games.push(gameId);
    await updateUser(uid, newUser);
    setUser(null)
    setUser(user);
    return gameId;
  }

  const themes = [
    'https://firebasestorage.googleapis.com/v0/b/walkingmaster-30a72.appspot.com/o/background%2F141723173959_.pic.jpg?alt=media&token=1db9b6f2-78a2-4e85-9978-f3c229433b63',
    'https://firebasestorage.googleapis.com/v0/b/walkingmaster-30a72.appspot.com/o/background%2F151723173963_.pic.jpg?alt=media&token=4e0ec2b6-d9c6-4b8f-9dad-56418f7248f4',
    'https://firebasestorage.googleapis.com/v0/b/walkingmaster-30a72.appspot.com/o/background%2F161723173969_.pic.jpg?alt=media&token=bc15d3dc-7160-48a9-aead-aeafe03ccbd0',
    'https://firebasestorage.googleapis.com/v0/b/walkingmaster-30a72.appspot.com/o/background%2F171723173969_.pic.jpg?alt=media&token=2e2b775c-460c-4907-8b5d-a311fd0a4023'
  ]
  const [theme, setTheme] = useState(themes[0]);

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text >Rules</Text>
        <Text>During your walk, when you encounter a scene matching the card description, snap a photo and upload it to claim the spot. Complete a line (horizontal, vertical, or diagonal) to win.</Text>
      </View>

      <View style={styles.card}>
        <Text >Board Size</Text>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <TouchableOpacity style={[styles.choice, size === 3 && styles.selected]} onPress={() => setSize(3)}>
            <Text style={styles.choiceText}>3 x 3</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.choice, size === 4 && styles.selected]} onPress={() => setSize(4)}>
            <Text style={styles.choiceText}>4 x 3</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.card}>
        <Text >Theme</Text>
        <ScrollView horizontal={true}>
          {
            themes.map((t, i) => <ThemeCard key={i} theme={t} setTheme={setTheme} selected={theme === t} />)
          }
        </ScrollView>
      </View>

      {
        isLoading ?
          <ActivityIndicator animating={isLoading} style={{ height: 40 }} /> :
          <Button style={{ height: 40 }}
            onPress={async () => {
              setIsLoading(true);
              const gameId = await createNewGame(size, theme, user.uid);
              setIsLoading(false);
              hideModal();
              navigateToGame(gameId);
            }}>Create Game</Button>
      }

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: Dimensions.get('window').width - 40,
    flexDirection: 'column',
    gap: 15,
    paddingTop: 40,
    paddingBottom: 20,
    paddingLeft: 25,
    paddingRight: 25,
    backgroundColor: 'white',
    borderRadius: 20,
  },
  card: {
    width: '100%',
    flexDirection: 'column',
    gap: 5,
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
  },
  title: {
    fontSize: 20,
  },
  choice: {
    width: '45%',
    backgroundColor: '#e0e0e0',
    paddingTop: 3,
    paddingBottom: 3,
    borderRadius: 5,
    alignItems: 'center',
  },
  choiceText: {
    fontSize: 18,
  },
  selected: {
    backgroundColor: '#909090'
  }
});

export default NewGame;
