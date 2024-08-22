import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Button } from 'react-native-paper';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import Context from '../Context/context';

const GOOGLE_PLACES_API_KEY = 'AIzaSyDylz4EXfCqB4riHXFWHsA2oiOnabLRx4M';
const GOOGLE_PLACES_ENDPOINT = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json';

const getNearbyLocations = async (location) => {
  const { latitude, longitude } = location;
  const types = ['restaurant', 'cafe', 'store', 'park'];
  let allResults = [];
  let idCounter = 0;

  for (const type of types) {
    const response = await fetch(
      `${GOOGLE_PLACES_ENDPOINT}?location=${latitude},${longitude}&rankby=distance&type=${type}&key=${GOOGLE_PLACES_API_KEY}`
    );

    const data = await response.json();

    if (data.results && data.results.length > 0) {
      const results = data.results.map(place => ({
        id: `${type}_${idCounter++}`, // Create a unique ID
        name: place.name,
        type: type,
        distance: '<500',
        address: place.vicinity,
        latitude: place.geometry.location.lat,
        longitude: place.geometry.location.lng,
      }));
      allResults = allResults.concat(results);
    }
  }

  // Shuffle the results to mix different types
  allResults.sort(() => Math.random() - 0.5);

  return allResults.slice(0, 20); // Limit to 20 results total
};

// Function to search locations using Google Places API
const searchLocations = async (query, location) => {
  const { latitude, longitude } = location;
  const response = await fetch(
    `${GOOGLE_PLACES_ENDPOINT}?location=${latitude},${longitude}&radius=500&keyword=${query}&key=${GOOGLE_PLACES_API_KEY}`
  );

  const data = await response.json();
  return data.results.map(place => ({
    id: place.place_id,
    name: place.name,
    distance: '<500',
    address: place.vicinity,
    latitude: place.geometry.location.lat,
    longitude: place.geometry.location.lng,
  }));
};

const LocationSearchScreen = ({ navigation, route }) => {
  const { setPickedLocation } = useContext(Context);
  const [selected, setSelected] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [hint, setHint] = useState('');

  useEffect(() => {
    const fetchLocationData = async () => {
      try {
        setLoading(true);
        setHint('Getting current location...');
        const currentLocation = await fetchCurrentLocation();
        setLocation(currentLocation);
        setHint('Getting nearby locations...');
        const nearbyLocations = await getNearbyLocations(currentLocation);
        setLocations(nearbyLocations);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setHint('');
        setLoading(false);
      }
    };

    fetchLocationData();

    navigation.setOptions({
      headerRight: () => <Button textColor='#09BB07' onPress={() => {
        navigation.goBack();
      }}>Done</Button>,
      headerLeft: () => <Button textColor='#0f0f0f' onPress={() => {
        navigation.goBack();
      }}>Cancel</Button>,
    });
  }, []);

  const fetchCurrentLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return null;
      }
      const location = await Location.getCurrentPositionAsync({});
      return location.coords;
    } catch (error) {
      console.error('Error fetching current location:', error);
      return null;
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.locationItem} onPress={() => {
      setSelected(item.id);
      setPickedLocation({
        name: item.name,
        address: item.address,
        position: {
          latitude: item.latitude,
          longitude: item.longitude
        }
      })
    }}>
      <View style={{ width: '90%' }}>
        <Text style={styles.locationName}>{item.name}</Text>
        {item.distance && (
          <Text style={styles.locationDetails}>
            {item.distance} | {item.address}
          </Text>
        )}
      </View>

      {
        selected === item.id && <Ionicons name="checkmark" size={24} color='#4CAF50' />
      }

    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator color='#1C5D3A' size="large" />
          <Text> {hint} </Text>
        </View>
      ) : (
        <>
          <FlatList
            data={locations}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 4,
    margin: 8,
    padding: 8,
  },
  searchInput: {
    flex: 1,
    color: '#000',
    marginLeft: 8,
  },
  locationItem: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  locationName: {
    color: '#000',
    fontSize: 16,
  },
  locationDetails: {
    color: '#666',
    fontSize: 14,
    marginTop: 4,
  },
});

export default LocationSearchScreen;
