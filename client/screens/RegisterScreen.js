import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, KeyboardAvoidingView, TextInput, TouchableOpacity, Image, Dimensions, ActivityIndicator, TouchableWithoutFeedback, Keyboard, Alert } from 'react-native';
import { Formik } from "formik";
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import * as authAPI from '../redux/API/authAPI';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';

const { width, height } = Dimensions.get('window');

const registerValidationSchema = Yup.object().shape({
    fullName: Yup.string().required('Full Name is required'),
    email: Yup.string().email("Invalid email address").required('Email is required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
    confirmPassword: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match').required('Confirm Password is required'),
});

const RegisterScreen = ({ navigation }) => {
    const dispatch = useDispatch();
    const [image, setImage] = useState(null);

    const pickImage = async () => {
        let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permissionResult.granted === false) {
          alert("Permission to access camera roll is required!");
          return;
        }
    
        let pickerResult = await ImagePicker.launchImageLibraryAsync({
          allowsEditing: true,
          aspect: [4, 3],
        });
    
        if (!pickerResult.cancelled) {
          setImage(pickerResult.assets[0].uri);
        }
    };

    return (
        <KeyboardAvoidingView behavior='padding' style={{ flex: 1 }}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.container}>
                        <Formik
                            initialValues={{ fullName: "", email: "", password: "", confirmPassword: "" }}
                            validationSchema={registerValidationSchema}
                            onSubmit={(values, actions) => {
                                const user = {
                                    fullName: values.fullName,
                                    email: values.email,
                                    password: values.password
                                };
                               
                                dispatch(authAPI.registerUser(user, image))
                                    .then(async (result) => {
                                        if (result.success) {
                                            try {
                                                await AsyncStorage.setItem('token', result.token);
                                            } catch (e) {
                                                console.log(e);
                                            }
                                            actions.setSubmitting(false);
                                            navigation.navigate("Main");
                                        } else {
                                        
                                            Alert.alert(result.errors[0].msg);
                                            actions.setSubmitting(false);
                                        }
                                    })
                                    .catch((err) => {
                                       
                                        Alert.alert(err.data.errors[0].msg);
                                        actions.setSubmitting(false);
                                    });
                            }}
                        >
                            {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isSubmitting }) => (
                                <View style={styles.formContainer}>
                                <View style={styles.logo}>
                                  <Image style={styles.imageLogo} source={require('../assets/images/app-logo.png')} />
                                 </View>
                                {image && (
                                <View style={styles.imageContainer}>
                                   <Image source={{ uri: image }} style={styles.image} />
                                </View>
                                 )}

                                <TouchableOpacity onPress={pickImage} style={styles.imagePickerButton}>
                                <Text style={styles.imagePickerText}>Select profile image</Text>
                               </TouchableOpacity>
                                    <View style={styles.form}>
                                        <TextInput
                                            style={styles.input}
                                            placeholder='Full Name'
                                            placeholderTextColor='#fff'
                                            onChangeText={handleChange('fullName')}
                                            onBlur={handleBlur('fullName')}
                                            value={values.fullName}
                                        />
                                        {errors.fullName && touched.fullName && (
                                            <Text style={styles.errorText}>{errors.fullName}</Text>
                                        )}
                                        <TextInput
                                            style={styles.input}
                                            placeholder='Email'
                                            placeholderTextColor='#fff'
                                            keyboardType='email-address'
                                            onChangeText={handleChange('email')}
                                            onBlur={handleBlur('email')}
                                            value={values.email}
                                        />
                                        {errors.email && touched.email && (
                                            <Text style={styles.errorText}>{errors.email}</Text>
                                        )}
                                        <TextInput
                                            style={styles.input}
                                            placeholder='Password'
                                            placeholderTextColor='#fff'
                                            secureTextEntry={true}
                                            onChangeText={handleChange('password')}
                                            onBlur={handleBlur('password')}
                                            value={values.password}
                                        />
                                        {errors.password && touched.password && (
                                            <Text style={styles.errorText}>{errors.password}</Text>
                                        )}
                                        <TextInput
                                            style={styles.input}
                                            placeholder='Confirm Password'
                                            placeholderTextColor='#fff'
                                            secureTextEntry={true}
                                            onChangeText={handleChange('confirmPassword')}
                                            onBlur={handleBlur('confirmPassword')}
                                            value={values.confirmPassword}
                                        />
                                        {errors.confirmPassword && touched.confirmPassword && (
                                            <Text style={styles.errorText}>{errors.confirmPassword}</Text>
                                        )}
                                        <TouchableOpacity
                                            style={styles.button}
                                            onPress={handleSubmit}
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? (
                                                <ActivityIndicator color="#fff" />
                                            ) : (
                                                <Text style={styles.buttonText}>Register</Text>
                                            )}
                                        </TouchableOpacity>
                                        <View style={styles.loginContainer}>
                                            <Text style={styles.loginText}>Already have an account?</Text>
                                            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                                                <Text style={styles.loginButton}>Login</Text>
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
};

const styles = StyleSheet.create({
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
    imageLogo: {
        width: 70,
        height: 70
    },
    formContainer: {
        width: '100%',
        alignItems: 'center',
    },
    imagePicker: {
        width: '95%',
        height: 150,
        backgroundColor: '#738289',
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20
    },
    selectedImage: {
        width: '100%',
        height: '100%',
        borderRadius: 25,
    },
    imagePickerText: {
        color: '#fff',
        fontSize: 16,
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
    loginContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        flexDirection: 'row'
    },
    loginText: {
        color: '#738289',
        fontSize: 16
    },
    loginButton: {
        color: '#00008b',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 5
    },
    imageContainer: {
        alignItems: 'center',
        marginBottom: 20,
      },
      image: {
        width: 200,
        height: 200,
        borderRadius: 10,
        resizeMode: 'cover',
      },
      imagePickerButton: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#00A9F4',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
      },
      imagePickerText: {
        color: 'white',
        fontSize: 16,
      }
});

export default RegisterScreen;
