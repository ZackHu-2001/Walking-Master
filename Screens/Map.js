import React, { useState, useEffect, useContext } from "react";
import { Button, StyleSheet, View, Alert } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { useNavigation } from "@react-navigation/native";
import { db } from "../Firebase/FirebaseSetup";
import { collection, getDocs, addDoc, query, where } from "firebase/firestore"; // Import necessary Firestore functions
import Context from "../Context/context";

const Map = () => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [storedLocations, setStoredLocations] = useState([]);
  const navigation = useNavigation();
  const { user } = useContext(Context); // Use context to get the user

  useEffect(() => {
    const fetchStoredLocations = async () => {
      if (!user) return;

      try {
        const userLocationsRef = collection(db, "users", user.uid, "locations");
        const querySnapshot = await getDocs(userLocationsRef);

        const locations = querySnapshot.docs.map((doc) => doc.data());
        setStoredLocations(locations);
      } catch (err) {
        console.error("Error fetching locations:", err);
        Alert.alert("Error", "Failed to fetch locations.");
      }
    };

    fetchStoredLocations();
  }, [user]);

  const selectLocationHandler = (e) => {
    setSelectedLocation({
      latitude: e.nativeEvent.coordinate.latitude,
      longitude: e.nativeEvent.coordinate.longitude,
    });
  };

  const saveLocationHandler = async () => {
    if (!selectedLocation || !user) return;

    try {
      // Check if the location already exists in Firestore
      const userLocationsRef = collection(db, "users", user.uid, "locations");
      const q = query(
        userLocationsRef,
        where("latitude", "==", selectedLocation.latitude),
        where("longitude", "==", selectedLocation.longitude)
      );

      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        Alert.alert("Info", "This location is already saved.");
      } else {
        // Save the new location if it doesn't exist
        await addDoc(userLocationsRef, selectedLocation);
        Alert.alert("Success", "Location saved successfully!");
        navigation.navigate("Profile", {
          selectedLocation,
        });
      }
    } catch (error) {
      console.error("Error saving location:", error);
      Alert.alert("Error", "Unable to save location, please try again later.");
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        onPress={selectLocationHandler}
      >
        {selectedLocation && (
          <Marker coordinate={selectedLocation} title="Selected Location" />
        )}

        {storedLocations.map((loc, index) => (
          <Marker
            key={index}
            coordinate={{ latitude: loc.latitude, longitude: loc.longitude }}
            title={`Location ${index + 1}`}
          />
        ))}
      </MapView>
      <View style={styles.buttonContainer}>
        <Button
          title="Choose Location"
          onPress={() => navigation.navigate("Profile", { selectedLocation })}
          disabled={!selectedLocation}
        />
        <Button
          title="Save Location"
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
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
  },
});

export default Map;
