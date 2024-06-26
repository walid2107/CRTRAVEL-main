import React, { useState } from 'react';
import { StyleSheet, View, TextInput, ScrollView, Text, Image, TouchableOpacity } from 'react-native';
import { Modal, Title, Button, DataTable, IconButton, Portal, Dialog, Provider } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { shareNewTrip } from '../redux/API/tripsApi';
import { useDispatch } from 'react-redux';
import { Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker'; 

const ShareTripModal = ({ visible, onClose, userId }) => {
  const [tripDetails, setTripDetails] = useState({
    title: '',
    description: '',
    destination: '',
    numberOfSeats: '',
    itinerary: [],
    basePrice: { price: '', currency: '' },
    startDate: new Date(),
    endDate: new Date(),
    services: [],
    activities: [],
  });

  const [image, setImage] = useState(null); 

  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [detailsType, setDetailsType] = useState('');
  const [detailInput, setDetailInput] = useState({ name: '', description: '', price: '', duration: '' });

  const dispatch = useDispatch();

  const handleChange = (name, value) => {
    setTripDetails({ ...tripDetails, [name]: value });
  };

  const handleDetailInputChange = (name, value) => {
    setDetailInput({ ...detailInput, [name]: value });
  };

  const handleShareTrip = () => {
    const trip = {
      postOwner: userId,
      title: tripDetails.title,
      description: tripDetails.description,
      destination: tripDetails.destination,
      numberOfSeats: tripDetails.numberOfSeats,
      itinerary: tripDetails.itinerary.map((item, index) => ({
        stepNumber: index + 1,
        title: item.name,
        description: item.description,
        completed: false,
      })),
      basePrice: tripDetails.basePrice,
      startDate: tripDetails.startDate,
      endDate: tripDetails.endDate,
      services: tripDetails.services,
      activities: tripDetails.activities,
    };
    dispatch(shareNewTrip(trip,image)).then((result) => {
      if (result.success) {
        onClose();
        setTripDetails({
          title: '',
          description: '',
          destination: '',
          numberOfSeats: '',
          itinerary: [],
          basePrice: { price: '', currency: '' },
          startDate: new Date(),
          endDate: new Date(),
          services: [],
          activities: [],
        });
        setImage(null); 
      } else {
        Alert.alert(result.errors[0].msg);
      }
    }).catch(err => {
      console.log(err);
    });
  };

  const handleStartDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || tripDetails.startDate;
    handleChange('startDate', currentDate);
  };

  const handleEndDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || tripDetails.endDate;
    handleChange('endDate', currentDate);
  };

  const openDetailsDialog = (type) => {
    setDetailsType(type);
    setDetailInput({ name: '', description: '', price: '', duration: '' });
    setShowDetailsDialog(true);
  };

  const closeDetailsDialog = () => {
    setShowDetailsDialog(false);
  };

  const addDetail = () => {
    if (detailInput.name.trim() === '' || detailInput.description.trim() === '') return;

    const updatedTripDetails = { ...tripDetails };
    if (detailsType === 'itinerary') {
      updatedTripDetails.itinerary.push({ name: detailInput.name, description: detailInput.description });
    } else {
      updatedTripDetails[detailsType].push({
        name: detailInput.name,
        description: detailInput.description,
        price: detailInput.price,
        duration: detailInput.duration
      });
    }
    setTripDetails(updatedTripDetails);
    closeDetailsDialog();
  };

  const handleImagePicker = async () => {
    let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }

    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
    });

    if (!pickerResult.cancelled) {
      setImage(pickerResult.assets[0].uri);
    }
  };

  return (
    <Modal visible={visible} onDismiss={onClose} contentContainerStyle={styles.modalContainer}>
      <ScrollView contentContainerStyle={styles.modalContent}>
        <Title style={styles.modalTitle}>Share a Trip</Title>

        {image && (
          <View style={styles.imageContainer}>
            <Image source={{ uri: image }} style={styles.image} />
          </View>
        )}

        <TouchableOpacity onPress={handleImagePicker} style={styles.imagePickerButton}>
          <Text style={styles.imagePickerText}>Select Trip Image</Text>
        </TouchableOpacity>

        <TextInput placeholder="Title" style={styles.input} value={tripDetails.title} onChangeText={(text) => handleChange('title', text)} />
        <TextInput placeholder="Description" style={styles.input} value={tripDetails.description} onChangeText={(text) => handleChange('description', text)} />
        <TextInput placeholder="Destination" style={styles.input} value={tripDetails.destination} onChangeText={(text) => handleChange('destination', text)} />
        <TextInput placeholder="Number of Seats" style={styles.input} value={tripDetails.numberOfSeats} onChangeText={(text) => handleChange('numberOfSeats', text)} keyboardType="numeric" />
        <TextInput placeholder="Base Price" style={styles.input} value={tripDetails.basePrice.price} onChangeText={(text) => handleChange('basePrice', { ...tripDetails.basePrice, price: text })} keyboardType="numeric" />
        <TextInput placeholder="Currency" style={styles.input} value={tripDetails.basePrice.currency} onChangeText={(text) => handleChange('basePrice', { ...tripDetails.basePrice, currency: text })} />
        <View style={styles.dateInputContainer}>
          <TextInput
            placeholder="Start Date"
            style={[styles.input, styles.dateInput]}
            value={tripDetails.startDate.toDateString()}
            onFocus={() => setShowStartDatePicker(true)}
            editable={false}
          />
          <IconButton icon="calendar" onPress={() => setShowStartDatePicker(true)} />
          {showStartDatePicker && (
            <DateTimePicker
              value={tripDetails.startDate}
              mode="date"
              display="default"
              onChange={handleStartDateChange}
            />
          )}
        </View>
        <View style={styles.dateInputContainer}>
          <TextInput
            placeholder="End Date"
            style={[styles.input, styles.dateInput]}
            value={tripDetails.endDate.toDateString()}
            onFocus={() => setShowEndDatePicker(true)}
            editable={false}
          />
          <IconButton icon="calendar" onPress={() => setShowEndDatePicker(true)} />
          {showEndDatePicker && (
            <DateTimePicker
              value={tripDetails.endDate}
              mode="date"
              display="default"
              onChange={handleEndDateChange}
            />
          )}
        </View>
        <View style={{ marginVertical: 5 }}>
          <Button mode="contained" onPress={() => openDetailsDialog('itinerary')} style={styles.button}>Add Itinerary</Button>
        </View>
        <View style={{ marginVertical: 5 }}>
          <Button mode="contained" onPress={() => openDetailsDialog('services')} style={styles.button}>Add Services</Button>
        </View>
        <View style={{ marginVertical: 5 }}>
          <Button mode="contained" onPress={() => openDetailsDialog('activities')} style={styles.button}>Add Activities</Button>
        </View>

        {/* Display added details */}
        <View style={styles.addedDetailsContainer}>
          <Text style={styles.detailsHeading}>Added Itinerary:</Text>
          <View style={styles.addedDetails}>
            {tripDetails.itinerary.map((item, index) => (
              <View key={index} style={styles.addedDetail}>
                <Text>{item.name}</Text>
              </View>
            ))}
          </View>

          <Text style={styles.detailsHeading}>Added Services:</Text>
          <View style={styles.addedDetails}>
            {tripDetails.services.map((item, index) => (
              <View key={index} style={styles.addedDetail}>
                <Text>{item.name}</Text>
                <Text>{item.price}</Text>
                <Text>{item.duration}</Text>
              </View>
            ))}
          </View>

          <Text style={styles.detailsHeading}>Added Activities:</Text>
          <View style={styles.addedDetails}>
            {tripDetails.activities.map((item, index) => (
              <View key={index} style={styles.addedDetail}>
                <Text>{item.name}</Text>
                <Text>{item.price}</Text>
                <Text>{item.duration}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={{ marginVertical: 5 }}>
          <Button mode="contained" onPress={handleShareTrip} style={styles.button}>Share</Button>
        </View>
      </ScrollView>
      <Portal>
        <Dialog visible={showDetailsDialog} onDismiss={closeDetailsDialog}>
          <Dialog.Title>Add {detailsType.charAt(0).toUpperCase() + detailsType.slice(1)}</Dialog.Title>
          <Dialog.Content>
            <DataTable>
              <DataTable.Header>
                <DataTable.Title>Name</DataTable.Title>
                <DataTable.Title>Description</DataTable.Title>
                {detailsType !== 'itinerary' && (
                  <>
                    <DataTable.Title>Price</DataTable.Title>
                    <DataTable.Title>Duration</DataTable.Title>
                  </>
                )}
              </DataTable.Header>
              <DataTable.Row>
                <TextInput
                  placeholder="Name"
                  value={detailInput.name}
                  onChangeText={(text) => handleDetailInputChange('name', text)}
                  style={styles.detailInput}
                />
                <TextInput
                  placeholder="Description"
                  value={detailInput.description}
                  onChangeText={(text) => handleDetailInputChange('description', text)}
                  style={styles.detailInput}
                />
                {detailsType !== 'itinerary' && (
                  <>
                    <TextInput
                      placeholder="Price"
                      value={detailInput.price}
                      onChangeText={(text) => handleDetailInputChange('price', text)}
                      style={styles.detailInput}
                      keyboardType="numeric"
                    />
                    <TextInput
                      placeholder="Duration"
                      value={detailInput.duration}
                      onChangeText={(text) => handleDetailInputChange('duration', text)}
                      style={styles.detailInput}
                    />
                  </>
                )}
              </DataTable.Row>
            </DataTable>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={addDetail}>Add</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
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
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 10,
    resizeMode: 'cover',
  },
  imagePickerButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#00A9F4',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  imagePickerText: {
    color: 'white',
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  dateInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  dateInput: {
    flex: 1,
    marginRight: 10,
  },
  addedDetailsContainer: {
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    marginTop: 20,
  },
  detailsHeading: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  addedDetails: {
    marginTop: 10,
  },
  addedDetail: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#f2f2f2',
    borderRadius: 5,
  },
  detailInput: {
    flex: 1,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#00A9F4',
  },
});

export default ShareTripModal;
