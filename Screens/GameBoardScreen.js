import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function GameBoardScreen() {
  return (
    <View style={styles.container}>
      <Text>Game Board Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
