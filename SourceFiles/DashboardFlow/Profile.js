//import liraries
import React, { Component, useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, TextInput, Image, Keyboard, ImageBackground, ScrollView, Alert } from 'react-native';


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
import { navigate } from '../Constants/NavigationService';
const Profile = ({ navigation }) => {

    const [isLoading, setIsLoading] = useState(false)
    const [FullName, setFullName] = useState('')
    const [PhoneNumber, setPhoneNumber] = useState("")
    const [SubCategory, setSubCategory] = useState('')
    const [BusinessPhone, setBusinessPhone] = useState('')
    const [Email, setEmail] = useState('')
    const [ProfileImg, setProfileImg] = useState(null)
    const [Address, setAddress] = useState('')
    const [UserData, setUserData] = useState(null);

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
                console.log(JSON.stringify("Api_Get_Profile Response : " + JSON.stringify(response)));
                if (response.data.status == true) {
                    var data = response.data.data
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

    const storeData = async (value) => {
        try {
            await AsyncStorage.setItem(ConstantKey.USER_DATA, value)
        } catch (e) {
            console.log("Error :", e)
        }
    }
    const btnBusinessProfile = (params) => {
        navigation.navigate('UpdateProfile', { userData: [] })
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
        <View style={styles.container}>
            <View style={{ flex: 1, backgroundColor: Colors.white }}>


                <ScrollView style={{}}>
                    <SafeAreaView style={{ flex: 1, marginVertical: 10, marginHorizontal: 10 }}>
                        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                            <View style={{ flexDirection: "row", alignItems: "center", }}>
                                <TouchableOpacity onPress={() => { navigation.goBack() }}
                                    style={{ marginRight: 10, marginBottom: 5, padding: 10 }}>
                                    <Icon name={"chevron-left"} size={20} color={Colors.black} />

                                </TouchableOpacity>

                                <Text style={{
                                    fontSize: FontSize.FS_26,
                                    color: Colors.black,
                                    fontFamily: ConstantKey.MONTS_SEMIBOLD,
                                }}>
                                    {"My Profile"}
                                </Text>
                            </View>


                            <TouchableOpacity onPress={() => { navigation.goBack() }}
                                style={{ backgroundColor: Colors.primary, padding: 5, borderRadius: 25, marginHorizontal: 10 }}>
                                <MaterialCommunityIcons name={"power-standby"} size={18} color={Colors.white} />
                            </TouchableOpacity>


                        </View>

                        <View style={{ marginHorizontal: 10, marginTop: 10, marginBottom: 5 }}>
                            <Text style={{
                                fontSize: FontSize.FS_22,
                                color: Colors.black,
                                fontFamily: ConstantKey.MONTS_MEDIUM,

                            }}>
                                {i18n.t('PersonalProfile')}
                            </Text>
                        </View>
                        <View style={{
                            borderRadius: 5,
                            marginHorizontal: 10,
                            padding: 10,
                            borderWidth: 1,
                            borderColor: Colors.primary
                        }}>
                            <TouchableOpacity onPress={() => {
                                navigate("PersonalProfile")
                            }}
                                style={{
                                    backgroundColor: Colors.primary,
                                    alignSelf: "flex-end",
                                    paddingVertical: 2,
                                    paddingHorizontal: 16,
                                    borderRadius: 15,
                                }}>
                                <Text style={{
                                    fontSize: FontSize.FS_14,
                                    fontFamily: ConstantKey.MONTS_REGULAR,
                                    color: Colors.white
                                }}>{"Edit"}</Text>
                            </TouchableOpacity>
                            <View style={{
                                flexDirection: "row",
                                alignItems: "center",
                            }}  >
                                <View style={{
                                    backgroundColor: Colors.white, borderRadius: 10, marginLeft: 5, height: 90, width: 90, alignItems: 'center', justifyContent: 'center',
                                }}>
                                    <Image style={{ height: 80, width: 80, }}
                                        resizeMode='cover'
                                        source={{ uri: UserData?.user?.avatar_url }} />
                                </View>
                                <View style={{ flex: 1, marginLeft: 20, backgroundColor: Colors.white }}>
                                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                                        <MaterialCommunityIcons name={"account"} size={18} color={Colors.primary} style={{ marginRight: 5 }} />
                                        <Text style={[styles.calloutTitle, { marginTop: 4 }]}>{UserData?.user?.first_name + " " + UserData?.user?.last_name}</Text>
                                    </View>
                                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                                        <MaterialCommunityIcons name={"phone"} size={18} color={Colors.darkGrey} style={{ marginRight: 5 }} />
                                        <Text style={styles.calloutDescription}>+91 {UserData?.user?.phone}</Text>
                                    </View>
                                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                                        <MaterialCommunityIcons name={"email"} size={18} color={Colors.darkGrey} style={{ marginRight: 5 }} />
                                        <Text style={styles.calloutDescription}>{UserData?.user?.email}</Text>
                                    </View>
                                </View>
                            </View>
                        </View>

                        <View style={{ marginHorizontal: 10, marginTop: 20, marginBottom: 5 }}>
                            <Text style={{
                                fontSize: FontSize.FS_22,
                                color: Colors.black,
                                fontFamily: ConstantKey.MONTS_MEDIUM,
                            }}>
                                {i18n.t('BusinessProfile')}
                            </Text>
                        </View>
                        {UserData?.user?.is_business_profile == 1 ?
                            <View style={{
                                borderRadius: 5,
                                marginHorizontal: 10,
                                padding: 10,
                                borderWidth: 1,
                                borderColor: Colors.primary

                            }}>
                             { UserData?.user?.business?  <TouchableOpacity onPress={() => {
                                    navigate("BusinessProfile")
                                }}
                                    style={{
                                        backgroundColor: Colors.primary,
                                        alignSelf: "flex-end",
                                        paddingVertical: 2,
                                        paddingHorizontal: 16,
                                        borderRadius: 15,
                                    }}>
                                    <Text style={{
                                        fontSize: FontSize.FS_14,
                                        fontFamily: ConstantKey.MONTS_REGULAR,
                                        color: Colors.white
                                    }}>{"Edit"}</Text>
                                </TouchableOpacity> :null }

                                <View style={{ flex: 1, marginLeft: 20, backgroundColor: Colors.white }}>
                                 {UserData?.user?.business?.business_name &&   <View style={{ flexDirection: "row", alignItems: "center" }}>
                                        <MaterialCommunityIcons name={"domain"} size={18} color={Colors.primary} style={{ marginRight: 5 }} />
                                        <Text style={[styles.calloutTitle, { marginTop: 4 }]}>{UserData?.user?.business?.business_name}</Text>
                                    </View>}
                                    {UserData?.user?.business?.subcategory_name&&
                                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                                        <MaterialCommunityIcons name={"format-list-checkbox"} size={18} color={Colors.darkGrey} style={{ marginRight: 5 }} />
                                        <Text style={[styles.calloutDescription, { marginTop: 4 }]}>{UserData?.user?.business?.subcategory_name}</Text>
                                    </View>}
                                    {UserData?.user?.business?.phone&&
                                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                                        <MaterialCommunityIcons name={"phone"} size={18} color={Colors.darkGrey} style={{ marginRight: 5 }} />
                                        <Text style={styles.calloutDescription}>+91 {UserData?.user?.business?.phone}</Text>
                                    </View>}
                                    {UserData?.user?.business?.email&&
                                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                                        <MaterialCommunityIcons name={"email"} size={18} color={Colors.darkGrey} style={{ marginRight: 5 }} />
                                        <Text style={styles.calloutDescription}>{UserData?.user?.business?.email}</Text>
                                    </View> }
                                    {UserData?.user?.business?.address_line_one &&
                                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                                        <MaterialCommunityIcons name={"map-marker-outline"} size={18} color={Colors.darkGrey} style={{ marginRight: 5 }} />
                                        <Text style={styles.calloutDescription}>{UserData?.user?.business?.address_line_one}</Text>
                                    </View> }
                                </View>
                                {/* </View> */}
                            </View>
                            :
                            <View style={{
                                borderRadius: 5,
                                marginHorizontal: 10,
                                padding: 10,
                                borderWidth: 1,
                                borderColor: Colors.primary,
                                alignItems:"center"

                            }}>
                                <Text style={{
                                    fontSize: FontSize.FS_22,
                                    color: Colors.primary,
                                    fontFamily: ConstantKey.MONTS_MEDIUM,
                                    textAlign:"center"
                                }}>
                                    {"Want To Join \n Business Community ?"}
                                </Text>
                                <TouchableOpacity onPress={() =>{
                                    navigate("BusinessProfile",{isFromProfile: true})
                                }}
                                style={{
                                borderRadius: 50,
                                margin: 10,
                                paddingVertical: 6,
                                paddingHorizontal: 30,
                                borderWidth: 1,
                                borderColor: Colors.primary,
                                alignItems:"center",
                                backgroundColor:Colors.primary

                            }}>
                                <Text style={{
                                    fontSize: FontSize.FS_16,
                                    color: Colors.white,
                                    fontFamily: ConstantKey.MONTS_MEDIUM,
                                    textAlign:"center"
                                }}>
                                    {"Click Here"}
                                </Text>
                                </TouchableOpacity>
                            </View>}
                    </SafeAreaView>
                </ScrollView>
            </View>

            {isLoading ?
                <LoadingView text={"Please Wait..."} />
                : null}
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white,
    },
    calloutTitle: {
        fontSize: FontSize.FS_16,
        fontFamily: ConstantKey.MONTS_SEMIBOLD,
        color: Colors.primary
    },
    calloutDescription: {
        marginTop: 5,
        fontSize: FontSize.FS_14,
        fontFamily: ConstantKey.MONTS_REGULAR,
        color: Colors.darkGrey,

    },
});
export default Profile