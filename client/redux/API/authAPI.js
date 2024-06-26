import axios from "axios";
import * as authActions from '../actions/authActions';

const BASE_URL='http://192.168.245.153:5000';

export const registerUser = (authData) => {
    const { fullName, email, password } = authData;

    return async dispatch => {
        try {
            const response = await axios.post(BASE_URL+'/api/users/register', {
                fullName,
                email,
                password
            });

            dispatch({
                type: authActions.REGISTER_USER_SUCCESS,
                payload: response.data
            });
            return response.data;
        } catch (error) {
            
            dispatch({
                type: authActions.REGISTER_USER_FAIL,
                payload: error.response.data
            });
            return error.response.data;
        }
    };
};

 export const loginUser=(authData)=>{
    const {email,password}=authData;

    return async dispatch => {
        try {
            const response = await axios.post(BASE_URL+'/api/users/login', {
                email,
                password
            });
            dispatch({
                type: authActions.LOGIN_USER_SUCCESS,
                payload: response.data
            });
            return response.data;
        } catch (error) {
            dispatch({
                type: authActions.LOGIN_USER_FAIL,
                payload: error.response.data
            });
            return error.response.data;
        }
    };
 }