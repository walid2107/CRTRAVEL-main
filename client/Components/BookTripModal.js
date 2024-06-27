import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TextInput, Alert } from 'react-native';
import { Modal, Title, Button } from 'react-native-paper';
import RNPickerSelect from 'react-native-picker-select';
import MultiSelect from 'react-native-multiple-select';
import { useDispatch } from 'react-redux';
import { bookTrip } from '../redux/API/reservationAPI';

const BookTripModal = ({ visible, onClose, trip, userId,verifySeat }) => {
  const [selectedSeats, setSelectedSeats] = useState(null);
  const [selectedActivities, setSelectedActivities] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [phoneNumber, setPhoneNumber] = useState('');
  const dispatch = useDispatch();

  if (!trip) {
    return null;
  }
  useEffect(()=>{
    if(trip.availableSeats <= 0)
    {
      Alert.alert(
        "No more available places!",
        null,
        [
          {
            text: "OK",
            onPress: () => {
              onClose();
            }
          }
        ],
        { cancelable: false }
      );
    }
  },[verifySeat]);

  const seatsOptions = Array.from({ length: trip.availableSeats }, (_, i) => ({
    label: `${i + 1}`,
    value: i + 1,
  }));

  const activityOptions = trip.activities.map((activity, index) => ({
    id: activity._id,
    name: activity.name,
  }));

  const serviceOptions = trip.services.map((service, index) => ({
    id: service._id,
    name: service.name,
  }));

  const handleBookTrip = () => {
    const bookTripInfo = {
      user: userId,
      trip: trip._id,
      numberOfSeats: selectedSeats,
      additionalServices: selectedServices,
      additionalActivities: selectedActivities,
      phoneNumber,
    };

    dispatch(bookTrip(bookTripInfo))
      .then((result) => {
        if (result.success) {
          onClose();
          setSelectedSeats(null);
          setSelectedActivities([]);
          setSelectedServices([]);
          setPhoneNumber('');
        } else {
          Alert.alert(result.errors[0].msg);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <Modal visible={visible} onDismiss={onClose} contentContainerStyle={styles.modalContainer}>
      <View style={styles.modalContent}>
        <Title style={styles.modalTitle}>Book Trip: {trip.title}</Title>
        <Text>Phone Number</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your phone number"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          keyboardType="phone-pad"
        />
        <Text>Number of Seats</Text>
        <RNPickerSelect
          onValueChange={(value) => setSelectedSeats(value)}
          items={seatsOptions}
          style={pickerSelectStyles}
        />
        <Text>Additional Activities</Text>
        <MultiSelect
          items={activityOptions}
          uniqueKey="id"
          onSelectedItemsChange={setSelectedActivities}
          selectedItems={selectedActivities}
          selectText="Pick Activities"
          searchInputPlaceholderText="Search Activities..."
          tagRemoveIconColor="#CCC"
          tagBorderColor="#CCC"
          tagTextColor="#CCC"
          selectedItemTextColor="#03A9F4"
          selectedItemIconColor="#03A9F4"
          itemTextColor="#000"
          displayKey="name"
          searchInputStyle={{ color: '#CCC' }}
          submitButtonColor="#03A9F4"
          submitButtonText="Submit"
          styleMainWrapper={styles.multiSelect}
        />
        <Text>Additional Services</Text>
        <MultiSelect
          items={serviceOptions}
          uniqueKey="id"
          onSelectedItemsChange={setSelectedServices}
          selectedItems={selectedServices}
          selectText="Pick Services"
          searchInputPlaceholderText="Search Services..."
          tagRemoveIconColor="#CCC"
          tagBorderColor="#CCC"
          tagTextColor="#CCC"
          selectedItemTextColor="#03A9F4"
          selectedItemIconColor="#03A9F4"
          itemTextColor="#000"
          displayKey="name"
          searchInputStyle={{ color: '#CCC' }}
          submitButtonColor="#03A9F4"
          submitButtonText="Submit"
          styleMainWrapper={styles.multiSelect}
        />
        <Button mode="contained" onPress={handleBookTrip} style={styles.bookButton}>
          Confirm Booking
        </Button>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 10,
  },
  modalContent: {
    alignItems: 'stretch',
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 10,
  },
  bookButton: {
    marginTop: 20,
  },
  multiSelect: {
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30,
    marginBottom: 10,
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: 'gray',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30,
    marginBottom: 10,
  },
});

export default BookTripModal;
