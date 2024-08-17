import React, { useEffect, useState } from "react";
import { Button, StyleSheet, View, Alert, Text, Image } from "react-native";
import * as Location from "expo-location";
import { useNavigation, useRoute } from "@react-navigation/native";
import { auth, db } from './Firebase/FirebaseSetup';
import { doc, getDoc, setDoc } from "firebase/firestore";
import { MAPS_API_KEY } from "@env"; 
import Map from "./Map";

const LocationManager = () => {
  const [location, setLocation] = useState(null);
  const [permissionResponse, requestPermission] = Location.useForegroundPermissions();
  const navigation = useNavigation();
  const route = useRoute();

  // Fetch location from route params or Firestore
  useEffect(() => {
    const fetchLocation = async () => {
      if (route.params?.selectedLocation) {
        setLocation(route.params.selectedLocation);
        console.log("Location set from route:", route.params.selectedLocation);
      } else {
        const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          if (userData.location) {
            setLocation(userData.location);
          }
        }
      }
    };
    fetchLocation();
  }, [route.params?.selectedLocation]); 

  // Verify location permission
  const verifyPermission = async () => {
    if (permissionResponse?.granted) {
      return true;
    }
    const permissionResult = await requestPermission();
    return permissionResult.granted;
  };

  // Handle user location fetching
  const locateUserHandler = async () => {
    const hasPermission = await verifyPermission();
    if (!hasPermission) {
      Alert.alert("Permission required", "You need to give permission to access location");
      return;
    }

    try {
      const result = await Location.getCurrentPositionAsync({});
      const userLocation = {
        latitude: result.coords.latitude,
        longitude: result.coords.longitude
      };
      setLocation(userLocation);
      console.log("Location set:", userLocation);
    } catch (err) {
      console.error("Error getting location:", err);
    }
  };

  // Generate Google Static Map URL
  const generateMapUrl = () => {
    if (!location) return null;
    return `https://maps.googleapis.com/maps/api/staticmap?center=${location.latitude},${location.longitude}&zoom=14&size=400x200&maptype=roadmap&markers=color:red%7Clabel:L%7C${location.latitude},${location.longitude}&key=${MAPS_API_KEY}`;
  };

// Save location to Firestore in the existing user document
const saveLocationHandler = async () => {
  try {
    // Get the reference to the current user's document
    const userDocRef = doc(db, "users", auth.currentUser.uid);
    // Update the location field in the user's document, merging it with existing data
    await setDoc(userDocRef, { location }, { merge: true });
    // Navigate back to the Home screen or any other screen as needed
    navigation.navigate("Profile");
  } catch (err) {
    console.error("Error saving location:", err);
  }
};

  return (
    <View style={styles.container}>
      <Button title="Locate Me" onPress={locateUserHandler} />
      {location && (
        <>
          <Text style={styles.locationText}>
            Latitude: {location.latitude}, Longitude: {location.longitude}
          </Text>
          <Image
            style={styles.mapImage}
            source={{ uri: generateMapUrl() }}
          />
          <Button title="Let me select my location" onPress={() => navigation.navigate("Map")} />
          <Button title="Save Location" onPress={saveLocationHandler} />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  locationText: {
    marginTop: 20,
    fontSize: 16,
  },
  mapImage: {
    marginTop: 20,
    width: 400,
    height: 200,
  },
});

export default LocationManager;
