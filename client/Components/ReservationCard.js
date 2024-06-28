import React, {useState } from 'react';
import { View, Text, Button, ActivityIndicator,StyleSheet } from 'react-native';

import { Avatar } from 'react-native-paper';


const ReservationCard = ({ reservation, onConfirmReservation, onConfirmPayment }) => {
  const [isConfirmingReservation, setIsConfirmingReservation] = useState(false);
  const [isConfirmingPayment, setIsConfirmingPayment] = useState(false);

  const handleConfirmReservation = async () => {
    setIsConfirmingReservation(true);
    await onConfirmReservation(reservation._id);
    setIsConfirmingReservation(false);
  };

  const handleConfirmPayment = async () => {
    setIsConfirmingPayment(true);
    await onConfirmPayment(reservation._id);
    setIsConfirmingPayment(false);
  };

  return (
    <View style={styles.card}>
      <Avatar.Image size={40} source={{ uri: 'http://192.168.245.153:5000'+reservation.user.image }} />
      <Text style={styles.name}>{reservation.user.fullName}</Text>
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
        { reservation.confirmed &&
      <Text>Peservation confirmed</Text> }
      { reservation.paymentMade &&
      <Text>Payment confirmed</Text> }
      <View style={styles.buttonContainer}>
        {!reservation.confirmed && (
          <View style={styles.buttonWrapper}>
            <Button
              onPress={handleConfirmReservation}
              title={isConfirmingReservation ? 'Loading...' : 'Confirm Reservation'}
              disabled={isConfirmingReservation}
            />
            {isConfirmingReservation && <ActivityIndicator size="small" color="#0000ff" />}
          </View>
        )}
        {!reservation.paymentMade && (
          <View style={styles.buttonWrapper}>
            <Button
              onPress={handleConfirmPayment}
              title={isConfirmingPayment ? 'Loading...' : 'Confirm Payment'}
              disabled={isConfirmingPayment}
            />
            {isConfirmingPayment && <ActivityIndicator size="small" color="#0000ff" />}
          </View>
        )}
      </View>
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
  buttonContainer: {
    marginTop: 10,
  },
  buttonWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 5,
  },
});

export default ReservationCard;