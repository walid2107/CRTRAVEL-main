import React, { useEffect,useState  } from 'react';
import { SafeAreaView, StyleSheet, FlatList, Alert,Text } from 'react-native';
import { connect } from 'react-redux';
import { getAllReservations,confirmReservationAPI,confirmPaymentAPI } from '../redux/API/reservationAPI';
import ReservationCard from '../Components/ReservationCard';


const ReservationsList = ({ reservations, confirmReservation, confirmPayment }) => {
  const handleConfirmReservation = async (reservationId) => {
    await confirmReservation(reservationId);
  };

  const handleConfirmPayment = async (reservationId) => {
    await confirmPayment(reservationId);
  };

  const renderItem = ({ item }) =>{
   return (<ReservationCard
      reservation={item}
      onConfirmReservation={handleConfirmReservation}
      onConfirmPayment={handleConfirmPayment}
    />)
};

  return (
    <FlatList
      data={reservations}
      renderItem={renderItem}
      keyExtractor={(item) => item._id.toString()}
    />
  );
};

const ReservationsScreen = (props) => {
  const { reservations, getAllReservations,confirmReservationAPI,confirmPaymentAPI, navigation } = props;
  const [error,setError]=useState(false);
  useEffect(() => {
    setError(false);
    getAllReservations().then(result=>{
      if(!result.success)
        {
          setError(true);
        }
    });
  }, [navigation]);
 
  const confirmReservation = async (reservationId) => {
    return new Promise(async (resolve) =>{ 
      await confirmReservationAPI(reservationId).then((res)=>{
      if(res.success)
        {
          Alert.alert("the reservation is confirmed !");
        }else
        {
          Alert.alert(res.errors[0].msg);
        }
        resolve();
    }).catch((err)=>{
      Alert.alert(err.errors[0].msg);
      resolve();
    })});
  };

  const confirmPayment = async (reservationId) => {
    return new Promise(async (resolve) =>{ 
      await confirmPaymentAPI(reservationId).then((res)=>{
      if(res.success)
        {
          Alert.alert("the payment is confirmed !");
        }else
        {
          Alert.alert(res.errors[0].msg);
        }
        resolve();
    }).catch((err)=>{
      Alert.alert(err.errors[0].msg);
      resolve();
    })});
  };

  return (
    <SafeAreaView style={styles.container}>
      {!error ?(
        <ReservationsList
          reservations={reservations}
          confirmReservation={confirmReservation}
          confirmPayment={confirmPayment}
        />
      ):<Text>No reservations found for your trips.</Text>}
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
  reservations: state.reservation.reservations,
});

const mapDispatchToProps = {
  getAllReservations,
  confirmReservationAPI,
  confirmPaymentAPI
};

export default connect(mapStateToProps, mapDispatchToProps)(ReservationsScreen);
