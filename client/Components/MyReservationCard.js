import React from 'react';
import { View, Text,StyleSheet } from 'react-native';

import { Avatar } from 'react-native-paper';

const MyReservationCard = ({ reservation }) => {
  return (
    <View style={styles.card}>
      {reservation.trip ? <>
      <Avatar.Image size={40} source={{ uri: 'http://192.168.245.153:5000'+reservation.trip.postOwner.image }} />
      <Text style={styles.name}>{reservation.trip.postOwner.fullName}</Text>
      <Text>Trip Title: {reservation.trip.title}</Text>
      <Text>Phone: {reservation.phoneNumber}</Text>
      <Text>Seats: {reservation.numberOfSeats}</Text>
      <Text>Additional Services:</Text>
      {reservation.additionalServices.map(service => (
        <Text key={service._id}>{service.name}</Text>
      ))}
      <Text>Additional Activities:</Text>
      {reservation.additionalActivities.map(activity => (
        <Text key={activity._id}>{activity.name}</Text>
      ))}
        { reservation.confirmed ?
      <Text style={styles.confirm}>Reservation confirmed</Text>:<Text style={styles.waiting}>Your reservation is waiting for confirmation...</Text> }
      { reservation.paymentMade ?
      <Text style={styles.confirm}>Payment confirmed</Text>:<Text style={styles.waiting}>Your reservation payment is awaiting confirmation...</Text> }
      </>:<Text>you are not registered on a trip</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 15,
    marginVertical: 10,
    marginHorizontal: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginBottom: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  waiting:{
    color:"red"
  },
  confirm:{
    color:'green'
  }
});

export default MyReservationCard;