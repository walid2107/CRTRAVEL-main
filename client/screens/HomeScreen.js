import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, FlatList } from 'react-native';
import { connect } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
import setAuthToken from '../utils/setAuthToken';
import { getAllTrips } from '../redux/API/tripsApi';
import Home from '../Components/Home';
import { FAB, Portal, Provider } from 'react-native-paper';
import ShareTripModal from '../Components/ShareTripModal';
import BookTripModal from '../Components/BookTripModal';

const HomeScreen = (props) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [userId, setUserId] = useState('');
  const [bookedTrip,setBookedTrip]=useState({title:"",activities:[],services:[]});
  const [tokenInHeader, setTokenInHeader] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false); // New state for modal visibility
  const [isBookModalVisible, setIsBookModalVisible] = useState(false);
  const { trips, getAllTrips, navigation } = props;
  const [verifySeat, setVerifySeat] = useState(false);

  const loadProfile = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        navigation.navigate('Login');
        return;
      }
      setAuthToken(token);
      setTokenInHeader(true);
      const decoded = jwtDecode(token);
      setUserId(decoded._id);
      setFullName(decoded.fullName);
      setEmail(decoded.email);
    } catch (error) {
      console.error('Failed to load profile', error);
      navigation.navigate('Login');
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await getAllTrips();
    setIsRefreshing(false);
  };

  useEffect(() => {
    loadProfile();
  }, []);

  useEffect(() => {
    if (tokenInHeader) {
      setIsLoading(true);
      getAllTrips().then(() => setIsLoading(false));
    }
  }, [tokenInHeader]);

  const renderFooter = () => {
    if (!isLoading) return null;
    return <ActivityIndicator style={{ marginVertical: 20 }} />;
  };

  const openModal = () => {
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  const openBookModal=()=>{
    setIsBookModalVisible(true);
  }

  const closeBookModal = () => {
    setIsBookModalVisible(false);
  };

  const onBook=(trip)=>{
    setBookedTrip(trip);
    setVerifySeat(!verifySeat);
    openBookModal();
  }

  return (
    <Provider>
      <View style={styles.container}>
        <FlatList
          data={[{_id:'0000'}]}
          keyExtractor={(item) => item._id.toString()}
          renderItem={({ item }) => <Home trips={trips} userId={userId} onBook={(trip)=>{onBook(trip)}} />}
          onRefresh={handleRefresh}
          refreshing={isRefreshing}
          ListFooterComponent={renderFooter}
          onEndReachedThreshold={0.1}
          onEndReached={() => {
            if (!isLoading && !isRefreshing) {
              setIsLoading(true);
              getAllTrips().then(() => setIsLoading(false));
            }
          }}
        />
        <FAB
          style={styles.fab}
          small={false}
          icon="plus"
          onPress={openModal}
        />
        <Portal>
          <ShareTripModal visible={isModalVisible} onClose={closeModal} userId={userId} />
          <BookTripModal visible={isBookModalVisible} onClose={closeBookModal} trip={bookedTrip} userId={userId} verifySeat={verifySeat}/>
        </Portal>
      </View>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: '#03A9F4',
  },
});

const mapStateToProps = (state) => ({
  trips: state.trips.allTrips,
});

const mapDispatchToProps = {
  getAllTrips,
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);
