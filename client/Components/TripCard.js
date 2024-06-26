import React from 'react';
import { StyleSheet } from 'react-native';
import { Avatar, Card, Title, Paragraph, Button, Text } from 'react-native-paper';
import Stars from 'react-native-stars';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';

const TripCard = ({ trip, onBook }) => {
  const navigation = useNavigation();

  const navigateToDiscussionRoom = () => {
    navigation.navigate('DiscussionRoom', { tripId: trip._id });
  };

  return (
    <Card style={styles.card}>
      <Card.Title
        title={trip.postOwner.fullName}
        left={() => <Avatar.Image size={40} source={{ uri: 'https://observatoirevivreensemble.org/sites/default/files/styles/obs-screen-lg-16-9/public/av_bourguiba.jpg?itok=g-wRGuZQ' }} />}
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
        <Stars
          default={0}
          count={5}
          half={true}
          starSize={30} // Adjust star size
          fullStar={<Icon name={'star'} style={[styles.myStarStyle, { fontSize: 30 }]} />}
          emptyStar={<Icon name={'star-outline'} style={[styles.myStarStyle, styles.myEmptyStarStyle, { fontSize: 30 }]} />}
          halfStar={<Icon name={'star-half'} style={[styles.myStarStyle, { fontSize: 30 }]} />}
          update={(rating) => console.log(rating)}
        />
      </Card.Content>
      <Card.Actions>
        {/* Like button with matching color */}
        <Button icon="thumb-up" textColor='white' mode="text" onPress={() => console.log('Liked')} style={styles.likeButton}>Like</Button>
        {/* Book button with matching color */}
        <Button mode="contained" onPress={()=>{onBook(trip)}} style={styles.bookButton}>Book</Button>
        {/* Icon to navigate to discussion room */}
        <Icon
          name="forum"
          size={30}
          style={styles.discussionIcon}
          onPress={navigateToDiscussionRoom}
        />
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

export default TripCard;
