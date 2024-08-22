import { useEffect, useContext, useState, useCallback } from 'react';
import { View, Image, Text, ScrollView, RefreshControl, StyleSheet, Dimensions, Alert } from 'react-native';
import GameCard from '../Components/GameCard';
import { getUser, removeGame } from '../Firebase/firestoreHelper';
import FloatingActionButton from '../Components/FloatingActionButton';
import { Modal, ActivityIndicator, Portal } from 'react-native-paper';
import NewGame from '../Components/ModalContent/NewGame';
import AddRoom from '../Components/ModalContent/AddRoom';
import Context from '../Context/context';
import { collection, query, where, onSnapshot, documentId } from 'firebase/firestore';
import { db } from '../Firebase/FirebaseSetup';

export default function GameBoardScreen({ navigation }) {
  const [games, setGames] = useState([]);
  const [visible, setVisible] = useState(false);
  const [modalContent, setModalContent] = useState(1);
  const { user, setUser } = useContext(Context);
  const [isLoading, setIsLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  const editRoom = () => {
    if (games.length === 0) {
      Alert.alert("No journey", "You have no journey to edit");
      return;
    }
    setEditMode(true);
    navigation.setOptions({
      headerRight: () => (
        <Text style={{ marginRight: 40 }} onPress={handleDonePress}>
          Done
        </Text>
      ),
    });
  };

  const handleDonePress = async () => {
    setEditMode(false);
    try {
      const updatedUser = await getUser(user.uid);
      updatedUser.uid = user.uid;
      setUser(updatedUser);
    } catch (error) {
      console.error('Failed to update user:', error);
    } finally {
      navigation.setOptions({
        headerRight: null,
      });
    }
  };


  const addNewGame = () => {
    setModalContent(1);
    showModal();
  }

  const addRoom = () => {
    setModalContent(0);
    showModal();
  }

  const handleSwipeRight = async (gameId) => {
    Alert.alert(
      "Remove route",
      "Are you sure you want to remove this route?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel pressed"),
          style: "cancel"
        },
        {
          text: "Remove",
          onPress: () => removeGameFromUser(gameId)
        }
      ]
    );
  };

  useEffect(() => {
    if (!user) {
      console.log("user === null")
    } else {
      console.log("user", user)
    }
  }, [user]);

  const removeGameFromUser = async (gameId) => {
    try {
      console.log("user", user)
      console.log('user uid', user.uid, 'gameId', gameId);
      await removeGame(user.uid, gameId);
      console.log(`Game ${gameId} removed from user collection`);

      // manually remove the game from the games state
      setGames(prevGames => prevGames.filter(game => game.id !== gameId));
    } catch (error) {
      console.error("Error removing game from user:", error);
    }
  }

  useEffect(() => {
    if (!user) return;
    let unsubscribeFunction = null;
    setIsLoading(true);

    const fetchGames = async () => {
      try {
        const userInfo = await getUser(user.uid);
        if (!userInfo) {
          setIsLoading(false);
          return;
        }

        // Create a query for only the user's games
        const gamesCollection = collection(db, 'games');
        if (userInfo.games.length === 0) {
          setIsLoading(false);
          return;
        }

        const userGamesQuery = query(gamesCollection, where(documentId(), 'in', userInfo.games));

        const unsubscribe = onSnapshot(userGamesQuery, (snapshot) => {
          const games = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          console.log(games)
          const filteredGames = games.filter(game => userInfo.games.includes(game.id));
          setGames(games);
          setIsLoading(false);
        }, (error) => {
          console.error("Error fetching games:", error);
          setIsLoading(false);
        });

        return unsubscribe;
      } catch (error) {
        console.error("Error in fetchGames:", error);
        setIsLoading(false);
      }
    };

    fetchGames().then(unsubscribe => {
      unsubscribeFunction = unsubscribe;
    });

    // Cleanup subscription on unmount
    return () => {
      if (typeof unsubscribeFunction === 'function') {
        unsubscribeFunction();
      }
    };
  }, [user]);

  navigateToGame = (gameId) => {
    navigation.navigate('Game', { gameId });
  }

  function arraysEqual(arr1, arr2) {
    if (arr1.length !== arr2.length) {
      return false;
    }

    for (let i = 0; i < arr1.length; i++) {
      if (arr1[i] !== arr2[i]) {
        return false;
      }
    }

    return true;
  }

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    (async () => {
      const updatedUser = await getUser(user.uid);
      updatedUser.uid = user.uid;

      if (!arraysEqual(updatedUser.games, user.games)) {
        setUser(updatedUser);
      }
      setRefreshing(false);
    })()

  }, [user]);

  return (
    <>
      <FloatingActionButton addNewGame={addNewGame} addRoom={addRoom} editRoom={editRoom} />

      {isLoading ?
        <View style={styles.loading}>
          <ActivityIndicator color='#1C5D3A' animating={isLoading} size='large' />
          <Text style={{ fontSize: 20, marginTop: 10 }}>Loading...</Text>
        </View> :
        games.length === 0 ?
          <View style={styles.loading}>
            <Image style={{ width: 200, height: 150 }} source={require('../assets/emptyHint.png')}/>
            <Text style={{ color: '#1C5D3A', fontSize: 20, marginTop: 20 }}>Your Journey Begins Here!</Text>
          </View> :
          <ScrollView refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
            contentContainerStyle={styles.scrollView} >
            {
              games.map((game, index) => (
                <GameCard
                  key={index}
                  title={`${game['createrName']}'s route`}
                  size={game['size']}
                  onPress={() => navigation.navigate('Game', { gameId: game['id'] })}
                  onSwipeRight={editMode ? () => handleSwipeRight(game['id']) : null}
                  editMode={editMode}
                />
              ))
            }
          </ScrollView>
      }

      <Portal>
        <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={styles.containerStyle} >
          {modalContent ? <NewGame hideModal={hideModal} navigateToGame={navigateToGame} /> : <AddRoom hideModal={hideModal} />}
        </Modal>
      </Portal>
    </>
  )
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    width: Dimensions.get('window').width - 20,
    padding: 10,
  },
  containerStyle: {
    width: Dimensions.get('window').width - 40,
    marginLeft: 20,
    marginRight: 20,

  },
});
