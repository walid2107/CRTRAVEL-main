// Importez les modules nécessaires
import React, { useState } from 'react';
import { View, Text, Image, TextInput, FlatList, StyleSheet, Dimensions, TouchableOpacity, ScrollView } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Card, Avatar, Button, Modal, Portal, Provider } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';

const { width } = Dimensions.get('window');

const SharedMemory = ({ albums }) => {
  const [comment, setComment] = useState('');
  const [liked, setLiked] = useState({});
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedComments, setSelectedComments] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [userAvatar, setUserAvatar] = useState('');
  const [images, setImages] = useState([]);

  const handleLike = (albumId) => {
    setLiked(prevState => ({
      ...prevState,
      [albumId]: !prevState[albumId]
    }));
  };

  const openCommentsModal = (comments, user, avatar) => {
    setSelectedComments(comments);
    setSelectedUser(user);
    setUserAvatar(avatar);
    setModalVisible(true);
  };

  const handleAddImage = async () => {
    // Utiliser ImagePicker.launchImageLibraryAsync pour lancer la bibliothèque d'images
    let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert('Permission to access camera roll is required!');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setImages([...images, { uri: result.uri }]);
    }
  };

  const renderAlbum = ({ item }) => {
    const numColumns = Math.floor(width / 150);
    const imageSize = width / numColumns - 10;

    return (
      <Card style={styles.card}>
        <Card.Title
          title={item.user}
          left={(props) => <Avatar.Image {...props} source={{ uri: item.userAvatar }} />}
        />
        <Card.Content>
          <ScrollView horizontal>
            {item.album.map((url, index) => (
              <Image
                key={index}
                source={{ uri: url }}
                style={{ width: imageSize, height: imageSize, margin: 5 }}
              />
            ))}
          </ScrollView>
          <View style={styles.actions}>
            <TouchableOpacity onPress={() => handleLike(item.id)}>
              <MaterialCommunityIcons
                name={liked[item.id] ? 'heart' : 'heart-outline'}
                size={24}
                color={liked[item.id] ? 'red' : 'gray'}
              />
            </TouchableOpacity>
            <Text>{item.evaluation + (liked[item.id] ? 1 : 0)}</Text>
            <TouchableOpacity onPress={() => openCommentsModal(item.comments, item.user, item.userAvatar)}>
              <Text style={styles.commentText}>Comments</Text>
            </TouchableOpacity>
          </View>
          <TextInput
            style={styles.input}
            placeholder="Add a comment..."
            value={comment}
            onChangeText={setComment}
          />
          <Button textColor='#00A9F4' onPress={() => console.log(`Comment on ${item.id}: ${comment}`)}>Comment</Button>
        </Card.Content>
      </Card>
    );
  };

  return (
    <Provider>
      <View style={{ flex: 1 }}>
        <FlatList
          data={albums}
          renderItem={renderAlbum}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.container}
        />
        <TouchableOpacity style={styles.addButton} onPress={handleAddImage}>
          <MaterialCommunityIcons name="plus" size={24} color="black" />
        </TouchableOpacity>
        <Portal>
          <Modal visible={isModalVisible} onDismiss={() => setModalVisible(false)} contentContainerStyle={styles.modal}>
            <ScrollView>
              {selectedComments.map((comment, index) => (
                <View key={index} style={styles.commentContainer}>
                  <View>
                  <Text style={styles.commentUser}>{selectedUser}</Text>
                  <Avatar.Image size={24} source={{ uri: userAvatar }} />
                  </View>
                  <Text style={styles.comment}>{comment}</Text>
                  
                </View>
              ))}
            </ScrollView>
          </Modal>
        </Portal>
      </View>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  card: {
    marginBottom: 20,
    backgroundColor: '#ffffff',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  commentText: {
    marginLeft: 10,
    color: '#00A9F4',
  },
  commentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
    padding: 10,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    width: '100%', 
  },
  commentUser: {
    fontWeight: 'bold',
  },
  comment: {
    flex: 1,
    paddingHorizontal: 5,
    paddingVertical: 2,
    margin:10,
    marginLeft: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 8,
    marginTop: 10,
    marginBottom: 5,
  },
  addButton: {
    position: 'absolute',
    bottom: 10,
    left: 20,
    width: 60,
    height: 60,
    borderRadius: 15,
    backgroundColor: '#00A9F4',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  modal: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 10,
  },
});

export default SharedMemory;
