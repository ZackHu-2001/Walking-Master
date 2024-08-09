import { Dimensions, View, StyleSheet, ScrollView, Text } from "react-native";
import { Button } from "react-native-paper";
import React from "react";

const NewGame = () => {
  
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text>游玩方法</Text>
        <Text>散步途中捕捉到卡片描述画面时，拍摄上传照片即可占领当前格。完成连线（横向、纵向、斜向）宣布获胜，耶嘿！（Tips：不能耍赖用旧照片哦）</Text>
      </View>

      <View style={styles.card}>
        <Text>棋盘大小</Text>
      </View>

      <View style={styles.card}>
        <Text>棋盘大小</Text>
        <ScrollView>

        </ScrollView>
      </View>

      <Button>Create Game</Button>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: Dimensions.get('window').width - 40,
    flexDirection: 'column',
    gap: 15,
    paddingTop: 40,
    paddingBottom: 40,
    paddingLeft: 25,
    paddingRight: 25,
    backgroundColor: 'white',
    borderRadius: 20,

  },
  card: {
    width: '100%',
    flexDirection: 'column',
    gap: 10,
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
  },
  title: {
    fontSize: 20,
  },
  button: {
    backgroundColor: 'white',
    width: 40,
    height: 20
  },

});

export default NewGame;
