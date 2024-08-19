import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Button, Alert, StyleSheet, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { getDoc, doc } from 'firebase/firestore'; // Import Firestore methods
import { getGames } from '../Firebase/firestoreHelper';
import { db } from '../Firebase/FirebaseSetup'; // Ensure you're importing your Firestore setup
import * as Notifications from 'expo-notifications';
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import DateTimePicker from '@react-native-community/datetimepicker';
import Context from '../Context/context';

const NotificationCenterScreen = () => {
  const { user } = useContext(Context);
  const [games, setGames] = useState([]);
  const [selectedGame, setSelectedGame] = useState(null);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    const fetchUserGames = async () => {
      if (user && user.uid) {
        console.log("User UID:", user.uid);
        try {
          // Fetch user document from Firestore
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            console.log("User data fetched:", userData);
            if (userData.games && userData.games.length > 0) {
              const gamesData = await getGames(userData.games);
              if (gamesData.length > 0) {
                setGames(gamesData);
              } else {
                console.log("No games found for this user.");
              }
            } else {
              console.log("User has no games in their profile.");
            }
          } else {
            console.log("No user document found for this UID.");
          }
        } catch (error) {
          console.error("Error fetching games:", error);
          Alert.alert("Error", "Unable to fetch games.");
        }
      } else {
        console.log("No user found in context.");
      }
    };

    fetchUserGames();
  }, [user]);

  const onChangeDateTime = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setDate(currentDate);
    if (Platform.OS === 'ios') {
      setShowDatePicker(false);
    }
  };

  const showDatePickerAndroid = () => {
    DateTimePickerAndroid.open({
      value: date,
      onChange: onChangeDateTime,
      mode: 'date',
      is24Hour: true,
    });
  };

  const showTimePickerAndroid = () => {
    DateTimePickerAndroid.open({
      value: date,
      onChange: onChangeDateTime,
      mode: 'time',
      is24Hour: true,
    });
  };

  const showDateTimePickerIOS = () => {
    setShowDatePicker(true);
  };

  const scheduleNotification = async () => {
    if (!selectedGame) {
      Alert.alert("Error", "Please select a game to set up a notification.");
      return;
    }

    const currentTime = new Date();
    const timeDifference = date.getTime() - currentTime.getTime();

    if (timeDifference <= 0) {
      Alert.alert("Error", "Please select a future time.");
      return;
    }

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Game Reminder",
        body: `Don't forget about your game: ${selectedGame.name}`,
      },
      trigger: {
        seconds: Math.floor(timeDifference / 1000),
      },
    });

    Alert.alert("Success", "Notification scheduled successfully!");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Game to Set Notification:</Text>
      
      <View style={[styles.pickerContainer, Platform.OS === 'ios' && styles.pickerContainerIOS]}>
        <Picker
          selectedValue={selectedGame}
          onValueChange={(itemValue) => setSelectedGame(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Select a game" value={null} />
          {games.map((game, index) => (
            <Picker.Item key={game.id || index} label={game.name} value={game} />
          ))}
        </Picker>
      </View>

      <View style={styles.dateTimeContainer}>
        {Platform.OS === 'android' ? (
          <>
            <Button title="Pick Date" onPress={showDatePickerAndroid} />
            <Button title="Pick Time" onPress={showTimePickerAndroid} />
          </>
        ) : (
          <Button title="Pick Date & Time" onPress={showDateTimePickerIOS} />
        )}
        {showDatePicker && Platform.OS === 'ios' && (
          <DateTimePicker
            value={date}
            mode="datetime"
            display="default"
            onChange={onChangeDateTime}
            style={styles.dateTimePicker}
          />
        )}
      </View>

      <View style={styles.buttonContainer}>
        <Button title="SCHEDULE NOTIFICATION" onPress={scheduleNotification} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  pickerContainer: {
    marginBottom: 20,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  pickerContainerIOS: {
    paddingLeft: 10,
  },
  picker: {
    height: 50,
    width: '100%',
  },
  dateTimeContainer: {
    marginBottom: 30,
    alignItems: 'center',
  },
  buttonContainer: {
    alignItems: 'center',
  },
  dateTimePicker: {
    width: '100%',
  },
});

export default NotificationCenterScreen;
