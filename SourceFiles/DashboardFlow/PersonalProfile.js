//import liraries
import React, { Component, useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, TextInput, Image, Keyboard, ImageBackground, ScrollView, Alert, StatusBar } from 'react-native';


// Constants
import i18n from '../Localize/i18n'
import { ConstantKey } from '../Constants/ConstantKey'
import { Colors } from '../Constants/Colors';
import { Images } from '../Constants/Images';
import { FontSize } from '../Constants/FontSize';
import Webservice from '../Constants/API'
import LoadingView from '../Constants/LoadingView'
import { APIURL } from '../Constants/APIURL';
//Third Party
import Toast from 'react-native-simple-toast';
import Icon from 'react-native-vector-icons/FontAwesome5';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FastImage from 'react-native-fast-image';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ImagePicker from 'react-native-image-crop-picker';
const PersonalProfile = ({ navigation }) => {

    const [isLoading, setIsLoading] = useState(false)
    const [FirstName, setFirstName] = useState('')
    const [LastName, setLastName] = useState('')
    const [PhoneNumber, setPhoneNumber] = useState("")
    const [SubCategory, setSubCategory] = useState('')
    const [BusinessPhone, setBusinessPhone] = useState('')
    const [Email, setEmail] = useState('')
    const [ProfileImg, setProfileImg] = useState(null)
    const [Address, setAddress] = useState('')
    const [isUpdateImage, setIsUpdateImage] = useState(false)
    const [UserData, setUserData] = useState(null);

	const [description, setDescription] = useState('')


    useEffect(() => {
        Api_Get_Profile(true)
        return () => {

        }
    }, [])


    const Api_Get_Profile = (isLoad) => {
        setIsLoading(isLoad)
        Webservice.get(APIURL.GetProfile)
            .then(response => {
                setIsLoading(false)
                console.log("Api_Get_Profile Response : " + JSON.stringify(response))
                if (response.data.status == true) {
                    var data = response.data.data
                    setUserData(response.data.data)
                    setEmail(response.data.data.user.email)
                    setFirstName(response.data.data.user.first_name)
                    setLastName(response.data.data.user.last_name)
                    setPhoneNumber(response.data.data.user.phone)
                    setDescription(response.data.data.user.kids_information)
                    setUserData(response.data.data)
                } else {
                    alert(response.data.message)
                }
            })
            .catch((error) => {
                setIsLoading(false)
                console.log(error)
            })
    }
    const Api_Update_Profile = (isLoad) => {
        setIsLoading(isLoad)
        let body = new FormData();
        body.append('first_name', FirstName)
        body.append('last_name', LastName)
        body.append('email', Email)
        body.append('kids_information', description)
        if (ProfileImg != null && ProfileImg.data != null) {
            body.append('avatar',
                {
                    uri: ProfileImg.path,
                    name: Platform.OS == 'android' ? "image.jpeg" : ProfileImg.filename,
                    type: ProfileImg.mime
                });
        }
        Webservice.post(APIURL.UpdateProfile,body)
            .then(response => {
                setIsLoading(false)
                console.log(JSON.stringify("Api_Update_Profile Response : " + JSON.stringify(response)));
                if (response.data.status == true) {
                    Toast.showWithGravity(response.data.message, Toast.SHORT, Toast.CENTER);
                    navigation.goBack()
                } else {
                    alert(response.data.message)
                }
            })
            .catch((error) => {
                setIsLoading(false)
                console.log(error)
            })
    }
    const storeData = async (value) => {
        try {
            await AsyncStorage.setItem(ConstantKey.USER_DATA, value)
        } catch (e) {
            console.log("Error :", e)
        }
    }

    const btnBusinessProfile = (params) => {

            Keyboard.dismiss()
			if (FirstName == '') {
				Toast.showWithGravity(i18n.t('enterFName'), Toast.LONG, Toast.CENTER);
			}
			else if (LastName == '') {
				Toast.showWithGravity(i18n.t('enterLName'), Toast.LONG, Toast.CENTER);
			}
			else if (PhoneNumber == '') {
				Toast.showWithGravity(i18n.t('enterMobileNumber'), Toast.LONG, Toast.CENTER);
			}
			else if (PhoneNumber.length < 10) {
				Toast.showWithGravity(i18n.t('validMobile'), Toast.LONG, Toast.CENTER);
			}else{
                Api_Update_Profile(true)

            }
    }
    const btnSelectImage = () => {

        Alert.alert(
            "",
            'Choose your Suitable Option',
            [
                {
                    text: 'Camera', onPress: () => {

                        setIsLoading(true)

                        ImagePicker.openCamera({
                            width: ConstantKey.SCREEN_WIDTH,
                            height: ConstantKey.SCREEN_WIDTH,
                            cropping: true,
                            multiple: false,
                            mediaType: 'photo',
                            includeBase64: true,
                            multipleShot: false,
                            compressImageQuality: 0.6
                        }).then(images => {

                            console.log(images);

                            setIsUpdateImage(true)
                            setIsLoading(false)
                            setProfileImg(images)

                        }).catch((error) => {

                            setIsUpdateImage(false)
                            setIsLoading(false)

                            console.log(error)
                        });

                    }
                },
                {
                    text: 'Gallary',
                    onPress: () => {

                        setIsLoading(true)

                        ImagePicker.openPicker({
                            multiple: false,
                            freeStyleCropEnabled: true,
                            cropping: true,
                            mediaType: 'photo',
                            includeBase64: true,
                            compressImageQuality: 0.6
                        }).then(images => {

                            console.log(images);

                            setIsLoading(false)
                            setIsUpdateImage(true)
                            setProfileImg(images)

                        }).catch((error) => {
                            setIsUpdateImage(false)
                            setIsLoading(false)

                            console.log(error)
                        });
                    }
                },
                {
                    text: 'Cancel',
                    style: 'destructive'
                },
            ],
            // { cancelable: true }
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor={Colors.white} barStyle={'dark-content'}/>

        <View style={styles.container}>
            <View style={{ flex: 1, backgroundColor: Colors.white }}>

            <View style={{ flexDirection: "row", alignItems: "center", marginHorizontal : 10 }}>
                            <TouchableOpacity onPress={() => { navigation.goBack() }}
                                style={{ marginRight: 10, padding: 10 }}>
                                <Icon name={"chevron-left"} size={20} color={Colors.black} />

                            </TouchableOpacity>

                            <Text style={{
                                fontSize: FontSize.FS_18,
                                color: Colors.black,
                                fontFamily: ConstantKey.MONTS_SEMIBOLD,
                            }}>
                                {i18n.t('PersonalProfile')}
                            </Text>

                        </View>
                <ScrollView style={{}}>
                        
                        <View style={{ marginHorizontal: 20 }}>
                            {/* <View style={{
                                marginLeft: 20, marginRight: 20, marginTop: 30, width: ConstantKey.SCREEN_WIDTH / 3, height: ConstantKey.SCREEN_WIDTH / 3,
                                borderWidth: 1, borderRadius: (ConstantKey.SCREEN_WIDTH / 3) / 2, borderColor: Colors.primaryRed, alignSelf: 'center'
                            }}> */}

                            <View style={{ width: 100, height: 100, borderRadius: 60, alignItems: "center", justifyContent: "center", 
                                marginTop: 20 }}>
                                <FastImage style={{ width: 96, height: 96, borderRadius: 60, }}
                                    source={{ uri: ProfileImg == null ? UserData?.user?.avatar_url :ProfileImg.path }}
                                // resizeMode='contain'
                                />
                                <TouchableOpacity onPress={() => btnSelectImage()} style={{ width: 30, height: 30, borderRadius: 20, backgroundColor: Colors.primary, position: "absolute", right: 0, bottom: 0, alignItems: "center", justifyContent: "center" }}>
                                    <MaterialCommunityIcons name={"pencil"} size={18} color={Colors.white} />
                                </TouchableOpacity>
                            </View>
                            <Text style={{marginTop : 5,
						fontSize: FontSize.FS_10, color: Colors.grey, fontFamily: ConstantKey.MONTS_REGULAR, }}>
							Prefered image size is 250px * 250px
						</Text>

                            <Text style={{
                                fontSize: FontSize.FS_14,
                                color: Colors.black,
                                fontFamily: ConstantKey.MONTS_MEDIUM,
                                marginTop: 20,
                                lineHeight: FontSize.FS_20,
                            }}>
                                {"First Name"}
                            </Text>
                            <View style={styles.mobileView}>
                                <TextInput style={styles.textInputMobile}
                                    value={FirstName}
                                    placeholder={i18n.t('enterFirstName')}
                                    returnKeyType={'done'}
                                    onChangeText={(txtname) => setFirstName(txtname.replace(/[^A-Za-z\s]/ig, ''))}
                                />
                            </View>
                            <Text style={{
                                fontSize: FontSize.FS_14,
                                color: Colors.black,
                                fontFamily: ConstantKey.MONTS_MEDIUM,
                                marginTop: 10,
                                lineHeight: FontSize.FS_20,
                            }}>
                                {"Last Name"}
                            </Text>
                            <View style={styles.mobileView}>
                                <TextInput style={styles.textInputMobile}
                                    value={LastName}
                                    placeholder={i18n.t('enterLastName')}
                                    returnKeyType={'done'}
                                    onChangeText={(txtname) => setLastName(txtname.replace(/[^A-Za-z\s]/ig, ''))}
                                />
                            </View>
                            <Text style={{
                                
                                fontSize: FontSize.FS_14,
                                color: Colors.black,
                                fontFamily: ConstantKey.MONTS_MEDIUM,
                                marginTop: 20,
                                lineHeight: FontSize.FS_20,
                            }}>
                                {i18n.t('phoneNumber')}
                            </Text>
                            <View style={styles.mobileView}>
                                <TextInput style={[styles.textInputMobile,{color:Colors.lightGrey}]}
                                    value={PhoneNumber}
                                    placeholder={i18n.t('SelectCategory')}
                                    returnKeyType={'done'}
                                    onChangeText={(txtname) => setPhoneNumber(txtname)}
                                    editable={false}
                                />
                            </View>


                            <Text style={{
                                fontSize: FontSize.FS_14,
                                color: Colors.black,
                                fontFamily: ConstantKey.MONTS_MEDIUM,
                                marginTop: 20,
                                lineHeight: FontSize.FS_20,
                            }}>
                                {i18n.t('email')}
                            </Text>
                            
                            <View style={styles.mobileView}>
                                <TextInput style={styles.textInputMobile}
                                    value={Email}
                                    autoCapitalize={'none'}
                                    placeholder={i18n.t('enterEmailAddress')}
                                    returnKeyType={'done'}
                                    onChangeText={(txt) => setEmail(txt)}
                                />
                            </View>

                            <Text style={{
                                fontSize: FontSize.FS_14,
                                color: Colors.black,
                                fontFamily: ConstantKey.MONTS_MEDIUM,
                                marginTop: 20,
                                lineHeight: FontSize.FS_20,
                            }}>
                                Kids Information
                            </Text>
                            <View style={{
								marginTop: 10, backgroundColor: Colors.lightGrey01, borderRadius: 6,
								height: 120,
							}}>
								{/* <Icon name={"at"} size={18} color={Colors.primary} style={{ marginLeft: 10 }} /> */}
								<TextInput style={{
									marginLeft: 10, marginRight: 10, height: 120, flex: 1, fontSize: FontSize.FS_14, fontFamily: ConstantKey.MONTS_REGULAR,
									color: Colors.dimGray, alignContent: "flex-start"
								}}
									multiline={true}
									value={description}
									autoCapitalize={'none'}
									placeholder={"Description of your kids"}
									returnKeyType={'done'}
									onChangeText={(dec) => setDescription(dec)}
								/>
							</View>


                            <TouchableOpacity style={styles.btnLogin}
                                onPress={() => btnBusinessProfile()}>
                                <Text style={styles.loginText}>
                                    {i18n.t('SaveProfile')}
                                </Text>
                            </TouchableOpacity>
                        </View>
                </ScrollView>
            </View>

            {isLoading ?
                <LoadingView  />
                : null}
        </View>
        </SafeAreaView>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white,
    },
    mobileView: {
        marginTop: 10, flexDirection: 'row', backgroundColor: Colors.lightGrey01, borderRadius: 6,
        height: 50, alignItems: 'center'
    },
    textInputMobile: {
        marginLeft: 10, marginRight: 10, height: 50, flex: 1, fontSize: FontSize.FS_14, fontFamily: ConstantKey.MONTS_REGULAR,
        color: Colors.dimGray,
    },
    btnLogin: {
        backgroundColor: Colors.black,
        marginVertical: 48, height: 45, borderRadius: 10, alignItems: 'center', justifyContent: 'center',
    },
    loginText: {
        fontSize: FontSize.FS_16, color: Colors.white,
        fontFamily: ConstantKey.MONTS_SEMIBOLD
    },
});
export default PersonalProfile