import React, { useEffect, useState, useContext } from "react";
import { Button, StyleSheet, View, Alert, Text, Image } from "react-native";
import * as Location from "expo-location";
import { useNavigation, useRoute } from "@react-navigation/native";
import { db } from '../Firebase/FirebaseSetup';
import { doc, collection, addDoc } from "firebase/firestore";
import { MAPS_API_KEY } from "@env";
import Context from "../Context/context";

const LocationManager = () => {
  const { user } = useContext(Context); // Get user from Context
  const [location, setLocation] = useState(null);
  const [permissionResponse, requestPermission] = Location.useForegroundPermissions();
  const navigation = useNavigation();
  const route = useRoute();

  useEffect(() => {
    const fetchLocation = async () => {
      if (route.params?.selectedLocation) {
        setLocation(route.params.selectedLocation);
      }
    };
    fetchLocation();
  }, [route.params?.selectedLocation]);

  const verifyPermission = async () => {
    if (permissionResponse?.granted) {
      return true;
    }
    const permissionResult = await requestPermission();
    return permissionResult.granted;
  };

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
        longitude: result.coords.longitude,
      };
      setLocation(userLocation);
    } catch (err) {
      console.error("Error getting location:", err);
    }
  };

  const generateMapUrl = () => {
    if (!location) return null;
    return `https://maps.googleapis.com/maps/api/staticmap?center=${location.latitude},${location.longitude}&zoom=14&size=400x200&maptype=roadmap&markers=color:red%7Clabel:L%7C${location.latitude},${location.longitude}&key=${MAPS_API_KEY}`;
  };

  const saveLocationHandler = async () => {
    if (!location || !user) return;

    try {
      // Save the location to a subcollection in Firestore
      const userLocationsRef = collection(db, "users", user.uid, "locations");
      await addDoc(userLocationsRef, location);

      Alert.alert("Success", "Location saved successfully!");
      navigation.goBack();
    } catch (err) {
      console.error("Error saving location:", err);
      Alert.alert("Error", "Unable to save location, please try again later.");
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
          <Image style={styles.mapImage} source={{ uri: generateMapUrl() }} />
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
