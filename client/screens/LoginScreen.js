import React from 'react';
import { StyleSheet, View, Text, ScrollView, KeyboardAvoidingView, TextInput, TouchableOpacity, Image, Dimensions, ActivityIndicator, TouchableWithoutFeedback, Keyboard, Alert } from 'react-native';
import { Formik } from "formik";
import * as Yup from 'yup';
//import for redux
import {useDispatch} from 'react-redux';
import * as authActions from '../redux/actions/authActions';
import * as authAPI from '../redux/API/authAPI'; 
//async storage
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

const loginValidationSchema = Yup.object().shape({
    email: Yup.string()
        .email("Invalid email address")
        .required('Email is required'),
    password: Yup.string()
        .min(6, 'Password must be at least 6 characters')
        .required('Password is required'),
});

const LoginScreen = (navigator) => {
    const dispatch=useDispatch();
    return (
        <KeyboardAvoidingView
            behavior='padding'
            style={{ flex: 1 }}
        >
            <ScrollView contentContainerStyle={Styles.scrollContainer}>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={Styles.container}>
                        <Formik
                            initialValues={{
                                email: "",
                                password: ""
                            }}
                            validationSchema={loginValidationSchema}
                            onSubmit={(values, actions) => {
                                dispatch(authAPI.loginUser(values))
                                .then(async (result) => {                                 
                                    if(result.success){
                                        try {
                                            await AsyncStorage.setItem('token', result.token);
                                          } catch (e) {
                                            console.log(e);
                                          }
                                        actions.setSubmitting(false);
                                        navigator.navigation.navigate("Main");
                                       
                                    } else{
                                        actions.setSubmitting(false);
                                        Alert.alert(result.errors[0].message);
                                    }
                                    
                                }).catch((err) => {
                                    console.log(err);
                                });
                            }}
                        >
                            {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isSubmitting }) => (
                                <View style={Styles.formContainer}>
                                    <View style={Styles.logo}>
                                        <Image style={Styles.image} source={require('../assets/images/app-logo.png')} />
                                    </View>
                                    <View style={Styles.form}>
                                        <TextInput
                                            style={Styles.input}
                                            placeholder='Email'
                                            placeholderTextColor='#fff'
                                            keyboardType='email-address'
                                            onChangeText={handleChange('email')}
                                            onBlur={handleBlur('email')}
                                            value={values.email}
                                        />
                                        {errors.email && touched.email && (
                                            <Text style={Styles.errorText}>{errors.email}</Text>
                                        )}
                                        <TextInput
                                            style={Styles.input}
                                            placeholder='Password'
                                            placeholderTextColor='#fff'
                                            secureTextEntry={true}
                                            onChangeText={handleChange('password')}
                                            onBlur={handleBlur('password')}
                                            value={values.password}
                                        />
                                        {errors.password && touched.password && (
                                            <Text style={Styles.errorText}>{errors.password}</Text>
                                        )}
                                        <TouchableOpacity
                                            style={Styles.button}
                                            onPress={handleSubmit}
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? (
                                                <ActivityIndicator color="#fff" />
                                            ) : (
                                                <Text style={Styles.buttonText}>Login</Text>
                                            )}
                                        </TouchableOpacity>
                                        <View style={Styles.registerContainer}>
                                            <Text style={Styles.registerText}>Don't have an account?</Text>
                                            <TouchableOpacity onPress={()=>navigator.navigation.navigate('Register')}>
                                                <Text style={Styles.registerButton}>Register</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            )}
                        </Formik>
                    </View>
                </TouchableWithoutFeedback>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const Styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingHorizontal: 20,
        paddingVertical: 40,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
        minHeight: height
    },
    logo: {
        alignItems: 'center',
        marginBottom: 40
    },
    image: {
        width: 70,
        height: 70
    },
    formContainer: {
        width: '100%',
        alignItems: 'center',
    },
    form: {
        width: '95%',
        alignItems: 'center',
    },
    input: {
        width: '95%',
        backgroundColor: '#738289', 
        borderRadius: 25,
        padding: 16,
        fontSize: 16,
        marginVertical: 10,
        color: '#fff'
    },
    errorText: {
        color: 'red',
        fontSize: 14,
        marginBottom: 10,
        alignSelf: 'flex-start'
    },
    button: {
        width: '95%',
        backgroundColor: '#3b3b3b', 
        borderRadius: 25,
        marginVertical: 10,
        paddingVertical: 15,
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '500',
        color: '#ffffff',
    },
    registerContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        flexDirection: 'row'
    },
    registerText: {
        color: '#738289', 
        fontSize: 16
    },
    registerButton: {
        color: '#00008b', 
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 5
    }
});

export default LoginScreen;
