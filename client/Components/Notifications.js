import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Avatar, List } from 'react-native-paper';

const Notification = ({ notifications }) => {
  return (
    <View style={styles.container}>
      {notifications.map((notification, index) => (
        <List.Item
          key={index}
          title={notification.message}
          description="Notification description"
          left={() => <Avatar.Image size={40} source={{ uri: notification.userPhoto }} />}
          style={styles.notification}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  notification: {
    marginBottom: 10,
    backgroundColor: '#ffffff', 
    borderRadius: 8,
  },
});

export default Notification;
