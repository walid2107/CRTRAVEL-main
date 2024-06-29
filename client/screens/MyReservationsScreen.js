import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, FlatList, Alert,Text } from 'react-native';
import { connect} from 'react-redux';
import { getMyReservations } from '../redux/API/reservationAPI';
import MyReservationCard from '../Components/MyReservationCard';


const ReservationsList = ({ reservations}) => {

  const renderItem = ({ item }) => (
    <MyReservationCard
      reservation={item}
    />
  );

  return (
    <FlatList
      data={reservations}
      renderItem={renderItem}
      keyExtractor={(item) => item._id.toString()}
    />
  );
};

const MyReservationsScreen = (props) => {
  const { getMyReservations,myReservations, navigation } = props;
  const [error,setError]=useState(false);

  useEffect(() => {
    setError(false);
    getMyReservations().then(result=>{
      if(!result.success)
        {
          setError(true);
        }
    })
  }, [navigation]);
 


  return (
    <SafeAreaView style={styles.container}>
      {!error ? (
        <ReservationsList
          reservations={myReservations}
        />
      ):<Text>You are not reserved on any trip. </Text>}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
});

const mapStateToProps = (state) => ({
  myReservations: state.reservation.myReservations,
});

const mapDispatchToProps = {
  getMyReservations,
};

export default connect(mapStateToProps, mapDispatchToProps)(MyReservationsScreen);
