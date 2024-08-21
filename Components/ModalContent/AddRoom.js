import { Alert, TextInput, View, Text, StyleSheet } from "react-native";
import React from "react";
import { Button, ActivityIndicator } from "react-native-paper";
import { Dimensions } from "react-native";
import { useContext } from "react";
import Context from "../../Context/context";
import { checkGameExists, updateUser } from "../../Firebase/firestoreHelper";

const AddRoom = ({ hideModal }) => {
  const [roomCode, setRoomCode] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const { user, setUser } = useContext(Context);

  const handleAddRoom = async () => {
    if (!roomCode) {
      Alert.alert("Error", "Room code is required");
      return;
    }

    setIsLoading(true);
    // check if the room exists
    if (!checkGameExists(roomCode)) {
      Alert.alert("Error", "Room does not exist");
      setRoomCode('');
      setIsLoading(false);
      return;
    }

    if (user.games.includes(roomCode)) {
      Alert.alert("Error", "Room already added");
      setRoomCode('');
      setIsLoading(false);
      return;
    }

    // add the room to the user's room list
    const updatedUser = {
      ...user,
      games: [...user.games, roomCode]
    }

    await updateUser(user.uid, updatedUser);

    Alert.alert("Success", "Room added successfully");

    setUser(updatedUser);

    setRoomCode('');

    setIsLoading(false);

    hideModal();
  }

  return (
    <View style={styles.container}>
      <Text style={{fontWeight: 'bold', fontSize: 16}}>Add Room</Text>
      <TextInput value={roomCode} onChangeText={(code) => {
        setRoomCode(code)
        }} placeholder="Paste room code here"></TextInput>
      {
        isLoading ? <ActivityIndicator style={{ marginTop: 10, height: 40 }} /> : <Button style={{ marginTop: 10, height: 40 }} mode="contained" onPress={handleAddRoom}>Add</Button>
      }


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
