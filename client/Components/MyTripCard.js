import React from 'react';
import { StyleSheet } from 'react-native';
import { Avatar, Card, Title, Paragraph, Button, Text } from 'react-native-paper';
import Stars from 'react-native-stars';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';

const MyTripCard = ({ trip }) => {
  const navigation = useNavigation();

  const navigateToDiscussionRoom = () => {
    navigation.navigate('DiscussionRoom', { tripId: trip._id });
  };

  return (
    <Card style={styles.card}>
      <Card.Title
        title={trip.postOwner.fullName}
        left={() => <Avatar.Image size={40} source={{ uri: 'http://192.168.245.153:5000'+trip.postOwner.image }} />}
      />
      <Card.Cover source={{ uri: 'http://192.168.245.153:5000'+trip.image }} />
      <Card.Content>
        <Title>{trip.title}</Title>
        <Paragraph>{trip.description}</Paragraph>
        <Text>Destination: {trip.destination}</Text>
        <Text>Itinerary: {trip.itinerary.map(step => step.title).join(', ')}</Text>
        <Text>Base Price: {trip.basePrice.price} {trip.basePrice.currency}</Text>
        <Text>Start Date: {new Date(trip.startDate).toLocaleDateString()}</Text>
        <Text>End Date: {new Date(trip.endDate).toLocaleDateString()}</Text>
        {/* Map through services and activities */}
        <Text>Services: {trip.services.map(service => service.name).join(', ')}</Text>
        <Text>Activities: {trip.activities.map(activity => activity.name).join(', ')}</Text>
      </Card.Content>
      <Card.Actions>
        <Text>Likes: 250</Text>
        <Text> </Text>
        <Text>Reservations: 1</Text>
        <Text> </Text>
        <Text>Rating: 2,5</Text>
      </Card.Actions>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 10,
    backgroundColor: 'white',
  },
  myStarStyle: {
    color: 'gold',
  },
  myEmptyStarStyle: {
    color: 'gray',
  },
  likeButton: {
    backgroundColor: '#00A9F4', 
    marginRight: 10, 
  },
  bookButton: {
    backgroundColor: '#00A9F4', 
  },
  discussionIcon: {
    color: '#00A9F4', 
  },
});

export default MyTripCard;
