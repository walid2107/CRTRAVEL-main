import React from 'react';
import { View, StyleSheet } from 'react-native';
import { List, Divider } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MenuScreen = (props) => {
  const navigation = useNavigation();
  const logout= (props)=>{
    AsyncStorage.removeItem('token').then(()=>{
      props.navigation.navigate("Login");
    }).catch(err=>{
      console.log(err);
    })
  }
  return (
    <View style={styles.container}>
      <List.Item
        title="My Trips"
        description="View your trips"
        left={props => <List.Icon {...props} icon="map-marker" />}
        onPress={() => navigation.navigate('MyTrips')}
      />
      <Divider />
      <List.Item
        title="Reservations"
        description="View all reservations"
        left={props => <List.Icon {...props} icon="bookmark" />}
        onPress={() => navigation.navigate('Reservations')}
      />
      <Divider />
      <List.Item
        title="My Reservations"
        description="View your reservations"
        left={props => <List.Icon {...props} icon="calendar-check" />}
        onPress={() => navigation.navigate('MyReservations')}
      />
      <Divider />
      <List.Item
        title="Discussion"
        description="Join discussions"
        left={props => <List.Icon {...props} icon="forum" />}
        onPress={() => navigation.navigate('Discussion')}
      />
      <Divider />
      <List.Item
        title="Logout"
        description="Sign out of your account"
        left={props => <List.Icon {...props} icon="logout" />}
        onPress={() => logout(props)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default MenuScreen;
