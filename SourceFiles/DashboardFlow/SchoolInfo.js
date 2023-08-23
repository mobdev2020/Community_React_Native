//import liraries
import React, { Component, useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, TextInput, Image, Keyboard, ImageBackground, Alert } from 'react-native';


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
import ForgotPasswordModal from '../DashboardFlow/ForgotPasswordModal';


// create a component
const SchoolInfo = (props) => {

    const [isLoading, setIsLoading] = useState(false)



    return (
        <View style={styles.container}>
            <View style={{ flex: 1, backgroundColor: Colors.white }}>
                <View style={{ justifyContent: 'center', margin: 20,  }}>
                    <Text style={{
                        fontSize: FontSize.FS_18,
                        color: Colors.black,
                        fontFamily: ConstantKey.MONTS_SEMIBOLD,
                    }}>
                        {i18n.t('aboutSchoolInfo')}
                    </Text>


                </View>
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
        marginTop: 10, flexDirection: 'row', borderRadius: 10, backgroundColor: Colors.white,
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
        backgroundColor: Colors.primary,
        marginTop: 48, height: 45, borderRadius: 10, alignItems: 'center', justifyContent: 'center',
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
export default SchoolInfo;
