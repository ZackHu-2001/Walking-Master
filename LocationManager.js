import React, { useEffect, useState } from "react";
import { Button, StyleSheet, View, Alert, Text, Image } from "react-native";
import * as Location from "expo-location";
import { useNavigation, useRoute } from "@react-navigation/native";
import { auth, db } from './Firebase/FirebaseSetup';
import { doc, getDoc, setDoc } from "firebase/firestore";
import { MAPS_API_KEY } from "@env"; 

const LocationManager = () => {
  const [location, setLocation] = useState(null);
  const [permissionResponse, requestPermission] = Location.useForegroundPermissions();
  const navigation = useNavigation();
  const route = useRoute();

  // Fetch location from route params or Firestore
  useEffect(() => {
    const fetchLocation = async () => {
      if (route.params) {
        setLocation(route.params);
        console.log("Location set from route:", route.params);
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
  }, [route.params]);

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

  // Save location to Firestore
  const saveLocationHandler = async () => {
    try {
      await setDoc(doc(db, "users", auth.currentUser.uid), { location }, { merge: true });
      navigation.navigate("Home");
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
