import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Button, Alert, StyleSheet, Platform } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker'; // Import DropDownPicker
import { getDoc, doc, collection, query, where, getDocs } from 'firebase/firestore'; // Import necessary Firestore methods
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
  const [open, setOpen] = useState(false); // State for DropdownPicker

  useEffect(() => {
    const fetchUserGames = async () => {
      if (user && user.uid) {
        console.log("User UID:", user.uid);
        try {
          const gamesQuery = query(
            collection(db, "games"),
            where("creater", "==", user.uid) // Ensure field name matches Firestore
          );
          const gamesSnapshot = await getDocs(gamesQuery);
  
          if (gamesSnapshot.empty) {
            console.log("No games found for this user.");
          } else {
            const gamesData = [];
            gamesSnapshot.forEach((doc) => {
              const gameData = doc.data();
              console.log("Game Data Fetched:", gameData); // Log the fetched data
              gamesData.push({ 
                label: gameData.createrName || "Unnamed Game", // Use createrName or a default
                value: doc.id 
              }); // Use doc.id as the value for uniqueness
            });
  
            setGames(gamesData);
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
        body: `Don't forget about your game: ${games.find(g => g.value === selectedGame)?.label}`,
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

      <DropDownPicker
        open={open}
        value={selectedGame}
        items={games}
        setOpen={setOpen}
        setValue={setSelectedGame}
        setItems={setGames}
        placeholder="Select a game"
        containerStyle={styles.dropdownContainer}
        style={styles.dropdown}
        dropDownStyle={styles.dropdownItem}
      />

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
  dropdownContainer: {
    marginBottom: 20,
  },
  dropdown: {
    backgroundColor: '#fafafa',
  },
  dropdownItem: {
    backgroundColor: '#fafafa',
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
