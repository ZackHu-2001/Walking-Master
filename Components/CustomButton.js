import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';

const CustomButton = ({ title, onPress }) => {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.button, pressed && styles.pressed]}>
      <Text style={styles.text}>{title}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginVertical: 10,
    backgroundColor: '#ff6347',
    borderRadius: 5,
  },
  pressed: {
    backgroundColor: '#0056b3',
  },
  text: {
    fontSize: 18,
    color: '#FFF',
  },
});

export default CustomButton;
