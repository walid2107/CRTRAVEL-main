import axios from "axios";
import * as reservationActions from '../actions/reservationActions';


const BASE_URL='http://192.168.245.153:5000';


export const bookTrip = (bookingInformations) => {
    return async dispatch => {
        try {
            const response = await axios.post(BASE_URL+'/api/reservations/create',bookingInformations);
            dispatch({
                type: reservationActions.BOOK_TRIP_SUCESS,
                payload: response.data.reservation
            });
            return response.data;
        } catch (error) {
            dispatch({
                type: reservationActions.BOOK_TRIP_FAIL,
                payload: error.response.data
            });
            return error.response.data;
        }
    };
};

export const getAllReservations = () => {
    return async dispatch => {
        try {
            const response = await axios.get(BASE_URL+'/api/reservations/get/tripowner/trip');
            dispatch({
                type: reservationActions.GET_ALL_RESERVATIONS,
                payload: response.data.reservations
            });
            return response.data;
        } catch (error) {
            dispatch({
                type: reservationActions.BOOK_TRIP_FAIL,
                payload: error.response.data
            });
            return error.response.data;
        }
    };
};
export const confirmReservationAPI = (id) => {
    return async dispatch => {
        try {
            const response = await axios.put(BASE_URL+'/api/reservations/confirm/'+id);
            dispatch({
                type: reservationActions.CONFIRM_RESERVATION,
                payload: response.data.reservation._id
            });
            return response.data;
        } catch (error) {
            dispatch({
                type: reservationActions.BOOK_TRIP_FAIL,
                payload: error.response.data
            });
            return error.response.data;
        }
    };
};

export const confirmPaymentAPI = (id) => {
    return async dispatch => {
        try {
            const response = await axios.put(BASE_URL+'/api/reservations/paymentMade/'+id);
            dispatch({
                type: reservationActions.CONFIRM_PAYMENT,
                payload: response.data.reservation._id
            });
            return response.data;
        } catch (error) {
            dispatch({
                type: reservationActions.BOOK_TRIP_FAIL,
                payload: error.response.data
            });
            return error.response.data;
        }
    };
};
