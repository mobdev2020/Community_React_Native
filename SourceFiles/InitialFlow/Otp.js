// 
//import liraries
import React, { Component, useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, TextInput, Image, Keyboard, ImageBackground, Alert, StatusBar, Platform } from 'react-native';


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
import OTPInputView from '@twotalltotems/react-native-otp-input';


// create a component
const Otp = (props) => {

    const [isLoading, setIsLoading] = useState(false)
    const [fcmToken, setFcmToken] = useState('')
    const [txtMobile, setTxtMobile] = useState('')
    const [txtPassword, setTxtPassword] = useState('')
    const [otpCode, setOtpCode] = useState('')
    const [verifyOtpCode, setverifyOtpCode] = useState('')

    const [txtForgotMobile, setTxtForgotMobile] = useState('')
    const [isForgotOpen, setIsForgotOpen] = useState(false)

    useEffect(() => {
        getFCMToken()
        Api_Send_Otp(true)

        return () => setOtpCode('')
    }, [])


    const getFCMToken = async () => {
        try {
            const value = await AsyncStorage.getItem(ConstantKey.FCM_TOKEN)
            if (value !== null) {
                // value previously stored

                setFcmToken(JSON.parse(value))
            }
            else {
                generateFCMToken()
            }
        } catch (e) {
            console.log("Error for FCM: " + e)
        }
    }


    const generateFCMToken = async () => {
        const fcmToken = await messaging().getToken();
        if (fcmToken) {

            storeToken(JSON.stringify(fcmToken))
            console.log("Your Firebase Token is:", fcmToken);

            //   Api_Send_Device_Token(fcmToken)

        } else {
            console.log("Failed", "No token received");
        }
    }

    //Helper Methods
    const storeToken = async (value) => {
        try {
            await AsyncStorage.setItem(ConstantKey.FCM_TOKEN, value)

        } catch (e) {
            // saving error
        }
    }




    const Api_Send_Otp = (isLoad, data) => {
        setIsLoading(isLoad)
        Webservice.post(APIURL.otpSend, {
            mobile_number: props.route?.params?.data?.mobile_number,
        })
            .then(response => {

                if (response == null) {
                    setIsLoading(false)
                }
                // console.log("Api_Send_Otp response : " + JSON.stringify(response));
                setIsLoading(false)

                if (response.data.status == true) {
                    console.log("OTP : ", response.data.data?.otp)
                    setverifyOtpCode(response.data.data?.otp)
                } else {
                    Toast.showWithGravity(response.data.message, Toast.LONG, Toast.CENTER);
                }

            })
            .catch((error) => {

                setIsLoading(false)
                console.log(error)
            })
    }
    const Api_Login = (isLoad) => {

        setIsLoading(isLoad)
        Webservice.post(APIURL.login, {

            mobile_number: props.route?.params?.data?.mobile_number,
            device_type: Platform.OS == "android" ? 1 : 2,
            device_token: fcmToken

        })
            .then(response => {
                console.log("Login response in OTP : ",JSON.stringify(response));
                setIsLoading(false)
                if (response.data.status == true) {

                    if (response.data.data.is_register == true && response.data.data.is_active == 1) {

                        var userData = response.data?.data

                        if(userData.user?.is_created_profile == 1){
                            storeUserData(JSON.stringify(userData))
                        }
                        else{
                            props.navigation.navigate("WelcomeScreen", { data: userData})
                        }

                    }

                } else {
                    Toast.showWithGravity(response.data.message, Toast.LONG, Toast.CENTER);
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
            props.navigation.replace('SelectSchool')
        } catch (e) {
            console.log("Error :", e)
        }
    }


    // Action Methods
    const btnVerifyTap = () => {
        requestAnimationFrame(() => {

            Keyboard.dismiss()

            if (otpCode == '') {
                Toast.showWithGravity("Please enter otp", Toast.LONG, Toast.CENTER);
            }
            else if (otpCode != verifyOtpCode) {
                Toast.showWithGravity("Please enter valid otp", Toast.LONG, Toast.CENTER);
            }
            else {
                if (props.route?.params?.data?.mobile_number != "") {
                    Api_Login(true)
                }
                // else {
                //     props.navigation.navigate("AskBusinessProfile",{body : props.route?.params?.data})
                // }

            }

        })
    }


    // const btnCreateNewTap = () => {
    //     requestAnimationFrame(() => {

    //         props.navigation.replace('Register')

    //     })
    // }


    const btnForgotPasswordTap = () => {
        requestAnimationFrame(() => {
            setIsForgotOpen(true)

        })
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor={Colors.white} barStyle={'dark-content'}/>

        <View style={styles.container}>
            <View style={{ flex: 1, backgroundColor: Colors.white }}>
                <View style={{ justifyContent: 'center', marginHorizontal: 20, marginVertical: 10, }}>
                    <View style={{flexDirection : 'row', alignItems : 'center'}}>
                        <TouchableOpacity onPress={() =>  props.navigation.goBack()}>
                            <Icon name={'chevron-left'} color={Colors.black} size={20}/>
                        </TouchableOpacity>
                    <Text style={{
                        fontSize: FontSize.FS_18,
                        color: Colors.black,
                        fontFamily: ConstantKey.MONTS_SEMIBOLD,
                        marginHorizontal : 20
                    }}>
                        {i18n.t('enterOtp')}
                    </Text>

                    </View>


                    <View style={styles.otpView}>
                        <OTPInputView

                            style={{ height: 50 }}
                            pinCount={6}
                            // code={otpCode} //You can supply this prop or not. The component will be used as a controlled / uncontrolled component respectively.
                            // onCodeChanged={code => { setOtpCode(code) }}
                            autoFocusOnLoad={false}
                            codeInputFieldStyle={styles.borderStyleBase}
                            codeInputHighlightStyle={styles.borderStyleHighLighted}
                            onCodeFilled={(code) => {

                                // optcode = code
                                setOtpCode(code)
                                console.log(`Code is ${code}, you are good to go!`)
                            }}
                        />
                    </View>

                    <TouchableOpacity style={styles.btnLogin}
                        onPress={() => btnVerifyTap()}>
                        <Text style={styles.loginText}>
                            {i18n.t('verify')}
                        </Text>
                    </TouchableOpacity>

                    <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20, }}>

                        {isLoading == false ?
                            <TouchableOpacity style={{ alignSelf: 'center' }}>
                                <Text style={{
                                    textAlign: 'center', fontSize: FontSize.FS_14, color: Colors.grey,
                                    fontFamily: ConstantKey.MONTS_REGULAR
                                }}
                                    onPress={() => Api_Send_Otp(true)}>
                                    {i18n.t('haveNotReceived')}<Text style={{ color: Colors.primary, fontFamily: ConstantKey.MONTS_SEMIBOLD }}>{i18n.t('resend')}</Text>
                                </Text>
                            </TouchableOpacity>
                            : null}

                    </View>
                </View>
            </View>
            {isLoading ?
                <LoadingView />
                : null}
        </View>
        </SafeAreaView>
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white,
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
        marginTop: 10, height: 45, borderRadius: 10, alignItems: 'center', justifyContent: 'center',
        // shadowColor: Colors.primaryRed,
        // shadowOffset: { width: 0, height: 2 },
        // shadowOpacity: 0.4, shadowRadius: 2, elevation: 2
    },
    loginText: {
        fontSize: FontSize.FS_16, color: Colors.white,
        fontFamily: ConstantKey.MONTS_SEMIBOLD
    },
    otpView: {
        alignItems: 'center',
        marginHorizontal: 20,
        marginVertical: 40
    },
    borderStyleBase: {
        height: 50, borderWidth: 1.5, borderColor: Colors.black,
        borderRadius: 4, fontSize: FontSize.FS_16, fontFamily: ConstantKey.MONTS_MEDIUM,
        color: Colors.black,alignItems:"center",justifyContent:"center",alignSelf:"center"

    },
    borderStyleHighLighted: {
        borderColor: Colors.black, fontSize: FontSize.FS_15,
        fontFamily: ConstantKey.MONTS_MEDIUM, color: Colors.persianRed
    },

});

//make this component available to the app
export default Otp;

