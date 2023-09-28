//import liraries
import React, { Component, useLayoutEffect, useEffect, useState, useRef } from 'react';
import {
    View, Text, StyleSheet, SafeAreaView, Dimensions, TouchableOpacity, FlatList, Platform, Modal, TextInput,
    Linking, Alert, PermissionsAndroid, Image, Keyboard, Switch, Share, ScrollView, StatusBar, 
} from 'react-native';

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
// import Icon from 'react-native-vector-icons/FontAwesome5';
import Icon from 'react-native-vector-icons/FontAwesome5';
import RBSheet from "react-native-raw-bottom-sheet";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackActions } from '@react-navigation/native';
import FastImage from 'react-native-fast-image';
import { navigate } from '../Constants/NavigationService';
import Banner from '../commonComponents/BoxSlider/Banner';
// create a component
const ViewAllCategories = ({navigation}) => {


    const [isLoading, setIsLoading] = useState(true)
    const [CategoryData, setCategoryData] = useState(null)


	useEffect(() => {
		Api_Get_Category(true)
		return () => {

		}
	}, [])
    const Api_Get_Category = (isLoad) => {
		setIsLoading(isLoad)
		Webservice.get(APIURL.GetCategory, {
			mobile_number: 9016089923
		})
			.then(response => {
				// console.log("Get Category Response : ", response.data)

				if (response.data.status == true) {
					setCategoryData(response.data.data)
					setIsLoading(false)
				} else {
					Toast.showWithGravity(response.data.message, Toast.LONG, Toast.CENTER);
					setIsLoading(false)
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


                <View style={{ flexDirection: "row", alignItems: "center",marginHorizontal:10}}>
                    <TouchableOpacity onPress={() => { navigation.goBack() }}
                        style={{ marginRight: 10, padding : 10 }}>
                        <Icon name={"chevron-left"} size={18} color={Colors.black} />

                    </TouchableOpacity>

                    <Text style={{
                        fontSize: FontSize.FS_18,
                        color: Colors.black,
                        fontFamily: ConstantKey.MONTS_SEMIBOLD,
                    }}>
                        {"Categories"}
                    </Text>
                </View>

                <ScrollView style={{}}>
                <View style={{ marginHorizontal: 20, }}>
                    <FlatList
                        // horizontal
                        numColumns={4}
                        style={{ marginTop: 10 }}
                        data={CategoryData}
                        // ItemSeparatorComponent={<View style={{ width: 20, height: 20 }}></View>}
                        renderItem={({ item, index }) => (
                            <View style={{ alignItems: "center",marginBottom:14, flex : 1 }}>
                                <TouchableOpacity onPress={() =>{navigate("SearchScreen",{isSearch : false,category:item})}}
                                style={{
                                    backgroundColor: Colors.primaryLight,
                                    width: ConstantKey.SCREEN_WIDTH/6,
                                    height: ConstantKey.SCREEN_WIDTH/6,
                                    borderRadius: ConstantKey.SCREEN_WIDTH/6,
                                    padding: 15,
                                    alignItems: "center",
                                    justifyContent: "center",
                                    marginHorizontal:10,
                                    marginBottom:4
                                }}>

                                    <FastImage style={{ resizeMode: 'contain', width: ConstantKey.SCREEN_WIDTH/12, height: ConstantKey.SCREEN_WIDTH/12 }}
                                        source={{uri :item.image_url}}
                                    />

                                </TouchableOpacity>
                                <Text style={{
                                    fontSize: FontSize.FS_14,
                                    color: Colors.black,
                                    fontFamily: ConstantKey.MONTS_MEDIUM,
                                    marginTop : 4
                                }}>
                                   {item?.name}
                                </Text>
                            </View>

                        )}
                    />
                </View>

            </ScrollView>
            {isLoading ? <LoadingView /> : null}
        </SafeAreaView >
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white,
    },
    mapStyle: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    calloutTitle: {
        fontSize: FontSize.FS_15,
        fontFamily: ConstantKey.MONTS_SEMIBOLD,
        color: Colors.primaryRed
    },
    calloutbusinessname: {
        fontSize: FontSize.FS_14,
        fontFamily: ConstantKey.MONTS_REGULAR,
        color: Colors.black,
    },
    calloutDescription: {
        marginTop: 5,
        fontSize: FontSize.FS_14,
        fontFamily: ConstantKey.MONTS_REGULAR,
        color: Colors.darkGrey,
        flex: 1
    },

    grediant: {
        margin: 20,
        // padding: 5,
        height: 44,
        // // flex:1,
        // width: 300,
        // justifyContent: 'center',
        alignSelf: 'center'
    },
    buttonContainer: {
        flex: 1.0,
        alignSelf: 'center',
        justifyContent: 'center',
        backgroundColor: '#ffffff',
        width: '99%',
        margin: 1,
        paddingHorizontal: 50
    },
    buttonText: {
        textAlign: 'center',
        color: '#4C64FF',
        alignSelf: 'center',
    },
    mobileView: {
        marginTop: 10, flexDirection: 'row', borderRadius: 6, backgroundColor: Colors.lightGrey01, borderWidth: 1, borderColor: Colors.primary,
        height: 44, alignItems: 'center', backgroundColor: Colors.lightGrey01,
    },

    textInputMobile: {
        marginLeft: 10, marginRight: 10, height: 50, flex: 1, fontSize: FontSize.FS_14, fontFamily: ConstantKey.MONTS_REGULAR,
        color: Colors.black,
    },
});
export default ViewAllCategories;
