import axios from "axios";
import * as tripsActions from '../actions/tripsActions';


const BASE_URL='http://192.168.245.153:5000';


export const getAllTrips = () => {
    return async dispatch => {
        try {
            const response = await axios.get(BASE_URL+'/api/trips/get/all');
            dispatch({
                type: tripsActions.GET_ALL_TRIPS,
                payload: response.data
            });
            return response.data;
        } catch (error) {
            dispatch({
                type: tripsActions.LOADING_TRIPS_ERROR,
                payload: error.response.data
            });
            return error.response.data;
        }
    };
};

export const getAllMyTrips = () => {
    return async dispatch => {
        try {
            const response = await axios.get(BASE_URL+'/api/trips/get/all/MyTrips/');
            dispatch({
                type: tripsActions.GET_ALL_My_TRIPS,
                payload: response.data.trips
            });
            return response.data;
        } catch (error) {
            dispatch({
                type: tripsActions.LOADING_TRIPS_ERROR,
                payload: error.response.data
            });
            return error.response.data;
        }
    };
};

export const shareNewTrip = (trip,uri) => {
    return async dispatch => {
        try {
            // Prepare form data
            const formData = new FormData();
            formData.append('tripDetails', JSON.stringify(trip));
            // Add image to formData
            if (uri) {
               formData.append('image', {
               uri: uri,
               type: 'image/jpeg', 
               name: 'trip_image.jpg'
            });
            }
            
            const response = await axios.post(BASE_URL+'/api/trips/create', formData, { headers: {'Content-Type': 'multipart/form-data'}});
            dispatch({
                type: tripsActions.SHARE_NEW_TRIP,
                payload: response.data.trip
            });
            return response.data;
        } catch (error) {
            console.log(error.response.data);
            dispatch({
                type: tripsActions.SHARE_TRIP_ERROR,
                payload: error.response.data
            });
            
            return error.response.data;
        }
    };
};