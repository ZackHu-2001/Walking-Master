import { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { getGameInfo } from "../Firebase/firestoreHelper";
import Tile from "../Components/Tile";
import FloatingActionButton from "../Components/FloatingActionButton";
import { useRoute } from "@react-navigation/native";
import { Portal, Modal, Button, IconButton } from "react-native-paper";
import { Dimensions } from "react-native";
import * as ImagePicker from 'expo-image-picker';

const GameScreen = ({ navigation }) => {
  const [gameInfo, setGameInfo] = useState(null);
  const [tiles, setTiles] = useState([]);
  const route = useRoute();
  const { gameId } = route.params;
  const [visible, setVisible] = useState(false);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  useEffect(() => {
    const fetchGameInfo = async () => {
      const gameInfo = await getGameInfo(gameId);
      navigation.setOptions({ title: gameInfo?.name });
      setTiles(gameInfo.tiles);
      setGameInfo(gameInfo);
    }

    fetchGameInfo();
  }, []);

  const [imageUri, setImageUri] = useState(null);

  const requestCameraPermission = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Camera access is required to take a photo.');
      return false;
    }
    return true;
  };

  const requestLibraryPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Media library access is required to select a photo.');
      return false;
    }
    return true;
  };

  const handleSelectImage = async () => {
    const hasPermission = await requestLibraryPermission();
    if (!hasPermission) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setImageUri(result.uri);
    }
  };

  const handleTakePhoto = async () => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) return;

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setImageUri(result.uri);
    }
  };

  const handleButtonPress = () => {
    Alert.alert(
      'Select an option',
      '',
      [
        { text: 'Take Photo', onPress: handleTakePhoto },
        { text: 'Choose from Library', onPress: handleSelectImage },
        { text: 'Cancel', style: 'cancel' },
      ],
      { cancelable: true }
    );
  };
  
  return (
    <View style={styles.container}>
      <Portal>
        <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={styles.modalContainer}>
          <View style={{ width: Dimensions.get('window').width - 20, }}>
            <TouchableOpacity >
              <IconButton
                onPress={handleButtonPress}
                icon="plus"
                color={'#000'} // You can change the color to whatever you prefer
                size={60} // You can adjust the size to fit your needs
                style={{ width: 120, height: 120, backgroundColor: '#898989' }}
              />
            </TouchableOpacity>
          </View>
        </Modal>
      </Portal>

      {
        gameInfo &&
        <View style={styles.tilesContainer}>
          {
            tiles.map((row, index) => {
              return <View key={index} style={styles.tilesRow}>
                {
                  row['cells'].map((tile, index) => {
                    return <Tile key={index} imgUrl={tile.bgImgUrl} visited={tile.visited} onPress={showModal} />
                  })
                }
              </View>
            })
          }
        </View>
      }
      {/* <FloatingActionButton /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  bgImg: {
    flex: 1,
    resizeMode: 'cover',
  },
  tilesContainer: {
    flex: 1,
    flexDirection: 'column',
    flexWrap: 'wrap',
    gap: 25,
    transform: [{ translateY: Dimensions.get('window').height / 6 }],
    // justifyContent: 'center',
    alignItems: 'center'
  },
  tilesRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around'
  }
});

export default GameScreen;
