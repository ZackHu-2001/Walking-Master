import React, { useEffect, useContext, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions } from 'react-native';
import GameCard from '../Components/GameCard';
import { getGames, getUser, listenForGames } from '../Firebase/firestoreHelper';
import Context from '../Context/context';
// import naviga
export default function GameBoardScreen({ navigation }) {
  const [games, setGames] = useState([]);

  useEffect(() => {
    const unsubscribe = listenForGames((games) => {
      setGames(games);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  return (
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
  )

}

const styles = StyleSheet.create({
  scrollView: {
    width: Dimensions.get('window').width - 20,
    padding: 10,
  }
});
