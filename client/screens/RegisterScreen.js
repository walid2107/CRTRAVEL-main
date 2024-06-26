import React from 'react';
import { StyleSheet, View, Text, ScrollView, KeyboardAvoidingView, TextInput, TouchableOpacity, Image, Dimensions, ActivityIndicator, TouchableWithoutFeedback, Keyboard,Alert } from 'react-native';
import { Formik } from "formik";
import * as Yup from 'yup';
//import for redux
import {useDispatch} from 'react-redux';
import * as authActions from '../redux/actions/authActions';
import * as authAPI from '../redux/API/authAPI'; 
//async storage
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

const registerValidationSchema = Yup.object().shape({
    fullName: Yup.string()
        .required('Full Name is required'),
    email: Yup.string()
        .email("Invalid email address")
        .required('Email is required'),
    password: Yup.string()
        .min(6, 'Password must be at least 6 characters')
        .required('Password is required'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
        .required('Confirm Password is required'),
});

const RegisterScreen = (navigator) => {
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
                                fullName: "",
                                email: "",
                                password: "",
                                confirmPassword: ""
                            }}
                            validationSchema={registerValidationSchema}
                            onSubmit={(values, actions) => {
                                const user={
                                    fullName:values.fullName,
                                    email:values.email,
                                    password:values.password
                                }
                                dispatch(authAPI.registerUser(user))
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
                                            placeholder='Full Name'
                                            placeholderTextColor='#fff'
                                            onChangeText={handleChange('fullName')}
                                            onBlur={handleBlur('fullName')}
                                            value={values.fullName}
                                        />
                                        {errors.fullName && touched.fullName && (
                                            <Text style={Styles.errorText}>{errors.fullName}</Text>
                                        )}
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
                                        <TextInput
                                            style={Styles.input}
                                            placeholder='Confirm Password'
                                            placeholderTextColor='#fff'
                                            secureTextEntry={true}
                                            onChangeText={handleChange('confirmPassword')}
                                            onBlur={handleBlur('confirmPassword')}
                                            value={values.confirmPassword}
                                        />
                                        {errors.confirmPassword && touched.confirmPassword && (
                                            <Text style={Styles.errorText}>{errors.confirmPassword}</Text>
                                        )}
                                        <TouchableOpacity
                                            style={Styles.button}
                                            onPress={handleSubmit}
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? (
                                                <ActivityIndicator color="#fff" />
                                            ) : (
                                                <Text style={Styles.buttonText}>Register</Text>
                                            )}
                                        </TouchableOpacity>
                                        <View style={Styles.loginContainer}>
                                            <Text style={Styles.loginText}>Already have an account?</Text>
                                            <TouchableOpacity onPress={()=> navigator.navigation.navigate('Login')}>
                                                <Text style={Styles.loginButton}>Login</Text>
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
        backgroundColor: '#738289', // Gray color from the logo
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
        backgroundColor: '#3b3b3b', // Darker shade of blue/purple from the logo
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
    loginContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        flexDirection: 'row'
    },
    loginText: {
        color: '#738289', // Gray color from the logo
        fontSize: 16
    },
    loginButton: {
        color: '#00008b', // Dark blue color from the logo
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 5
    }
});

export default RegisterScreen;
