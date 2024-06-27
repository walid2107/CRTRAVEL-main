import axios from "axios";
import * as reservationActions from '../actions/reservationActions';


const BASE_URL='http://192.168.245.153:5000';


export const bookTrip = (bookingInformations) => {
    return async dispatch => {
        try {
            const response = await axios.post(BASE_URL+'/api/reservations/create',bookingInformations);
            console.log(response.data.reservation);
            dispatch({
                type: reservationActions.BOOK_TRIP_SUCESS,
                payload: response.data.reservation
            });
            return response.data;
        } catch (error) {
            console.log("Walid");
            dispatch({
                type: reservationActions.BOOK_TRIP_FAIL,
                payload: error.response.data
            });
            return error.response.data;
        }
    };
};