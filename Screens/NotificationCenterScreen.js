import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Alert, Platform, TouchableOpacity, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient'; 
import DropDownPicker from 'react-native-dropdown-picker';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../Firebase/FirebaseSetup';
import * as Notifications from 'expo-notifications';
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import DateTimePicker from '@react-native-community/datetimepicker';
import Context from '../Context/context';
import styles from '../Styles/NotificationStyle';

const NotificationCenterScreen = () => {
  const { user } = useContext(Context);
  const [games, setGames] = useState([]);
  const [futureNotifications, setFutureNotifications] = useState([]);
  const [selectedGame, setSelectedGame] = useState(null);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [open, setOpen] = useState(false);
  const [timeSelected, setTimeSelected] = useState(false);
  const fadeAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    // Fade in animation when loading
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const fetchUserGames = async () => {
    if (user && user.uid) {
      try {
        const gamesQuery = query(
          collection(db, "games"),
          where("creater", "==", user.uid)
        );
        const gamesSnapshot = await getDocs(gamesQuery);

        if (gamesSnapshot.empty) {
          Alert.alert("No Games", "No games were found for this user.");
        } else {
          const gamesData = [];
          const notifications = [];

          gamesSnapshot.forEach((doc) => {
            const gameData = doc.data();
            const notificationTime = gameData.notification ? new Date(gameData.notification.time.seconds * 1000) : null;

            gamesData.push({
              label: gameData.createrName || "Unnamed Game",
              value: doc.id,
              notification: gameData.notification ? {
                ...gameData.notification,
                time: notificationTime,
              } : null,
            });

            if (notificationTime && notificationTime > new Date()) {
              notifications.push({
                message: gameData.notification.message,
                time: notificationTime,
                gameName: gameData.createrName || "Unnamed Game",
              });
            }
          });

          console.log("Games Data (after processing):", gamesData);
          setGames(gamesData); // Set the state to display the games
          setFutureNotifications(notifications); // Set state to display future notifications
        }
      } catch (error) {
        console.error("Error fetching games:", error);
        Alert.alert("Error", "Unable to fetch games.");
      }
    } else {
      console.log("No user found in context.");
    }
  };

  useEffect(() => {
    fetchUserGames();
  }, [user]);

  const onChangeDateTime = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setDate(currentDate);
    if (Platform.OS === 'ios') {
      setShowDatePicker(false);
    }
    setTimeSelected(true);
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

  const formatDateTime = (date) => {
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
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

    // Update the game document with notification details
    const notification = {
      time: date,
      message: `Reminder for ${games.find(g => g.value === selectedGame)?.label}`,
    };
    const gameDocRef = doc(db, "games", selectedGame);
    await updateDoc(gameDocRef, { notification });

    Alert.alert("Success", "Notification scheduled successfully!");

    // Re-fetch the games to refresh the notifications list
    fetchUserGames();
  };

  return (
    <LinearGradient
      colors={['#7DB9DE', '#77428D']} 
      style={styles.container}
    >
      <Animated.View style={[styles.innerContainer, { opacity: fadeAnim }]}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Select Game to Set Notification:</Text>
        </View>

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
          textStyle={styles.textStyle}
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

        {timeSelected && (
          <Text style={styles.selectedText}>
            Selected Date & Time: {"\n"}
            {formatDateTime(date)}
          </Text>
        )}

        {futureNotifications.length > 0 ? (
          futureNotifications.map((notification, index) => (
            <View key={index} style={styles.notificationContainer}>
              <Text style={styles.selectedText}>
                {`Game: ${notification.gameName}\nReminder: ${notification.message}\nTime: ${formatDateTime(notification.time)}`}
              </Text>
            </View>
          ))
        ) : (
          <Text style={styles.noNotificationText}>No upcoming notifications.</Text>
        )}

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.confirmButton} onPress={scheduleNotification}>
            <Text style={styles.confirmButtonText}>SCHEDULE NOTIFICATION</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </LinearGradient>
  );
};

export default NotificationCenterScreen;
