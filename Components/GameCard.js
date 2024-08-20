import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/FontAwesome';

const SWIPE_THRESHOLD = -100;

const GameCard = ({ title, onPress, size, onSwipeRight, editMode }) => {
  const translateX = new Animated.Value(0);
  const textOpacity = new Animated.Value(1); // 新增：用于控制文本的透明度

  const onGestureEvent = Animated.event(
    [{ nativeEvent: { translationX: translateX } }],
    { useNativeDriver: true }
  );

  const onHandlerStateChange = event => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      const { translationX } = event.nativeEvent;

      if (translationX < SWIPE_THRESHOLD) {
        Animated.timing(translateX, {
          toValue: -150, // Slide the item far enough to reveal the delete icon
          duration: 300,
          useNativeDriver: true,
        }).start();
        Animated.timing(textOpacity, {
          toValue: 0, // 隐藏文本
          duration: 300,
          useNativeDriver: true,
        }).start();
      } else {
        Animated.spring(translateX, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
        Animated.spring(textOpacity, {
          toValue: 1, // 恢复文本
          useNativeDriver: true,
        }).start();
      }
    }
  };

  return (
    <PanGestureHandler
      onGestureEvent={editMode ? onGestureEvent : null}  // 仅在编辑模式启用手势
      onHandlerStateChange={editMode ? onHandlerStateChange : null}
    >
      <Animated.View style={[styles.card, { transform: [{ translateX }] }]}>
        <Text style={styles.title}>{title}</Text>
        <Animated.Text style={[styles.description, { opacity: textOpacity }]}>
          {size === 3 ? '3 X 3' : '4 X 3'}
        </Animated.Text>
        {editMode && (
          <Animated.View style={[styles.deleteButton, { opacity: translateX.interpolate({ inputRange: [-150, 0], outputRange: [1, 0] }) }]}>
            <Icon name="trash" size={30} color="red" onPress={onSwipeRight} />
          </Animated.View>
        )}
      </Animated.View>
    </PanGestureHandler>
  );
};

const styles = StyleSheet.create({
  card: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    height: 50,
    width: '100%',
    margin: 10,
    overflow: 'hidden',
  },
  title: {
    fontSize: 18,
  },
  description: {
    fontSize: 16,
    color: '#666',
  },
  deleteButton: {
    position: 'absolute',
    right: 20,
    top: 10,
    bottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,
  },
});

export default GameCard;
