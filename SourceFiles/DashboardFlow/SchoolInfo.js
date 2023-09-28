//import liraries
import React, { Component, useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, TextInput, Image, Keyboard, ImageBackground, Alert, Dimensions, StatusBar } from 'react-native';


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


// create a component
const SchoolInfo = (props) => {

    const [isLoading, setIsLoading] = useState(false)
    const [SchoolInfo, setSchoolInfo] = useState(null)
    const [LoadPercent, setLoadPercent] = useState(0)



    useFocusEffect(
        useCallback(() => {
            Api_Get_School_Info(true)
            return () => {

            }
        }, [])
    );

    const Api_Get_School_Info = (isLoad) => {
        setIsLoading(isLoad)
        Webservice.get(APIURL.SchoolInfo)
            .then(response => {
                setIsLoading(false)
                // console.log(JSON.stringify("Api_Get_School_Info Response : " + JSON.stringify(response)));
                if (response.data.status == true) {
                    console.log("response.data?.about_us_url",response.data?.data?.about_us_url)
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
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor={Colors.white} barStyle={'dark-content'}/>

        <View style={styles.container}>
                <Text style={{
                    fontSize: FontSize.FS_18,
                    color: Colors.black,
                    fontFamily: ConstantKey.MONTS_SEMIBOLD,
                    marginVertical:15,
                    marginHorizontal:20,
                }}>
                    {i18n.t('aboutSchoolInfo')}
                </Text>
                {console.log("SchoolInfo :",SchoolInfo)}
                {SchoolInfo != null ?
                    <Pdf
                    trustAllCerts={false}
                        source={{ uri: SchoolInfo, cache: true }}
                        onLoadComplete={(numberOfPages, filePath) => {
                            console.log(`Number of pages: ${numberOfPages}`);
                        }}
                        onPageChanged={(page, numberOfPages) => {
                            console.log(`Current page: ${page}`);
                        }}
                        onError={(error) => {
                            console.log(error);
                        }}
                        onLoadProgress={(percent) => {
                        	setLoadPercent(percent)
                        }}
                        renderActivityIndicator={() => (
                        	<>
                        		{LoadPercent > 0 && (
                        			<Text style={{fontSize : FontSize.FS_16, color : Colors.black, fontFamily : ConstantKey.MONTS_REGULAR}}>
                        				{`${(Math.round(LoadPercent * 10000) / 100).toFixed(2)} %`}
                        			</Text>
                        		)}
                        	</>
                        )}
                        onPressLink={(uri) => {
                            console.log(`Link pressed: ${uri}`);
                        }}
                        style={{ flex:1,  backgroundColor: Colors.white,
                            width:Dimensions.get('window').width,
                            height:Dimensions.get('window').height, }} />
                         :null    }
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
});

export default SchoolInfo;
