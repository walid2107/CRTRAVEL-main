import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import HomeScreen from '../screens/HomeScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import SharedMemoryScreen from '../screens/SharedMemoryScreen';
import MenuScreen from '../screens/MenuScreen';


const Tab = createBottomTabNavigator();

function MyTabs() {
    return (
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName;
  
            if (route.name === 'Home') {
              iconName = 'home';
            } else if (route.name === 'Shared Memory') {
              iconName = 'album';
            } else if (route.name === 'Notifications') {
              iconName = 'bell';
            } else if (route.name === 'Menu') {
              iconName = 'menu';
            }
  
            return <MaterialCommunityIcons name={iconName} color={color} size={size} />;
          },
          activeTintColor: '#00008b', 
          inactiveTintColor: '#738289', 
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Shared Memory" component={SharedMemoryScreen} />
        <Tab.Screen name="Notifications" component={NotificationsScreen} />
        <Tab.Screen name="Menu" component={MenuScreen} />
      </Tab.Navigator>
    );
  }
  
  export default MyTabs;