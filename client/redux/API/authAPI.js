import axios from "axios";
import * as authActions from '../actions/authActions';

const BASE_URL = 'http://192.168.245.153:5000';

export const registerUser = (authData, imageUri) => {
    return async dispatch => {
        const { fullName, email, password } = authData;

        console.log(imageUri);
        
        const formData = new FormData();
        formData.append('fullName', fullName);
        formData.append('email', email);
        formData.append('password', password);

        if (imageUri) {
            const filename = imageUri.split('/').pop();
            const match = /\.(\w+)$/.exec(filename);
            const type = match ? `image/${match[1]}` : `image`;

            formData.append('image', {
                uri: imageUri,
                name: filename,
                type
            });
        }

        try {
            const response = await axios.post(BASE_URL + '/api/users/register', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
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