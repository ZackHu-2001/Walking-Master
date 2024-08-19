import React, { useEffect, useContext, useState } from 'react';
import { View, Button, Text, ScrollView, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import GameCard from '../Components/GameCard';
import { getGames, getUser, listenForGames } from '../Firebase/firestoreHelper';
import FloatingActionButton from '../Components/FloatingActionButton';
import { Modal, ActivityIndicator, Portal } from 'react-native-paper';
import NewGame from '../Components/ModalContent/NewGame';
import AddRoom from '../Components/ModalContent/AddRoom';
import Context from '../Context/context';
import LocationManager from '../Components/LocationManager';
import { collection, query, where, onSnapshot, documentId } from 'firebase/firestore';
import { db } from '../Firebase/FirebaseSetup';

export default function GameBoardScreen({ navigation }) {
  const [games, setGames] = useState([]);
  const [visible, setVisible] = React.useState(false);
  const [modalContent, setModalContent] = React.useState(1);
  const { user } = useContext(Context);
  const [isLoading, setIsLoading] = useState(false);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  const editRoom = () => {

  }

  const addNewGame = () => {
    setModalContent(1);
    showModal();
  }

  const addRoom = () => {
    setModalContent(0);
    showModal();
  }
  useEffect(() => {
    if (!user) return;
    let unsubscribeFunction = null;
    setIsLoading(true);

    const fetchGames = async () => {
      try {
        const userInfo = await getUser(user.uid);
        if (!userInfo) return;

        // Create a query for only the user's games
        const gamesCollection = collection(db, 'games');
        if (userInfo.games.length === 0) {
          console.log("No games found for user");
          setIsLoading(false);
          return;
        }

        const userGamesQuery = query(gamesCollection, where(documentId(), 'in', userInfo.games));

        const unsubscribe = onSnapshot(userGamesQuery, (snapshot) => {
          const games = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          console.log(games)
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

  // useEffect(() => {
  //   if (!user) return;
  //   let unsubscribeFunction = null;

  //   setIsLoading(true);
  //   const fetchGames = async () => {
  //     try {
  //       const userInfo = await getUser(user.uid);
  //       const unsubscribe = listenForGames(userInfo.games, (games) => {
  //         setGames(games);
  //       });
  //       return unsubscribe;
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   }

  //   const unsubscribe = fetchGames().then((unsubscribe) => {
  //     unsubscribeFunction = unsubscribe;
  //     setIsLoading(false);
  //   });

  //   // Cleanup subscription on unmount
  //   return () => {
  //     if (typeof unsubscribeFunction === 'function') {
  //       unsubscribeFunction();
  //     }
  //   };
  // }, [user]);

  navigateToGame = (gameId) => {
    navigation.navigate('Game', { gameId });
  }

  return (
    <>
      <FloatingActionButton addNewGame={addNewGame} addRoom={addRoom} editRoom={editRoom} />

      {isLoading ?
        <View style={styles.loading}>
          <ActivityIndicator animating={isLoading} size='large' />
          <Text style={{ fontSize: 20, marginTop: 10 }}>Loading...</Text>
        </View> :
        games.length === 0 ?
          <View style={styles.loading}>
            <Text style={{ fontSize: 20 }}>No games found</Text>
          </View> :
          <ScrollView contentContainerStyle={styles.scrollView} >
            {
              games.map((game, index) => (
                <GameCard
                  key={index}
                  title={`${game['createrName']}'s route`}
                  size={game['size']}
                  onPress={() => navigation.navigate('Game', { gameId: game['id'] })}
                />
              ))
            }
          </ScrollView>
      }

      <LocationManager />
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
