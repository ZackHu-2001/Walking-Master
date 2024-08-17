import MapView, { Marker } from "react-native-maps";
import { StyleSheet, View, Button } from "react-native";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";

const Map = () => {
    const [selectedLocation, setSelectedLocation] = useState(null);
    const navigation = useNavigation();

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

    const saveLocationHandler = () => {
        if (selectedLocation) {
            navigation.navigate('Profile', {
                selectedLocation,
            });
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
