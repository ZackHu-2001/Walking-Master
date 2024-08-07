import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, Image, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { doc, getDoc } from 'firebase/firestore';

const ProfileScreen = () => {
  const navigation = useNavigation();
  
  return (
    <View style={styles.container}>
      <Text title="Profile Screen"/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  userName: {
    fontSize: 20,
    marginBottom: 20,
  },
});

export default ProfileScreen;
