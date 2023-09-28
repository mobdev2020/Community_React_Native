//import liraries
import React, { Component, useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, TextInput, Image, Keyboard, ImageBackground, Alert, Dimensions, BackHandler, StatusBar } from 'react-native';


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
import { useFocusEffect } from '@react-navigation/native';
import Pdf from 'react-native-pdf';
import { CameraScreen, Camera } from 'react-native-camera-kit';
import { navigate } from '../Constants/NavigationService';

// create a component
const QrCode = (props) => {

    const [isLoading, setIsLoading] = useState(false)
    const [SchoolInfo, setSchoolInfo] = useState(null)
    const [opneScanner, setOpneScanner] = useState(false)


    useEffect(() => {
            setOpneScanner(true)
      }, []);

  useEffect(() => {
    const backAction = () => {
        setOpneScanner(true)
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

    const Api_Get_School_Info = (isLoad) => {
        setIsLoading(isLoad)
        Webservice.get(APIURL.SchoolInfo)
            .then(response => {
                setIsLoading(false)
                // console.log(JSON.stringify("Api_Get_School_Info Response : " + JSON.stringify(response)));
                if (response.data.status == true) {
                    console.log("response.data?.about_us_url", response.data?.data?.about_us_url)
                    setSchoolInfo(response.data?.data?.about_us_url)
                } else {
                    alert(response.data.message)
                }
            })
            .catch((error) => {
                setIsLoading(false)
                console.log(error)
            })
    }



    return (
        <View style={{ flex: 1, flexDirection: 'column', backgroundColor: 'transparent' }}>
            <StatusBar backgroundColor={Colors.white} barStyle={'dark-content'}/>

            {/* <Text style={{
                    fontSize: FontSize.FS_22,
                    color: Colors.black,
                    fontFamily: ConstantKey.MONTS_SEMIBOLD,
                    marginVertical:15,
                    marginHorizontal:20,
                }}>
                    {"Qr Code"}
                </Text> */}
            {opneScanner ?
            <View style={{ flex: 1 }}>

                <CameraScreen
                    scanBarcode={true}
                    onReadCode={(val) => {
                        console.log("val", val.nativeEvent.codeStringValue)
                        var schoolId = val.nativeEvent.codeStringValue
                        setOpneScanner(false)
                        if (schoolId !== "") {
                            navigate("Register", { school_id: schoolId })

                        }
                    }}
                    showFrame={true} // (default false) optional, show frame with transparent layer (qr code or barcode will be read on this area ONLY), start animation for scanner,that stoped when find any code. Frame always at center of the screen
                    laserColor={Colors.primary} // (default red) optional, color of laser in scanner frame
                    frameColor={Colors.white} // (default white) optional, color of border of scanner frame
                />
                <Text 
                // onPress={() =>{
                //     navigate("Register", { school_id: 5 })
                // }}
                 style={{
                    position: "absolute",
                    fontSize: FontSize.FS_24,
                    color: Colors.white,
                    fontFamily: ConstantKey.MONTS_SEMIBOLD,
                    margin: 20,
                    textAlign:"center",
                    alignSelf:"center",
                    lineHeight: FontSize.FS_30,
                }}>
                    {"Scan QRCode & Join \n School Community "}
                </Text>
            </View>
            : null }
            {/* } */}
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
});

export default QrCode;
