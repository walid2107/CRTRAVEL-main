import React from 'react';
import {StyleSheet,View,Text} from 'react-native';
import Notification from '../Components/Notifications';

const NotificationsScreen=()=>{
    const notifications = [
        {
          userPhoto: 'https://example.com/user1.jpg',
          message: 'Notification 1',
        },
        {
          userPhoto: 'https://example.com/user2.jpg',
          message: 'Notification 2',
        },
        // Ajoutez plus de notifications si nécessaire
      ];
      

    return (
    <View style={styles.container}>
      <Notification notifications={notifications} />
    </View>
    )

}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'stretch',
      padding: 10,
    },
  });

export default NotificationsScreen;