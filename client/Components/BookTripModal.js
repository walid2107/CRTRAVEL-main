import React, { useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Modal, Title, Button } from 'react-native-paper';
import RNPickerSelect from 'react-native-picker-select';
import MultiSelect from 'react-native-multiple-select';

const BookTripModal = ({ visible, onClose, trip }) => {
  const [selectedSeats, setSelectedSeats] = useState(null);
  const [selectedActivities, setSelectedActivities] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);


  if (!trip) {
    return null;
  }

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
    // Handle the booking logic here
    console.log('Booking Trip with the following details:');
    console.log('Number of Seats:', selectedSeats);
    console.log('Additional Activities:', selectedActivities);
    console.log('Additional Services:', selectedServices);
    onClose();
  };

  return (
    <Modal visible={visible} onDismiss={onClose} contentContainerStyle={styles.modalContainer}>
      <View style={styles.modalContent}>
        <Title style={styles.modalTitle}>Book Trip: {trip.title}</Title>
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
