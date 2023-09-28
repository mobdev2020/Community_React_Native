//import liraries
import React, { Component, useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, TextInput, Image, Keyboard, ImageBackground, ScrollView, Platform } from 'react-native';


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
import messaging from '@react-native-firebase/messaging';


//Third Party
import Toast from 'react-native-simple-toast';
import Icon from 'react-native-vector-icons/FontAwesome5';
import AsyncStorage from '@react-native-async-storage/async-storage';


// create a component
const AskBusinessProfile = (props) => {

    const [isLoading, setIsLoading] = useState(false)
    const [RegsterData, setRegisterData] = useState(props?.route?.params?.body || "")
    const [acceptTerms, setAcceptTerms] = useState(true)
    const [openPrivacy, setOpenPrivacy] = useState(false)
    const [FcmToken, setFcmToken] = useState("")
    useEffect(() => {
        // console.log("props?.route?.params?.body?.parent_id",props?.route?.params?.body?.parent_id)
        getFCMToken()
    }, [])


    const getFCMToken = async () => {
        try {
            const value = await AsyncStorage.getItem(ConstantKey.FCM_TOKEN)
            if (value !== null) {
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
    const Api_Register = (isLoad) => {
        setIsLoading(isLoad)
        Webservice.post(APIURL.register, {
            first_name: props?.route?.params?.body?.first_name,
            last_name: props?.route?.params?.body?.last_name,
            email_address: props?.route?.params?.body?.email_address,
            mobile_number: props?.route?.params?.body?.mobile_number,
            is_register_business: 0,
            device_type: Platform.OS == "android" ? 1 : 2,
            device_token: FcmToken,
            parent_id: props?.route?.params?.body?.parent_id,
        })
            .then(response => {
                console.log("Register Response : ", response.data)
                if (response == null) {
                    setIsLoading(false)
                }
                setIsLoading(false)

                if (response.data.status == true) {
                    storeUserData(JSON.stringify(response.data.data))
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
            props.navigation.replace('Home')
        } catch (e) {
           console.log("Error :",e)
        }
    }
  
    const btnCreateProfile = () => {
        requestAnimationFrame(() => {
            props.navigation.navigate('BusinessProfile',{body:props?.route?.params?.body, isFrom:"REGISTER" })
        })
    }


    return (
        <View style={styles.container}>
            <View style={{ flex: 1, backgroundColor: Colors.white }}>
                <ScrollView style={{}}>
                    <SafeAreaView style={{ flex: 1, marginVertical: 10, marginHorizontal: 10 }}>
                        {/* <View style={{ flexDirection: "row", alignItems: "center", }}>
                            <TouchableOpacity onPress={() => { props.navigation.goBack() }}
                                style={{ marginBottom: 5, padding: 10 }}>
                                <Icon name={"chevron-left"} size={20} color={Colors.black} />

                            </TouchableOpacity>

                            <Text style={{
                                fontSize: FontSize.FS_26,
                                color: Colors.black,
                                fontFamily: ConstantKey.MONTS_SEMIBOLD,
                            }}>
                                {i18n.t('Register')}
                            </Text>
                         
                        </View> */}
                        <Text style={{
                            fontSize: FontSize.FS_26,
                            color: Colors.black,
                            fontFamily: ConstantKey.MONTS_SEMIBOLD,
                            marginHorizontal: 10
                        }}>
                            {"Do you want to create business profile ?"}
                        </Text>
                        <View style={{ flexDirection: "row", alignItems: "center", marginVertical: 40 }}>
                            <TouchableOpacity onPress={() => { btnCreateProfile() }}
                                style={{ backgroundColor: Colors.primary, borderRadius: 40, padding: 5, marginHorizontal: 10 }}>
                                <Text style={{
                                    fontSize: FontSize.FS_14,
                                    color: Colors.white,
                                    fontFamily: ConstantKey.MONTS_SEMIBOLD,
                                    marginHorizontal: 10
                                }}>
                                    {"Yes"}
                                </Text>

                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => { Api_Register(true) }}
                                style={{ borderColor: Colors.primary, borderWidth: 1, borderRadius: 40, padding: 5, marginHorizontal: 10 }}>
                                <Text style={{
                                    fontSize: FontSize.FS_14,
                                    color: Colors.primary,
                                    fontFamily: ConstantKey.MONTS_SEMIBOLD,
                                    marginHorizontal: 10
                                }}>
                                    {"No"}
                                </Text>

                            </TouchableOpacity>
                        </View>
                    </SafeAreaView>
                </ScrollView>
            </View>

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
    },
    mobileView: {
        marginTop: 10, flexDirection: 'row', backgroundColor: Colors.lightGrey01, borderRadius: 6,
        height: 50, alignItems: 'center'
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
        backgroundColor: Colors.primary,
        marginTop: 48, height: 45, borderRadius: 10, alignItems: 'center', justifyContent: 'center',
    },
    loginText: {
        fontSize: FontSize.FS_16, color: Colors.white,
        fontFamily: ConstantKey.MONTS_SEMIBOLD
    },
});

//make this component available to the app
export default AskBusinessProfile;
