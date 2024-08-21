import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Alert, StyleSheet, Platform, TouchableOpacity, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient'; 
import DropDownPicker from 'react-native-dropdown-picker';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../Firebase/FirebaseSetup';
import * as Notifications from 'expo-notifications';
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import DateTimePicker from '@react-native-community/datetimepicker';
import Context from '../Context/context';
import styles from '../Styles/NotificationStyle';

const NotificationCenterScreen = () => {
  const { user } = useContext(Context);
  const [games, setGames] = useState([]);
  const [selectedGame, setSelectedGame] = useState(null);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [open, setOpen] = useState(false);
  const fadeAnim = useState(new Animated.Value(0))[0]; // 0 is the initial value

  useEffect(() => {
    // fade in animation when loading
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000, // last for 1 second
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

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

  const formatDateTime = (date) => {
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
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

        <Text style={styles.selectedDateTimeText}>
          Selected Date & Time: {"\n"}
          {formatDateTime(date)}
        </Text>

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
