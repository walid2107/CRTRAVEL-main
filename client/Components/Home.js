import React from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import TripCard from './TripCard';

const Home = ({ trips, userId,onBook }) => {
  const renderTrip = ({ item }) => (
    <TripCard trip={item} userId={userId} onBook={(trip)=>{onBook(trip)}} />
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={trips}
        renderItem={renderTrip}
        keyExtractor={(item) => item._id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
    padding: 10,
  },
});

export default Home;
