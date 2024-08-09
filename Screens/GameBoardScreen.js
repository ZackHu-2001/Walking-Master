import React, { useEffect, useContext, useState } from 'react';
import { View, Button, Text, ScrollView, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import GameCard from '../Components/GameCard';
import { getGames, getUser, listenForGames } from '../Firebase/firestoreHelper';
import FloatingActionButton from '../Components/FloatingActionButton';
import { Modal } from 'react-native-paper';
import NewGame from '../Components/ModalContent/NewGame';
import AddRoom from '../Components/ModalContent/AddRoom';

export default function GameBoardScreen({ navigation }) {
  const [games, setGames] = useState([]);
  const [visible, setVisible] = React.useState(false);
  const [modalContent, setModalContent] = React.useState(1);

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
    const unsubscribe = listenForGames((games) => {
      setGames(games);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  return (
    <>
      <ScrollView contentContainerStyle={styles.scrollView} >
        {
          games.map((game, index) => (
            <GameCard
              key={index}
              title={game['name']}
              onPress={() => navigation.navigate('Game', { gameId: game['id'] })}
            />
          ))
        }
      </ScrollView>
      <FloatingActionButton addNewGame={addNewGame} addRoom={addRoom} editRoom={editRoom}/>

      <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={styles.containerStyle} >
        {modalContent ? <NewGame /> : <AddRoom />}
      </Modal>
    </>
  )

}

const styles = StyleSheet.create({
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
