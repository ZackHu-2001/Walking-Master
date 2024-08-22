import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const GameCard = ({ title, onPress, size, onSwipeRight, editMode }) => {
  return (
    <View style={styles.card}>
      <TouchableOpacity onPress={onPress} style={styles.cardContent}>
        <Text style={styles.title}>{title}</Text>
        {
          editMode ? <TouchableOpacity style={styles.deleteButton} onPress={onSwipeRight}>
            <Icon name="trash" size={30} color="#E57373"  />
          </TouchableOpacity> : <Text style={styles.description}>
            {size === 3 ? '3 X 3' : '4 X 3'}
          </Text>
        }
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    height: 50,
    width: '100%',
    margin: 10,
    overflow: 'hidden',
  },
  cardContent: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    flex: 1,
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginRight: 10,
    textAlign: 'right',
  },
  deleteButton: {
    position: 'absolute',
    right: 10,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
  },
});

export default GameCard;
