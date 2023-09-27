//import liraries
import React, { Component, useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, TextInput, Image, Keyboard, ImageBackground, Alert, Platform, PermissionsAndroid } from 'react-native';


// Constants
import i18n from '../Localize/i18n'
import { ConstantKey } from '../Constants/ConstantKey'
import { Colors } from '../Constants/Colors';
import { Images } from '../Constants/Images';
import { FontSize } from '../Constants/FontSize';
import Webservice from '../Constants/API'
import LoadingView from '../Constants/LoadingView'
import { APIURL } from '../Constants/APIURL';
import { version as versionNo } from '../../package.json'


//Third Party
import Toast from 'react-native-simple-toast';
import Icon from 'react-native-vector-icons/FontAwesome5';
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import FastImage from 'react-native-fast-image';


// create a component
const WelcomeScreen = (props) => {

    const [isLoading, setIsLoading] = useState(false)
    const [fcmToken, setFcmToken] = useState('')
    const [txtMobile, setTxtMobile] = useState(props?.route?.params?.data?.mobile_number || '')
    const [txtPassword, setTxtPassword] = useState('')

    const [txtForgotMobile, setTxtForgotMobile] = useState('')
    const [isForgotOpen, setIsForgotOpen] = useState(false)

    useEffect(() => {
        console.log("DD :",props.route.params.data?.user?.school_data?.title)
    }, [])




    const Api_Login = (isLoad) => {

        setIsLoading(isLoad)

        Webservice.post(APIURL.login, {

            mobile_number: txtMobile,
            device_type: Platform.OS == "android" ? 1 : 2,
            device_token: fcmToken

        })
            .then(response => {
                // console.log("Login response : ", JSON.stringify(response));
                setIsLoading(false)

                if (response.data.status == true) {

                    if (response.data.data.is_register == true && response.data.data.is_active == 1) {
                        var dict = {};
                        dict.mobile_number = txtMobile
                        dict.isFrom = "LOGIN"
                        props.navigation.navigate("Otp", { data: dict })
                    }
                    // storeUserData(JSON.stringify(response.data.Data[0]))

                } else {
                    Toast.showWithGravity(response.data.message, Toast.LONG, Toast.BOTTOM);
                    // var dict = {};
                    // dict.mobile_number = txtMobile
                    // props.navigation.navigate("Register",{data : dict})
                }

            })
            .catch((error) => {

                setIsLoading(false)
                console.log(error)
            })
    }


    const storeUserData = async (value) => {
        try {
            await AsyncStorage.setItem(ConstantKey.USER_DATA, value)
            // props.navigation.replace('Home')
            props.navigation.replace('Otp')
        } catch (e) {
            // saving error
        }
    }




    return (
        <View style={styles.container}>
            <View style={{ alignItems: "center" }}>
                <Text style={{
                    fontSize: FontSize.FS_26,
                    color: Colors.black,
                    fontFamily: ConstantKey.MONTS_SEMIBOLD,
                    marginBottom: 20
                }}>
                    {"Welcome!"}
                </Text>
                <FastImage style={{ width: 100, height: 100 }} source={{uri : props?.route?.params?.data?.user?.school_data?.logo_url}} />
                <Text style={{
                    fontSize: FontSize.FS_20,
                    color: Colors.black,
                    fontFamily: ConstantKey.MONTS_MEDIUM,
                    marginTop: 26
                }}>{props?.route?.params?.data?.user?.school_data?.title}</Text>





            </View>
            <TouchableOpacity style={styles.btnLogin}
                onPress={() => {
                    var dict = {};
                    dict.mobile_number = txtMobile
                    props.navigation.navigate("Register", { data: props?.route?.params?.data })
                }}>
                <Text style={styles.loginText}>
                    {"Create Profile"}
                </Text>
                {/* <Icon name={"chevron-right"} size={20} color={Colors.white}  /> */}
            </TouchableOpacity>
            {isLoading ?
                <LoadingView />
                : null}
        </View>
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white,
        justifyContent: "center",
        // alignItems:"center",
        // alignSelf:"center"
    },
    mobileView: {
        marginTop: 10, flexDirection: 'row', borderRadius: 6, backgroundColor: Colors.white,
        height: 50, alignItems: 'center', backgroundColor: Colors.lightGrey01
    },
    countryCodeText: {
        marginLeft: 10, fontSize: FontSize.FS_16, fontFamily: ConstantKey.MONTS_REGULAR,
        color: Colors.black
    },
    textInputMobile: {
        marginLeft: 10, marginRight: 10, height: 50, flex: 1, fontSize: FontSize.FS_16, fontFamily: ConstantKey.MONTS_REGULAR,
        color: Colors.black,
    },
    btnLogin: {
        backgroundColor: Colors.black,
        marginTop: 48,
        height: 50,
        borderRadius: 6,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 25
        // shadowColor: Colors.primaryRed,
        // shadowOffset: { width: 0, height: 2 },
        // shadowOpacity: 0.4, shadowRadius: 2, elevation: 2
    },
    loginText: {
        fontSize: FontSize.FS_18, color: Colors.white,
        fontFamily: ConstantKey.MONTS_SEMIBOLD
    },
});

//make this component available to the app
export default WelcomeScreen;
