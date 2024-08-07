import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import GameBoardScreen from '../Screens/GameBoardScreen';
import CreateRoomScreen from '../Screens/CreateRoomScreen';
import ProfileScreen from '../Screens/ProfileScreen';

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;
        if (route.name === 'Game Board') {
          iconName = focused ? 'grid' : 'grid-outline';
        } else if (route.name === 'Create Room') {
          iconName = focused ? 'add-circle' : 'add-circle-outline';
        } else if (route.name === 'Profile') {
          iconName = focused ? 'person' : 'person-outline';
        }
        return <Ionicons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: 'tomato',
      tabBarInactiveTintColor: 'gray',
      tabBarStyle: [
        {
          display: 'flex',
        },
        null,
      ],
    })}
  >
    <Tab.Screen name="Game Board" component={GameBoardScreen} />
    <Tab.Screen name="Create Room" component={CreateRoomScreen} />
    <Tab.Screen name="Profile" component={ProfileScreen} />
  </Tab.Navigator>
);

export default BottomTabNavigator;
