import { TextInput, View, Text, StyleSheet } from "react-native";
import React from "react";
import { Button } from "react-native-paper";
import { Dimensions } from "react-native";

const AddRoom = () => {
  const [roomCode, setRoomCode] = React.useState('');

  const handleAddRoom = () => {
    if (!roomCode) {
      Alert.alert("Error", "Room code is required");
      return;
    }

    // Add room code to user's room list
  }


  return (
    <View style={styles.container}>
      <Text>Add Room</Text>
      <TextInput placeholder="Paste room code here"></TextInput>
      <Button style={{ marginTop: 20 }} mode="contained" onPress={handleAddRoom}>Add</Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: Dimensions.get('window').width - 40,
    flexDirection: 'column',
    gap: 15,
    paddingTop: 30,
    paddingBottom: 30,
    paddingLeft: 25,
    paddingRight: 25,
    backgroundColor: 'white',
    borderRadius: 20,
  },
});

export default AddRoom;
