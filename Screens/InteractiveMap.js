import React from 'react';
import { View, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

const InteractiveMap = ({ navigation, route }) => {
  const { location } = route.params;
  return (
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
    </MapView>
  );
};

const styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default InteractiveMap;
