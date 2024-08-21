import { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import MapView, { Marker } from 'react-native-maps';

const InteractiveMap = ({ navigation, route }) => {
  const { location } = route.params;
  const [parkLocations, setParkLocations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchNearbyParks = async (position) => {
    const { latitude, longitude } = position;

    // const GOOGLE_PLACES_API_KEY = 'AIzaSyDylz4EXfCqB4riHXFWHsA2oiOnabLRx4M';
    // const GOOGLE_PLACES_ENDPOINT = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json';

    const API_KEY = 'AIzaSyDylz4EXfCqB4riHXFWHsA2oiOnabLRx4M'; // Replace with your actual API key
    const radius = 5000; // Search within a 5 km radius
    const type = 'park';
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=${radius}&type=${type}&key=${API_KEY}`
      );
      const data = await response.json();
      if (data.results) {
        setParkLocations(data.results);
      }
    } catch (error) {
      console.error('Error fetching nearby parks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: location.position.latitude,
          longitude: location.position.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        <Marker
          coordinate={{ latitude: location.position.latitude, longitude: location.position.longitude }}
          title={location.name}
          description={`${location.address}`}
        />

        {
          parkLocations.map((park) => (
            <Marker
              key={park.place_id}
              coordinate={{ latitude: park.geometry.location.lat, longitude: park.geometry.location.lng }}
              title={park.name}
              description={park.vicinity}
              pinColor="green"
            />
          ))
        }
      </MapView>
      <TouchableOpacity onPress={() => {
        // Fetch nearby parks
        fetchNearbyParks(location.position);
      }}
        style={{ width: 200, height: 50, borderRadius: 15, display: 'flex', justifyContent: 'center',
        alignItems:'center', backgroundColor: '#E0BBFF', position: 'absolute', right: 40, bottom: 60 }}>
        {
          isLoading ? <ActivityIndicator animating={isLoading} color="#000" /> : <Text style={{ fontSize: 18 }}>Show Nearby Park</Text>
        }

      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default InteractiveMap;
