import { TouchableOpacity, View, StyleSheet, ImageBackground } from "react-native"

const Tile = ({ imgUrl, visited, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.Tile, visited && styles.visited]}>
      <ImageBackground source={{
        uri: imgUrl
      }} style={styles.Tile} />
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  Tile: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  visited: {
    borderColor: 'red',
    borderWidth: 2
  }
})

export default Tile;
