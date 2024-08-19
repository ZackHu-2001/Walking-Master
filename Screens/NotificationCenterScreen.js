import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Alert, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { getDoc, doc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../Firebase/FirebaseSetup';
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
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchUserGames = async () => {
      if (user && user.uid) {
        try {
          const gamesQuery = query(
            collection(db, "games"),
            where("creater", "==", user.uid)
          );
          const gamesSnapshot = await getDocs(gamesQuery);

          if (gamesSnapshot.empty) {
            console.log("No games found for this user.");
          } else {
            const gamesData = [];
            gamesSnapshot.forEach((doc) => {
              const gameData = doc.data();
              gamesData.push({
                label: gameData.createrName || "Unnamed Game",
                value: doc.id,
              });
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
        dropDownContainerStyle={styles.dropdownContainerStyle}
        placeholderStyle={styles.placeholderStyle}
        labelStyle={styles.labelStyle}
        selectedItemLabelStyle={styles.selectedItemLabelStyle}
      />

      <View style={styles.dateTimeContainer}>
        {Platform.OS === 'android' ? (
          <>
            <TouchableOpacity style={styles.button} onPress={showDatePickerAndroid}>
              <Text style={styles.buttonText}>Pick Date</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={showTimePickerAndroid}>
              <Text style={styles.buttonText}>Pick Time</Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity style={styles.button} onPress={showDateTimePickerIOS}>
            <Text style={styles.buttonText}>Pick Date & Time</Text>
          </TouchableOpacity>
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
        <TouchableOpacity style={styles.confirmButton} onPress={scheduleNotification}>
          <Text style={styles.confirmButtonText}>SCHEDULE NOTIFICATION</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#6A4C9C',
  },
  dropdownContainer: {
    marginBottom: 20,
  },
  dropdown: {
    backgroundColor: '#ffffff',
    borderColor: '#cccccc',
  },
  dropdownContainerStyle: {
    backgroundColor: '#f0f0f0',  // 下拉列表背景色
  },
  placeholderStyle: {
    color: '#999999', 
    fontSize: 16,
  },
  labelStyle: {
    color: '#333333', 
    fontSize: 16,
    fontSize: 16,
    fontFamily: 'Helvetica', 
  },
  selectedItemLabelStyle: {
    color: '#6A4C9C',
    fontWeight: 'bold',
    fontFamily: 'Courier New',
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
  button: {
    backgroundColor: '#6A4C9C', 
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25, 
    marginBottom: 10,
    width: '80%',
  },
  buttonText: {
    color: '#ffffff',  
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  confirmButton: {
    backgroundColor: '#993399',  
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25, 
    width: '80%',
  },
  confirmButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default NotificationCenterScreen;
