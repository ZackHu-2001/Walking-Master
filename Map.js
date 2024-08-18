import React, { useState, useContext } from "react";
import { Button, StyleSheet, View, Alert } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { useNavigation } from "@react-navigation/native";
import { db } from "./Firebase/FirebaseSetup";
import { doc, setDoc } from "firebase/firestore";
import Context from "./Context/context"; // Ensure this import is correct

const Map = () => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const navigation = useNavigation();
  const { user } = useContext(Context); // Use context to get the user

  const initialRegion = {
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  const selectLocationHandler = (e) => {
    setSelectedLocation({
      latitude: e.nativeEvent.coordinate.latitude,
      longitude: e.nativeEvent.coordinate.longitude,
    });
  };

  const saveLocationHandler = async () => {
    if (selectedLocation) {
      try {
        // Save the location directly to Firestore
        const userDocRef = doc(db, "users", user.uid);
        await setDoc(userDocRef, { location: selectedLocation }, { merge: true });
        Alert.alert("Success", "Location saved successfully!");
        navigation.navigate('Profile', {
          selectedLocation,
        });
      } catch (error) {
        console.error("Error saving location:", error);
        Alert.alert('Error', 'Unable to save location, please try again later.');
      }
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={initialRegion}
        onPress={selectLocationHandler}
      >
        {selectedLocation && (
          <Marker 
            coordinate={selectedLocation} 
            title="Selected Location" 
          />
        )}
      </MapView>
      <View style={styles.buttonContainer}>
        <Button 
          title="Choose Location"
          onPress={saveLocationHandler}
          disabled={!selectedLocation}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  map: {
    width: "100%",
    height: "100%",
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
});

export default Map;
