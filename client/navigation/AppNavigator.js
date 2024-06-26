import {DefaultTheme, NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import MyTabs from './MyTabs';
import MyTripsScreen from '../screens/MyTripsScreen';
import ReservationsScreen from '../screens/ReservationsScreen';
import MyReservationsScreen from '../screens/MyReservationsScreen';
import DiscussionScreen from '../screens/DiscussionScreen';

const Stack=createNativeStackNavigator();

function AppNavigator(){

    return(
        <NavigationContainer>
        
          <Stack.Navigator>
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{headerShown:false}}
            />
             <Stack.Screen
            name="Register"
            component={RegisterScreen}
            options={{headerShown:false}}
            />         
            <Stack.Screen
            name="Main"
            component={MyTabs}
            options={{headerShown:false}}
            />
        <Stack.Screen
          name="MyTrips"
          component={MyTripsScreen}
          options={{ title: 'My Trips' }}
        />
        <Stack.Screen
          name="Reservations"
          component={ReservationsScreen}
          options={{ title: 'Reservations' }}
        />
        <Stack.Screen
          name="MyReservations"
          component={MyReservationsScreen}
          options={{ title: 'My Reservations' }}
        />
       <Stack.Screen
          name="Discussion"
          component={DiscussionScreen}
          options={{ title: 'Discussion' }}
        />
        </Stack.Navigator>
        </NavigationContainer>
    )

}

export default AppNavigator;

