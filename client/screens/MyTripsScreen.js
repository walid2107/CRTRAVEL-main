import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, FlatList } from 'react-native';
import { connect } from 'react-redux';
import { getAllMyTrips } from '../redux/API/tripsApi';
import Home from '../Components/Home';
import { FAB, Portal, Provider } from 'react-native-paper';
import MyTrip from '../Components/MyTripCard';


const MyTripsScreen = (props) => {

  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { trips, getAllMyTrips, navigation } = props;

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await getAllMyTrips().then(()=>{setIsRefreshing(false)});
  };  

  useEffect(() => {
      setIsLoading(true);
      getAllMyTrips().then(() => setIsLoading(false));
  }, [navigation]);

  const renderFooter = () => {
    if (!isLoading) return null;
    return <ActivityIndicator style={{ marginVertical: 20 }} />;
  };

  return (
    <Provider>
      <View style={styles.container}>
        <FlatList
          data={trips}
          keyExtractor={(item) => item._id.toString()}
          renderItem={({ item }) => <MyTrip trip={item} />}
          onRefresh={handleRefresh}
          refreshing={isRefreshing}
          ListFooterComponent={renderFooter}
          onEndReachedThreshold={0.1}
          onEndReached={() => {
            if (!isLoading && !isRefreshing) {
              setIsLoading(true);
              getAllMyTrips().then(() => setIsLoading(false));
            }
          }}
        />
      </View>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

const mapStateToProps = (state) => ({
  trips: state.trips.mytrips,
});

const mapDispatchToProps = {
  getAllMyTrips,
};

export default connect(mapStateToProps, mapDispatchToProps)(MyTripsScreen);
