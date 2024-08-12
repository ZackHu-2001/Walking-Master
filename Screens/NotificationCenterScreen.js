import React, { useState, useEffect } from 'react';
import { View, Text, Button, Alert, StyleSheet, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { getGames } from '../Firebase/firestoreHelper';
import * as Notifications from 'expo-notifications';
import DateTimePicker from '@react-native-community/datetimepicker';

const NotificationCenterScreen = () => {
  const [games, setGames] = useState([]);
  const [selectedGame, setSelectedGame] = useState(null);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const gamesData = await getGames();
        setGames(gamesData);
      } catch (error) {
        console.error("Error fetching games:", error);
        Alert.alert("Error", "Unable to fetch games");
      }
    };

    fetchGames();
  }, []);

  useEffect(() => {
    const getPermission = async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'You need to allow notifications to set reminders.');
      }
    };

    getPermission();
  }, []);

  const onChangeDateTime = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === 'ios');
    setDate(currentDate);
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
        <Picker.Item key={`${game.id}-${index}`} label={game.name} value={game} />
      ))}
    </Picker>
      </View>

      <View style={styles.dateTimeContainer}>
        <Button title="Pick Date & Time" onPress={() => setShowDatePicker(true)} />
        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="datetime"
            display="default"
            onChange={onChangeDateTime}
            style={[styles.dateTimePicker, Platform.OS === 'ios' && styles.dateTimePickerIOS]}
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
  dateTimePicker: {
    width: '100%',
  },
  dateTimePickerIOS: {
    marginTop: 10,
  },
  buttonContainer: {
    alignItems: 'center',
  },
});

export default NotificationCenterScreen;
