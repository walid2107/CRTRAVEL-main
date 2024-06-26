import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import AppNavigator from './navigation/AppNavigator';
import { Provider as PaperProvider } from 'react-native-paper';
import {Provider} from 'react-redux'
import store from './redux/store'

export default function App() {
  return (
    <Provider store={store}>
    <PaperProvider>
    <AppNavigator/>
    </PaperProvider>
    </Provider>
  );
}

const styles = StyleSheet.create({
});
